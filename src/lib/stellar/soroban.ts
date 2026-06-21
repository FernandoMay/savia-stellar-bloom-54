import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from './config';
import { signTransactionWithFreighter } from './wallet';
import type { NFTMetadata, NFTStage } from './types';

const rpc = new StellarSdk.rpc.Server(STELLAR_CONFIG.SOROBAN_RPC_URL);

export async function getAccountInfo(publicKey: string) {
  try {
    const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
    const account = await server.loadAccount(publicKey);
    return {
      address: publicKey,
      sequence: account.sequenceNumber(),
      balances: account.balances,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`No se pudo cargar la cuenta: ${message}`);
  }
}

export async function getXLMBalance(publicKey: string): Promise<string> {
  try {
    const accountInfo = await getAccountInfo(publicKey);
    const nativeBalance = accountInfo.balances.find(
      (b: { asset_type: string }) => b.asset_type === 'native'
    );
    return (nativeBalance as { balance: string })?.balance || '0';
  } catch {
    return '0';
  }
}

function buildNFTMetadata(stageData: NFTStage, donationAmount: number): NFTMetadata {
  return {
    name: `${STELLAR_CONFIG.APP_NAME} ${stageData.name}`,
    description: stageData.description,
    image: stageData.imageUrl,
    ipfs_hash: stageData.ipfsHash,
    external_url: `${window.location.origin}/nft/${stageData.id}`,
    attributes: [
      { trait_type: 'Growth Stage', value: stageData.name },
      { trait_type: 'Rarity', value: stageData.attributes.rarity },
      { trait_type: 'Threshold', value: stageData.threshold },
      { trait_type: 'Donation Amount', value: donationAmount },
      { trait_type: 'IPFS Hash', value: stageData.ipfsHash },
      { trait_type: 'Minted At', value: new Date().toISOString() },
    ],
    properties: {
      category: 'Dynamic Growth NFT',
      collection: STELLAR_CONFIG.APP_NAME,
      network: STELLAR_CONFIG.NETWORK,
      contract: STELLAR_CONFIG.CONTRACT_ID,
    },
  };
}

async function pollTransaction(hash: string): Promise<StellarSdk.rpc.Api.GetSuccessfulTransactionResponse> {
  let attempts = 0;
  const maxAttempts = 30;
  while (attempts < maxAttempts) {
    const result = await rpc.getTransaction(hash);
    if (result.status === 'SUCCESS') {
      return result as StellarSdk.rpc.Api.GetSuccessfulTransactionResponse;
    }
    if (result.status === 'FAILED') {
      throw new Error(`Transacción falló en la red: ${hash}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    attempts++;
  }
  throw new Error('Tiempo de espera agotado para la confirmación de la transacción');
}

export async function mintNFTOnSoroban(
  userAddress: string,
  stageData: NFTStage,
  donationAmount: number
): Promise<{ hash: string; success: boolean }> {
  const metadata = buildNFTMetadata(stageData, donationAmount);
  const sourceAccount = await rpc.getAccount(userAddress);
  const contract = new StellarSdk.Contract(STELLAR_CONFIG.CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'mint',
        StellarSdk.nativeToScVal(userAddress, { type: 'address' }),
        StellarSdk.nativeToScVal(JSON.stringify(metadata), { type: 'string' }),
        StellarSdk.nativeToScVal(stageData.id, { type: 'u32' })
      )
    )
    .setTimeout(300)
    .build();

  const simulated = await rpc.simulateTransaction(tx);

  if (StellarSdk.rpc.Api.isSimulationError(simulated)) {
    throw new Error(`La simulación del contrato falló: ${simulated.error || 'Error desconocido'}. Verifica que el contrato esté desplegado en la red.`);
  }

  if (StellarSdk.rpc.Api.isSimulationRestore(simulated)) {
    const restoreTx = StellarSdk.rpc.assembleTransaction(tx, simulated).build();
    const restoreSigned = await signTransactionWithFreighter(restoreTx.toXDR());
    const restoreParsed = StellarSdk.TransactionBuilder.fromXDR(restoreSigned, STELLAR_CONFIG.NETWORK_PASSPHRASE);
    const restoreResult = await rpc.sendTransaction(restoreParsed);
    if (restoreResult.status === 'ERROR') {
      throw new Error('Error al restaurar datos del contrato');
    }
    await pollTransaction(restoreResult.hash);
  }

  const preparedTx = StellarSdk.rpc.assembleTransaction(tx, simulated).build();
  const signedXdr = await signTransactionWithFreighter(preparedTx.toXDR());
  const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, STELLAR_CONFIG.NETWORK_PASSPHRASE);
  const sendResult = await rpc.sendTransaction(txToSubmit);

  if (sendResult.status === 'ERROR') {
    throw new Error(`La transacción fue rechazada por la red: ${sendResult.errorResult?.result?.code?.toString() || 'código desconocido'}`);
  }

  const confirmed = await pollTransaction(sendResult.hash);

  return {
    hash: sendResult.hash,
    success: confirmed.status === 'SUCCESS',
  };
}

export async function sendDonationPayment(
  senderAddress: string,
  recipientAddress: string,
  amountXLM: string
): Promise<{ hash: string; success: boolean }> {
  const server = new StellarSdk.Horizon.Server(STELLAR_CONFIG.HORIZON_URL);
  const sourceAccount = await server.loadAccount(senderAddress);

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: STELLAR_CONFIG.NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: recipientAddress,
        asset: StellarSdk.Asset.native(),
        amount: amountXLM,
      })
    )
    .setTimeout(180)
    .build();

  const signedXdr = await signTransactionWithFreighter(tx.toXDR());
  const txToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, STELLAR_CONFIG.NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(txToSubmit as StellarSdk.Transaction);

  return {
    hash: result.hash,
    success: result.successful,
  };
}

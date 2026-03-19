import {
  requestAccess,
  getAddress,
  isConnected,
  isAllowed,
  signTransaction,
  getNetworkDetails,
} from '@stellar/freighter-api';
import { STELLAR_CONFIG } from './config';
import type { WalletInfo } from './types';

/**
 * Check if Freighter extension is installed
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const result = await isConnected();
    return result.isConnected;
  } catch {
    return false;
  }
}

/**
 * Check if our app is allowed by Freighter
 */
export async function isFreighterAllowed(): Promise<boolean> {
  try {
    const result = await isAllowed();
    return result.isAllowed;
  } catch {
    return false;
  }
}

/**
 * Connect to Freighter wallet
 */
export async function connectFreighter(): Promise<WalletInfo> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error(
      'Freighter wallet no está instalado. Instálalo desde https://freighter.app'
    );
  }

  // Request access (prompts user to approve)
  const accessResult = await requestAccess();
  if (accessResult.error) {
    throw new Error(`Error al conectar: ${accessResult.error}`);
  }

  // Get the public key
  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new Error('No se pudo obtener la dirección de la wallet');
  }

  // Verify network
  const networkResult = await getNetworkDetails();
  if (networkResult.error) {
    console.warn('No se pudo verificar la red:', networkResult.error);
  }

  return {
    address: addressResult.address,
    type: 'freighter',
    network: networkResult.networkPassphrase || STELLAR_CONFIG.NETWORK_PASSPHRASE,
    connected: true,
  };
}

/**
 * Sign a transaction XDR using Freighter
 */
export async function signTransactionWithFreighter(
  xdr: string,
  networkPassphrase: string = STELLAR_CONFIG.NETWORK_PASSPHRASE
): Promise<string> {
  const result = await signTransaction(xdr, {
    networkPassphrase,
  });

  if (result.error) {
    throw new Error(`Error al firmar transacción: ${result.error}`);
  }

  return result.signedTxXdr;
}

/**
 * Fund an account on testnet using Friendbot
 */
export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${STELLAR_CONFIG.FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`
    );
    return response.ok;
  } catch {
    console.warn('Friendbot funding failed');
    return false;
  }
}

import React, { useState, useEffect } from 'react';
import { Wallet, Leaf, Gift, TrendingUp, Star, Trophy, Crown, Diamond, Download, RefreshCw, ExternalLink, LogOut, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStellarWallet } from '@/hooks/use-stellar-wallet';
import { mintNFTOnSoroban } from '@/lib/stellar/soroban';
import { STELLAR_CONFIG } from '@/lib/stellar/config';
import type { NFTRecord } from '@/lib/stellar/types';
import { nftStages } from '@/lib/stellar/nft-stages';
import { toast } from '@/components/ui/sonner';

const stageIcons = [
  <Leaf className="w-5 h-5" />,
  <Gift className="w-5 h-5" />,
  <TrendingUp className="w-5 h-5" />,
  <Star className="w-5 h-5" />,
  <Trophy className="w-5 h-5" />,
  <Crown className="w-5 h-5" />,
  <Diamond className="w-5 h-5" />,
];

const StellarNFTDashboard = () => {
  const {
    wallet,
    balance,
    isConnecting,
    isFreighterAvailable,
    connect,
    disconnect,
    refreshBalance,
  } = useStellarWallet();

  const [totalDonations, setTotalDonations] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [nftCollection, setNftCollection] = useState<NFTRecord[]>([]);
  const [donationAmount, setDonationAmount] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  // Calculate current stage based on donations
  useEffect(() => {
    const newStage = nftStages.reduce((prev, curr) => {
      return totalDonations >= curr.threshold ? curr.id : prev;
    }, 0);
    setCurrentStage(newStage);
  }, [totalDonations]);

  const getProgressToNext = () => {
    const nextStage = nftStages[currentStage + 1];
    if (!nextStage) return 100;
    const currentThreshold = nftStages[currentStage].threshold;
    const progress =
      ((totalDonations - currentThreshold) /
        (nextStage.threshold - currentThreshold)) *
      100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleDonation = async () => {
    if (!wallet || !donationAmount) return;

    const amount = parseFloat(donationAmount);
    if (amount <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    try {
      setIsMinting(true);

      const newTotal = totalDonations + amount;
      const newStage = nftStages.reduce((prev, curr) => {
        return newTotal >= curr.threshold ? curr.id : prev;
      }, 0);

      // If reached a new stage, mint NFT
      if (newStage > currentStage) {
        toast.info(`Minteando NFT ${nftStages[newStage].name}...`);

        const result = await mintNFTOnSoroban(
          wallet.address,
          nftStages[newStage],
          amount
        );

        if (result.success) {
          const nftRecord: NFTRecord = {
            tokenId: `SAVIA_${newStage}_${Date.now()}`,
            owner: wallet.address,
            stage: newStage,
            metadata: {
              name: `${STELLAR_CONFIG.APP_NAME} ${nftStages[newStage].name}`,
              description: nftStages[newStage].description,
              image: nftStages[newStage].imageUrl,
              ipfs_hash: nftStages[newStage].ipfsHash,
              external_url: `${window.location.origin}/nft/${newStage}`,
              attributes: [
                { trait_type: 'Growth Stage', value: nftStages[newStage].name },
                { trait_type: 'Rarity', value: nftStages[newStage].attributes.rarity },
              ],
              properties: {
                category: 'Dynamic Growth NFT',
                collection: STELLAR_CONFIG.APP_NAME,
                network: STELLAR_CONFIG.NETWORK,
                contract: STELLAR_CONFIG.CONTRACT_ID,
              },
            },
            transactionHash: result.hash,
            mintedAt: new Date().toISOString(),
            donationAmount: amount,
          };

          setNftCollection((prev) => [...prev, nftRecord]);
          toast.success(
            `🎉 ¡Desbloqueaste el NFT ${nftStages[newStage].name}!`
          );
        }
      } else {
        toast.success('¡Donación registrada exitosamente!');
      }

      setTotalDonations(newTotal);
      setDonationAmount('');

      // Refresh balance
      if (refreshBalance) {
        await refreshBalance();
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error: ${message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const downloadNFT = async (nft: NFTRecord) => {
    try {
      const response = await fetch(nft.metadata.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nft.metadata.name}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('NFT descargado');
    } catch {
      toast.error('Error al descargar NFT');
    }
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {STELLAR_CONFIG.APP_NAME} — NFT Dinámico
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Observa cómo crece tu impacto con cada donación en la red Stellar
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-mono text-xs">
              {STELLAR_CONFIG.NETWORK.toUpperCase()}
            </Badge>
            <span className="font-mono">
              {STELLAR_CONFIG.CONTRACT_ID.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Wallet Connection */}
        <Card className="p-6 shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  Stellar Wallet
                </h3>
                {wallet ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-mono">
                      {truncateAddress(wallet.address)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Coins className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-medium text-card-foreground">
                        {parseFloat(balance).toFixed(2)} XLM
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isFreighterAvailable
                      ? 'Conecta tu wallet Freighter para comenzar'
                      : 'Instala Freighter desde freighter.app'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {wallet ? (
                <>
                  <Button
                    onClick={refreshBalance}
                    variant="mint"
                    size="sm"
                    className="rounded-full"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <a
                    href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="rounded-full">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button
                    onClick={disconnect}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={connect}
                  disabled={isConnecting}
                  variant="donate"
                  className="rounded-full w-full sm:w-auto"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Conectando...' : 'Conectar Freighter'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Current Stage Display */}
        <Card className="p-6 shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">
              Etapa Actual de Crecimiento
            </h2>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Donado</p>
              <p className="text-2xl font-bold text-card-foreground">
                ${totalDonations}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-full text-white ${nftStages[currentStage].color}`}
                >
                  {stageIcons[currentStage]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {nftStages[currentStage].name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {nftStages[currentStage].description}
                  </p>
                </div>
              </div>

              <Badge
                variant="secondary"
                className="capitalize"
              >
                {nftStages[currentStage].attributes.rarity}
              </Badge>

              {currentStage < nftStages.length - 1 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progreso a {nftStages[currentStage + 1].name}
                    </span>
                    <span className="text-card-foreground font-medium">
                      ${totalDonations} / ${nftStages[currentStage + 1].threshold}
                    </span>
                  </div>
                  <Progress value={getProgressToNext()} className="h-2" />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <img
                src={nftStages[currentStage].imageUrl}
                alt={nftStages[currentStage].name}
                className="w-48 h-48 rounded-lg shadow-elegant object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Card>

        {/* Donation Interface */}
        {wallet && (
          <Card className="p-6 shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-card-foreground mb-4">
              Hacer una Donación
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 25, 50].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    onClick={() => setDonationAmount(amt.toString())}
                    className="rounded-full"
                  >
                    ${amt}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Cantidad personalizada ($)"
                  className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button
                  onClick={handleDonation}
                  disabled={isMinting || !donationAmount}
                  variant="donate"
                  className="rounded-full px-6"
                >
                  {isMinting ? 'Procesando...' : 'Donar'}
                </Button>
              </div>
              {donationAmount && parseFloat(donationAmount) > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  Al donar, se interactúa con el contrato inteligente en Stellar {STELLAR_CONFIG.NETWORK}
                </p>
              )}
            </div>
          </Card>
        )}

        {/* NFT Collection */}
        {nftCollection.length > 0 && (
          <Card className="p-6 shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-card-foreground mb-4">
              Tu Colección de NFTs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nftCollection.map((nft, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="w-full h-36 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-full text-white ${nftStages[nft.stage].color}`}
                        >
                          {stageIcons[nft.stage]}
                        </div>
                        <h3 className="font-semibold text-card-foreground text-sm">
                          {nft.metadata.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => downloadNFT(nft)}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {nft.metadata.description}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
                      <p>TX: {nft.transactionHash.slice(0, 16)}...</p>
                      <p>{new Date(nft.mintedAt).toLocaleDateString('es-MX')}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Growth Stages Overview */}
        <Card className="p-6 shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-card-foreground mb-4">
            Etapas de Crecimiento
          </h2>
          <div className="space-y-3">
            {nftStages.map((stage) => {
              const isUnlocked = currentStage >= stage.id;
              const isCurrent = currentStage === stage.id;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                    isCurrent
                      ? 'border-primary/30 bg-primary/5 shadow-soft'
                      : isUnlocked
                      ? 'border-border/50 bg-card/50'
                      : 'border-border/20 bg-muted/30 opacity-60'
                  }`}
                >
                  <img
                    src={stage.imageUrl}
                    alt={stage.name}
                    className="w-14 h-14 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div
                    className={`p-2 rounded-full text-white ${stage.color} ${
                      isUnlocked ? 'opacity-100' : 'opacity-40'
                    }`}
                  >
                    {stageIcons[stage.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground">
                      {stage.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {stage.description}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {stage.attributes.rarity}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-card-foreground">
                      ${stage.threshold}+
                    </p>
                    {isUnlocked && (
                      <span className="text-xs text-primary font-medium">
                        ✓ Desbloqueado
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StellarNFTDashboard;

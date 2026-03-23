import React from 'react';
import { Wallet, Leaf, ExternalLink, LogOut, Coins, RefreshCw, Lock, Trophy, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStellarWallet } from '@/hooks/use-stellar-wallet';
import { useCampaigns } from '@/context/CampaignContext';
import { STELLAR_CONFIG } from '@/lib/stellar/config';
import { nftStages, getStageForXLM, getNextStageForXLM } from '@/lib/stellar/nft-stages';
import { useNavigate } from 'react-router-dom';

const StellarNFTDashboard = () => {
  const { wallet, balance, isConnecting, isFreighterAvailable, connect, disconnect, refreshBalance } = useStellarWallet();
  const { donations } = useCampaigns();
  const navigate = useNavigate();

  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Not connected state
  if (!wallet) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Mis Insignias NFT</h1>
          <p className="text-muted-foreground">
            Conecta tu wallet Freighter para ver las insignias que has ganado al donar en campañas de Savia.
          </p>
          <Button onClick={connect} disabled={isConnecting} variant="donate" className="rounded-full px-8">
            <Wallet className="w-4 h-4 mr-2" />
            {isConnecting ? 'Conectando...' : isFreighterAvailable ? 'Conectar Freighter' : 'Instala Freighter'}
          </Button>
          {!isFreighterAvailable && (
            <p className="text-xs text-muted-foreground">
              Descarga Freighter en{' '}
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                freighter.app
              </a>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Connected — calculate user stats
  const pesoRate = 18.0;
  const userDonations = donations.filter(d => d.donor === wallet.address);
  const totalDonatedMXN = userDonations.reduce((sum, d) => sum + d.amountMXN, 0);
  const totalDonatedXLM = totalDonatedMXN / pesoRate;
  const currentStage = getStageForXLM(totalDonatedXLM);
  const nextStage = getNextStageForXLM(totalDonatedXLM);
  const unlockedStages = nftStages.filter(s => totalDonatedXLM >= s.threshold);
  const lockedStages = nftStages.filter(s => totalDonatedXLM < s.threshold);

  const getProgressToNext = () => {
    if (!nextStage) return 100;
    const currentThreshold = currentStage.threshold;
    return Math.min(((totalDonatedXLM - currentThreshold) / (nextStage.threshold - currentThreshold)) * 100, 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mis Insignias NFT</h1>
          <p className="text-muted-foreground">Tu colección de impacto en la blockchain de Stellar</p>
        </div>

        {/* Wallet Info Bar */}
        <Card className="p-4 shadow-card border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">{truncateAddress(wallet.address)}</span>
              <Badge variant="outline" className="text-xs font-mono">
                <Coins className="w-3 h-3 mr-1" />
                {parseFloat(balance).toFixed(2)} XLM
              </Badge>
              <Badge variant="secondary" className="text-xs">{STELLAR_CONFIG.NETWORK.toUpperCase()}</Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshBalance} variant="ghost" size="sm" className="rounded-full">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <a href={`https://stellar.expert/explorer/testnet/account/${wallet.address}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="rounded-full"><ExternalLink className="w-4 h-4" /></Button>
              </a>
              <Button onClick={disconnect} variant="ghost" size="sm" className="rounded-full text-destructive">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center border-0 shadow-card bg-card/80">
            <p className="text-2xl font-bold text-foreground">{userDonations.length}</p>
            <p className="text-xs text-muted-foreground">Donaciones</p>
          </Card>
          <Card className="p-4 text-center border-0 shadow-card bg-card/80">
            <p className="text-2xl font-bold text-foreground">${totalDonatedMXN.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">MXN Donados</p>
          </Card>
          <Card className="p-4 text-center border-0 shadow-card bg-card/80">
            <p className="text-2xl font-bold text-foreground">{unlockedStages.length}</p>
            <p className="text-xs text-muted-foreground">Insignias</p>
          </Card>
          <Card className="p-4 text-center border-0 shadow-card bg-card/80">
            <p className="text-2xl font-bold text-foreground capitalize">{currentStage.attributes.rarity}</p>
            <p className="text-xs text-muted-foreground">Rango Actual</p>
          </Card>
        </div>

        {/* Current Stage Hero */}
        <Card className="overflow-hidden border-0 shadow-elegant bg-card/80 backdrop-blur-sm">
          <div className="grid md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center space-y-4">
              <Badge variant="secondary" className="w-fit capitalize">{currentStage.attributes.rarity}</Badge>
              <h2 className="text-2xl font-bold text-card-foreground">{currentStage.name}</h2>
              <p className="text-muted-foreground">{currentStage.description}</p>
              {nextStage && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Próxima: {nextStage.name}</span>
                    <span className="text-card-foreground font-medium">{totalDonatedXLM.toFixed(1)} / {nextStage.threshold} XLM</span>
                  </div>
                  <Progress value={getProgressToNext()} className="h-2" />
                </div>
              )}
              {nextStage && (
                <Button variant="donate" className="rounded-full w-fit" onClick={() => navigate('/')}>
                  <Leaf className="w-4 h-4 mr-2" /> Donar para subir de nivel
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center p-8 bg-primary/5">
              <img
                src={currentStage.imageUrl}
                alt={currentStage.name}
                className="w-48 h-48 rounded-2xl shadow-elegant object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </Card>

        {/* Unlocked Badges */}
        {unlockedStages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Insignias Desbloqueadas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unlockedStages.map(stage => (
                <Card key={stage.id} className="overflow-hidden border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card/90">
                  <div className="aspect-square relative">
                    <img src={stage.imageUrl} alt={stage.name} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[10px] capitalize backdrop-blur-sm">{stage.attributes.rarity}</Badge>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-card-foreground text-sm">{stage.name}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{stage.description}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{stage.threshold}+ XLM</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedStages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-foreground" /> Por Desbloquear
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lockedStages.map(stage => (
                <Card key={stage.id} className="overflow-hidden border-0 shadow-card opacity-60 bg-card/60">
                  <div className="aspect-square relative">
                    <img src={stage.imageUrl} alt={stage.name} className="w-full h-full object-cover grayscale" loading="lazy" />
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-background/80" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="text-[10px] capitalize backdrop-blur-sm bg-background/50">{stage.attributes.rarity}</Badge>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h3 className="font-semibold text-card-foreground text-sm">{stage.name}</h3>
                    <p className="text-[10px] font-mono text-muted-foreground">Requiere {stage.threshold}+ XLM</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no donations */}
        {userDonations.length === 0 && (
          <Card className="p-8 text-center border-0 shadow-card bg-card/80">
            <Leaf className="w-12 h-12 mx-auto text-primary/40 mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Aún no tienes donaciones</h3>
            <p className="text-muted-foreground mb-4">Dona a una campaña para empezar a coleccionar insignias NFT</p>
            <Button variant="donate" className="rounded-full" onClick={() => navigate('/')}>
              <Leaf className="w-4 h-4 mr-2" /> Explorar Campañas
            </Button>
          </Card>
        )}

        {/* Recent Donations */}
        {userDonations.length > 0 && (
          <Card className="border-0 shadow-card bg-card/80">
            <CardHeader><CardTitle className="text-card-foreground">Historial de Donaciones</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userDonations.slice().reverse().slice(0, 10).map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-card-foreground">${d.amountMXN.toFixed(0)} MXN</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(d.timestamp).toLocaleDateString('es-MX')}</p>
                    </div>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${d.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-xs hover:underline"
                    >
                      <span className="font-mono">{d.transactionHash.slice(0, 10)}...</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StellarNFTDashboard;

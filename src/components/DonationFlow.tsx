import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Leaf, Heart, DollarSign, Shield, Star, Info, CheckCircle, Wallet, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { useCampaigns } from "@/context/CampaignContext";
import { sendDonationPayment } from "@/lib/stellar/soroban";
import { STELLAR_CONFIG } from "@/lib/stellar/config";
import { nftStages, getStageForXLM, getNextStageForXLM } from "@/lib/stellar/nft-stages";
import { toast } from "@/components/ui/sonner";

export const DonationFlow = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { wallet, balance, connect, isConnecting, isFreighterAvailable } = useStellarWallet();
  const { campaigns, getCampaign, addDonation, getTotalDonatedByUser } = useCampaigns();
  
  const [donationAmount, setDonationAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [mintNFT, setMintNFT] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // Get campaign from context, fallback to first campaign
  const campaign = campaignId ? getCampaign(campaignId) : campaigns[0];

  if (!campaign) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Campaña no encontrada</h2>
        <Button variant="hero" className="rounded-full" onClick={() => navigate("/")}>
          Ver Campañas
        </Button>
      </div>
    );
  }

  const pesoRate = 18.0;
  const pesoAmount = parseFloat(donationAmount) || 0;
  const xlmAmount = pesoAmount / pesoRate;
  const platformFee = xlmAmount * 0.02;
  const netXlmAmount = xlmAmount - platformFee;
  const netPesoAmount = netXlmAmount * pesoRate;
  const progressPercent = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);

  // Use XLM-based totals to match NFT stage thresholds
  const userTotalDonatedXLM = wallet ? getTotalDonatedByUser(wallet.address) / pesoRate : 0;
  const newTotalXLM = userTotalDonatedXLM + netXlmAmount;
  const userTotalDonatedMXN = wallet ? getTotalDonatedByUser(wallet.address) : 0;
  const newTotalMXN = userTotalDonatedMXN + netPesoAmount;
  const currentStage = getStageForXLM(userTotalDonatedXLM);
  const newStage = getStageForXLM(newTotalXLM);
  const nextStage = getNextStageForXLM(newTotalXLM);

  const formatPesos = (amount: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(amount);

  const formatXLM = (amount: number) => `${amount.toFixed(4)} XLM`;

  const handleDonate = async () => {
    if (!wallet) { toast.error("Conecta tu wallet primero"); return; }
    if (!donationAmount || pesoAmount <= 0) { toast.error("Ingresa una cantidad válida"); return; }

    const userBalance = parseFloat(balance);
    if (xlmAmount > userBalance) {
      toast.error(`Saldo insuficiente. Tienes ${userBalance.toFixed(2)} XLM`);
      return;
    }

    setIsProcessing(true);
    try {
      toast.info("Firmando transacción con Freighter...");
      const result = await sendDonationPayment(
        wallet.address,
        campaign.walletAddress,
        netXlmAmount.toFixed(7)
      );

      if (result.success) {
        setLastTxHash(result.hash);
        addDonation({
          campaignId: campaign.id,
          donor: wallet.address,
          amountXLM: netXlmAmount,
          amountMXN: netPesoAmount,
          transactionHash: result.hash,
          anonymous: isAnonymous,
        });
        toast.success("¡Donación enviada exitosamente en la blockchain!");
        setDonationAmount("");
      } else {
        toast.error("La transacción no fue exitosa");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      if (message.includes('firmar') || message.includes('User')) {
        toast.error("Transacción cancelada por el usuario");
      } else {
        toast.error(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Hacer una Donación</h1>
          <p className="text-muted-foreground">
            Ayuda a pacientes mexicanos y haz crecer tu árbol de generosidad
          </p>
        </div>

        {/* Wallet Banner */}
        {!wallet ? (
          <Card className="mb-6 p-4 shadow-card border-0 bg-primary/5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Conecta tu wallet para donar</p>
                  <p className="text-sm text-muted-foreground">
                    {isFreighterAvailable ? 'Usa Freighter para transacciones en Stellar' : 'Instala Freighter desde freighter.app'}
                  </p>
                </div>
              </div>
              <Button onClick={connect} disabled={isConnecting} variant="donate" className="rounded-full">
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="mb-6 p-4 shadow-card border-0 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-mono text-muted-foreground">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}
                </span>
                <Badge variant="outline" className="text-xs">{parseFloat(balance).toFixed(2)} XLM</Badge>
              </div>
              <Badge variant="secondary" className="text-xs">{STELLAR_CONFIG.NETWORK.toUpperCase()}</Badge>
            </div>
          </Card>
        )}

        {lastTxHash && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Última TX: <span className="font-mono">{lastTxHash.slice(0, 16)}...</span>
              </span>
              <a href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary text-sm hover:underline">
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Campaign Info */}
            <Card className="shadow-card border-0">
              <CardHeader><CardTitle className="text-card-foreground">Campaña Seleccionada</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.image && (
                    <img src={campaign.image} alt={campaign.title} className="w-full h-40 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-medium text-card-foreground">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">Beneficiario: {campaign.beneficiaryName}</p>
                    <p className="text-sm text-muted-foreground">{campaign.location} · {campaign.category}</p>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progreso</span>
                      <span className="text-sm font-medium text-card-foreground">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{campaign.raisedAmount.toLocaleString()} XLM</span>
                      <span>{campaign.goalAmount.toLocaleString()} XLM</span>
                    </div>
                  </div>
                  {campaign.verified && (
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      <Shield className="w-3 h-3 mr-1" /> Campaña Verificada · Trust {campaign.trustScore}%
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Donation Form */}
            <Card className="shadow-card border-0">
              <CardHeader><CardTitle className="text-card-foreground">Detalles de Donación</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-card-foreground">Cantidad en Pesos Mexicanos</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="amount" type="number" placeholder="0.00" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} className="pl-9" />
                    </div>
                    {pesoAmount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Equivalente: {formatXLM(xlmAmount)} ({pesoRate} MXN/XLM)
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 2500].map(amt => (
                      <Button key={amt} variant="outline" size="sm" onClick={() => setDonationAmount(amt.toString())} className="rounded-full">
                        ${amt}
                      </Button>
                    ))}
                  </div>

                  {pesoAmount > 0 && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Donación:</span>
                        <span className="text-card-foreground font-medium">{formatPesos(pesoAmount)} ({formatXLM(xlmAmount)})</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Comisión Plataforma (2%):</span>
                        <span>{formatXLM(platformFee)}</span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between font-medium">
                          <span className="text-card-foreground">Total al Beneficiario:</span>
                          <span className="text-card-foreground">{formatPesos(netPesoAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="anonymous" className="text-card-foreground">Donación Anónima</Label>
                        <p className="text-sm text-muted-foreground">Tu nombre no aparecerá públicamente</p>
                      </div>
                      <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="nft" className="text-card-foreground">Recibir/Actualizar NFT</Label>
                        <p className="text-sm text-muted-foreground">Haz crecer tu árbol de generosidad</p>
                      </div>
                      <Switch id="nft" checked={mintNFT} onCheckedChange={setMintNFT} />
                    </div>
                  </div>

                  <Button onClick={handleDonate} className="w-full rounded-full" variant="donate" disabled={!wallet || !donationAmount || pesoAmount <= 0 || isProcessing}>
                    <Heart className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Procesando en Stellar...' : !wallet ? 'Conecta tu Wallet' : `Donar ${pesoAmount > 0 ? formatPesos(pesoAmount) : ''}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NFT Preview */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <Leaf className="w-5 h-5 mr-2 text-primary" /> Tu Árbol de Generosidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current NFT Stage with real asset */}
                  <div className="text-center p-6 bg-muted rounded-xl">
                    <img
                      src={currentStage.imageUrl}
                      alt={currentStage.name}
                      className="w-32 h-32 mx-auto rounded-xl shadow-elegant object-cover mb-3"
                      loading="lazy"
                    />
                    <h3 className="font-semibold text-card-foreground text-lg">{currentStage.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentStage.description}</p>
                    <Badge variant="secondary" className="mt-2 capitalize">{currentStage.attributes.rarity}</Badge>
                    <div className="text-lg font-bold mt-2 text-card-foreground">{formatPesos(userTotalDonatedMXN)} donados</div>
                  </div>

                  {/* Stage upgrade alert */}
                  {newStage && newStage.id !== currentStage.id && pesoAmount > 0 && (
                    <Alert className="border-primary/20 bg-primary/5">
                      <Star className="h-4 w-4 text-primary" />
                      <AlertDescription className="flex items-center gap-3 text-muted-foreground">
                        <img src={newStage.imageUrl} alt={newStage.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span>¡Esta donación elevará tu árbol a: <strong className="text-card-foreground">{newStage.name}</strong></span>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Progress to next stage */}
                  {nextStage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso a {nextStage.name}</span>
                        <span className="text-card-foreground font-medium">{newTotalXLM.toFixed(1)} / {nextStage.threshold} XLM</span>
                      </div>
                      <Progress value={Math.min((newTotalXLM / nextStage.threshold) * 100, 100)} className="h-2" />
                    </div>
                  )}

                  {/* All stages with real NFT images */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-card-foreground">Etapas de Crecimiento</h4>
                    {nftStages.map((stage) => {
                      const isCurrentNew = newTotalXLM >= stage.threshold && (stage.id === nftStages.length - 1 || newTotalXLM < (nftStages[stage.id + 1]?.threshold ?? Infinity));
                      const isCurrentExisting = userTotalDonatedXLM >= stage.threshold && (stage.id === nftStages.length - 1 || userTotalDonatedXLM < (nftStages[stage.id + 1]?.threshold ?? Infinity));
                      const isUnlocked = newTotalXLM >= stage.threshold;

                      return (
                        <div key={stage.id} className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                          isCurrentNew
                            ? 'bg-primary/10 border border-primary/20'
                            : isCurrentExisting
                            ? 'bg-muted border border-border/50'
                            : isUnlocked
                            ? 'bg-muted/50'
                            : 'opacity-40 bg-muted/20'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={stage.imageUrl}
                              alt={stage.name}
                              className={`w-9 h-9 rounded-lg object-cover ${!isUnlocked ? 'grayscale' : ''}`}
                              loading="lazy"
                            />
                            <div>
                              <div className="text-sm font-medium text-card-foreground">{stage.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {stage.threshold} XLM{stage.id < nftStages.length - 1 ? ` — ${nftStages[stage.id + 1].threshold} XLM` : '+'}
                              </div>
                            </div>
                          </div>
                          {isCurrentNew && <CheckCircle className="w-4 h-4 text-primary" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader><CardTitle className="text-card-foreground">Información de Pago</CardTitle></CardHeader>
              <CardContent>
                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-muted-foreground">
                    Los pagos se procesan en la blockchain de Stellar para máxima transparencia.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Red:</span>
                    <span className="text-card-foreground">Stellar ({STELLAR_CONFIG.NETWORK})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destino:</span>
                    <span className="text-card-foreground font-mono text-xs">{campaign.walletAddress.slice(0, 8)}...{campaign.walletAddress.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tiempo estimado:</span>
                    <span className="text-card-foreground">5-10 segundos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comisión de red:</span>
                    <span className="text-card-foreground">~0.00001 XLM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

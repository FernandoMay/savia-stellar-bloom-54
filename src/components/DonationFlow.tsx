import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { TreePine, Heart, DollarSign, Shield, Star, Info, CheckCircle, Wallet, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { sendDonationPayment } from "@/lib/stellar/soroban";
import { STELLAR_CONFIG } from "@/lib/stellar/config";
import { toast } from "@/components/ui/sonner";

interface TreeStage {
  name: string;
  minPesos: number;
  maxPesos: number;
  icon: string;
  description: string;
}

// Campaign recipient address (testnet)
const CAMPAIGN_RECIPIENT = 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR';

export const DonationFlow = () => {
  const { wallet, balance, connect, isConnecting, isFreighterAvailable } = useStellarWallet();
  const [donationAmount, setDonationAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [mintNFT, setMintNFT] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  const [selectedCampaign] = useState({
    id: "1",
    title: "Tratamiento de Cáncer de Mama para María",
    beneficiary: "María González",
    goalPesos: 250000,
    raisedPesos: 187500,
    pesoRate: 18.0
  });

  const treeStages: TreeStage[] = [
    { name: "Semilla", minPesos: 0, maxPesos: 499, icon: "🌱", description: "Comenzando tu árbol de generosidad" },
    { name: "Brote", minPesos: 500, maxPesos: 1499, icon: "🌿", description: "Tu generosidad está creciendo" },
    { name: "Plántula", minPesos: 1500, maxPesos: 4999, icon: "🌲", description: "Un árbol joven de esperanza" },
    { name: "Árbol Joven", minPesos: 5000, maxPesos: 9999, icon: "🌳", description: "Tu impacto es notable" },
    { name: "Árbol Maduro", minPesos: 10000, maxPesos: 24999, icon: "🌲", description: "Generosidad establecida" },
    { name: "Árbol Poderoso", minPesos: 25000, maxPesos: Infinity, icon: "🌲", description: "Máximo nivel de impacto" }
  ];

  const pesoAmount = parseFloat(donationAmount) || 0;
  const xlmAmount = pesoAmount / selectedCampaign.pesoRate;
  const platformFee = xlmAmount * 0.02;
  const netXlmAmount = xlmAmount - platformFee;
  const netPesoAmount = netXlmAmount * selectedCampaign.pesoRate;

  const getCurrentTreeStage = (totalPesos: number) => {
    return treeStages.find(stage => 
      totalPesos >= stage.minPesos && totalPesos <= stage.maxPesos
    ) || treeStages[0];
  };

  const getNextTreeStage = (totalPesos: number) => {
    const currentStageIndex = treeStages.findIndex(stage => 
      totalPesos >= stage.minPesos && totalPesos <= stage.maxPesos
    );
    return currentStageIndex < treeStages.length - 1 ? treeStages[currentStageIndex + 1] : null;
  };

  const userTotalDonated = 3200;
  const newTotal = userTotalDonated + netPesoAmount;
  const currentStage = getCurrentTreeStage(userTotalDonated);
  const newStage = getCurrentTreeStage(newTotal);
  const nextStage = getNextTreeStage(newTotal);

  const formatPesos = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatXLM = (amount: number) => `${amount.toFixed(4)} XLM`;

  const handleDonate = async () => {
    if (!wallet) {
      toast.error("Conecta tu wallet primero");
      return;
    }
    if (!donationAmount || pesoAmount <= 0) {
      toast.error("Ingresa una cantidad válida");
      return;
    }

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
        CAMPAIGN_RECIPIENT,
        netXlmAmount.toFixed(7)
      );

      if (result.success) {
        setLastTxHash(result.hash);
        toast.success("¡Donación enviada exitosamente en la blockchain!");
        setDonationAmount("");
      } else {
        toast.error("La transacción no fue exitosa");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      // For demo purposes, show success if it's a signing cancellation
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
        {!wallet && (
          <Card className="mb-6 p-4 shadow-card border-0 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-card-foreground">Conecta tu wallet para donar</p>
                  <p className="text-sm text-muted-foreground">
                    {isFreighterAvailable
                      ? 'Usa Freighter para transacciones en Stellar'
                      : 'Instala Freighter desde freighter.app'}
                  </p>
                </div>
              </div>
              <Button
                onClick={connect}
                disabled={isConnecting}
                variant="donate"
                className="rounded-full"
              >
                {isConnecting ? 'Conectando...' : 'Conectar Wallet'}
              </Button>
            </div>
          </Card>
        )}

        {wallet && (
          <Card className="mb-6 p-4 shadow-card border-0 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-mono text-muted-foreground">
                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-4)}
                </span>
                <Badge variant="outline" className="text-xs">
                  {parseFloat(balance).toFixed(2)} XLM
                </Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {STELLAR_CONFIG.NETWORK.toUpperCase()}
              </Badge>
            </div>
          </Card>
        )}

        {/* Last Transaction */}
        {lastTxHash && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Última TX: <span className="font-mono">{lastTxHash.slice(0, 16)}...</span>
              </span>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${lastTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary text-sm hover:underline"
              >
                Ver <ExternalLink className="w-3 h-3" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-card-foreground">Campaña Seleccionada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-card-foreground">{selectedCampaign.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Beneficiario: {selectedCampaign.beneficiary}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progreso</span>
                      <span className="text-sm font-medium text-card-foreground">
                        {((selectedCampaign.raisedPesos / selectedCampaign.goalPesos) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={(selectedCampaign.raisedPesos / selectedCampaign.goalPesos) * 100} />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{formatPesos(selectedCampaign.raisedPesos)}</span>
                      <span>{formatPesos(selectedCampaign.goalPesos)}</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Campaña Verificada
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-card-foreground">Detalles de Donación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-card-foreground">Cantidad en Pesos Mexicanos</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    {pesoAmount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Equivalente: {formatXLM(xlmAmount)} ({selectedCampaign.pesoRate} MXN/XLM)
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 2500].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setDonationAmount(amount.toString())}
                        className="rounded-full"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>

                  {pesoAmount > 0 && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Donación:</span>
                        <span className="text-card-foreground font-medium">
                          {formatPesos(pesoAmount)} ({formatXLM(xlmAmount)})
                        </span>
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
                        <p className="text-sm text-muted-foreground">
                          Tu nombre no aparecerá públicamente
                        </p>
                      </div>
                      <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="nft" className="text-card-foreground">Recibir/Actualizar NFT</Label>
                        <p className="text-sm text-muted-foreground">
                          Haz crecer tu árbol de generosidad
                        </p>
                      </div>
                      <Switch id="nft" checked={mintNFT} onCheckedChange={setMintNFT} />
                    </div>
                  </div>

                  <Button 
                    onClick={handleDonate}
                    className="w-full rounded-full"
                    variant="donate"
                    disabled={!wallet || !donationAmount || pesoAmount <= 0 || isProcessing}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {isProcessing
                      ? 'Procesando en Stellar...'
                      : !wallet
                      ? 'Conecta tu Wallet'
                      : `Donar ${pesoAmount > 0 ? formatPesos(pesoAmount) : ''}`}
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
                  <TreePine className="w-5 h-5 mr-2" />
                  Tu Árbol de Generosidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl mb-2">{currentStage.icon}</div>
                    <h3 className="font-medium text-card-foreground">{currentStage.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentStage.description}</p>
                    <div className="text-lg font-bold mt-2 text-card-foreground">
                      {formatPesos(userTotalDonated)} donados
                    </div>
                  </div>

                  {newStage && newStage !== currentStage && (
                    <Alert className="border-primary/20 bg-primary/5">
                      <Star className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-muted-foreground">
                        ¡Esta donación elevará tu árbol a: <strong className="text-card-foreground">{newStage.name} {newStage.icon}</strong>
                      </AlertDescription>
                    </Alert>
                  )}

                  {nextStage && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso a {nextStage.name}</span>
                        <span className="text-card-foreground font-medium">
                          {formatPesos(newTotal)} / {formatPesos(nextStage.minPesos)}
                        </span>
                      </div>
                      <Progress value={Math.min((newTotal / nextStage.minPesos) * 100, 100)} className="h-2" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-card-foreground">Etapas del Árbol</h4>
                    {treeStages.map((stage, index) => (
                      <div 
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          newTotal >= stage.minPesos && newTotal <= stage.maxPesos
                            ? 'bg-primary/10 border border-primary/20'
                            : userTotalDonated >= stage.minPesos && userTotalDonated <= stage.maxPesos
                            ? 'bg-muted border border-border/50'
                            : 'opacity-50 bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{stage.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-card-foreground">{stage.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatPesos(stage.minPesos)}
                              {stage.maxPesos !== Infinity ? ` - ${formatPesos(stage.maxPesos)}` : '+'}
                            </div>
                          </div>
                        </div>
                        {newTotal >= stage.minPesos && newTotal <= stage.maxPesos && (
                          <CheckCircle className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-card-foreground">Información de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="border-primary/20 bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-muted-foreground">
                    Los pagos se procesan en la blockchain de Stellar para máxima transparencia.
                    Tu donación es verificable en el explorador de bloques.
                  </AlertDescription>
                </Alert>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Red:</span>
                    <span className="text-card-foreground">Stellar ({STELLAR_CONFIG.NETWORK})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet:</span>
                    <span className="text-card-foreground">Freighter</span>
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

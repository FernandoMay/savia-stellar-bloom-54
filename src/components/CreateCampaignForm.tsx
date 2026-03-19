import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Upload, Heart, Shield, MapPin, DollarSign,
  CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Stethoscope
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { toast } from "@/components/ui/sonner";

interface CampaignFormData {
  title: string;
  description: string;
  beneficiaryName: string;
  location: string;
  category: string;
  goalAmount: string;
  medicalCondition: string;
  hospitalName: string;
  medicalDocDescription: string;
  walletAddress: string;
}

const categories = [
  "Oncología", "Cardiología", "Neurología", "Cirugía",
  "Rehabilitación", "Endocrinología", "Emergencias", "Otro"
];

export function CreateCampaignForm() {
  const navigate = useNavigate();
  const { wallet, connect, isConnecting } = useStellarWallet();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<CampaignFormData>({
    title: "",
    description: "",
    beneficiaryName: "",
    location: "",
    category: "",
    goalAmount: "",
    medicalCondition: "",
    hospitalName: "",
    medicalDocDescription: "",
    walletAddress: wallet?.address || "",
  });

  const updateField = (field: keyof CampaignFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const totalSteps = 3;
  const progressPercent = (step / totalSteps) * 100;

  const canAdvance = () => {
    if (step === 1) return form.title && form.description && form.beneficiaryName && form.location && form.category;
    if (step === 2) return form.goalAmount && form.medicalCondition && form.hospitalName;
    return true;
  };

  const handleSubmit = async () => {
    if (!wallet) {
      toast.error("Conecta tu wallet Stellar para recibir donaciones");
      return;
    }
    setIsSubmitting(true);
    try {
      // In production, this would call a smart contract or backend
      await new Promise((r) => setTimeout(r, 1500));
      toast.success("¡Campaña creada exitosamente! Será revisada por nuestro equipo.");
      navigate("/");
    } catch {
      toast.error("Error al crear la campaña");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="bg-brand-amarillo-relleno text-brand-verde-titulo border border-brand-amarillo-trazo/30 rounded-full px-4 py-2 mb-4">
            <Heart className="w-3 h-3 mr-1" /> Nueva Campaña
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Crear tu Campaña
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Crea una campaña verificada para recibir donaciones transparentes en la red Stellar.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Paso {step} de {totalSteps}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-foreground font-medium" : ""}>Información</span>
            <span className={step >= 2 ? "text-foreground font-medium" : ""}>Médico</span>
            <span className={step >= 3 ? "text-foreground font-medium" : ""}>Revisión</span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-card-foreground">
                <FileText className="w-5 h-5 mr-2" />
                Información de la Campaña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Título de la Campaña *</Label>
                <Input
                  placeholder="Ej: Tratamiento de cáncer para María"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">{form.title.length}/100 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Descripción *</Label>
                <Textarea
                  placeholder="Describe la situación del paciente, el tratamiento necesario y cómo se usarán los fondos..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">{form.description.length}/1000 caracteres</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Nombre del Beneficiario *</Label>
                  <Input
                    placeholder="Nombre completo"
                    value={form.beneficiaryName}
                    onChange={(e) => updateField("beneficiaryName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Ubicación *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Ciudad, Estado"
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Categoría Médica *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={form.category === cat ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => updateField("category", cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Medical & Financial */}
        {step === 2 && (
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-card-foreground">
                <Stethoscope className="w-5 h-5 mr-2" />
                Información Médica y Financiera
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Meta de Recaudación (MXN) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    className="pl-9"
                    placeholder="250000"
                    value={form.goalAmount}
                    onChange={(e) => updateField("goalAmount", e.target.value)}
                  />
                </div>
                {form.goalAmount && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {(parseFloat(form.goalAmount) / 18).toFixed(0)} XLM (tasa estimada)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Condición Médica *</Label>
                <Input
                  placeholder="Ej: Leucemia linfoblástica aguda"
                  value={form.medicalCondition}
                  onChange={(e) => updateField("medicalCondition", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Hospital / Institución *</Label>
                <Input
                  placeholder="Ej: Hospital General de México"
                  value={form.hospitalName}
                  onChange={(e) => updateField("hospitalName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Documentación Médica</Label>
                <Textarea
                  placeholder="Describe los documentos médicos que respaldas (diagnóstico, presupuesto, etc.)"
                  value={form.medicalDocDescription}
                  onChange={(e) => updateField("medicalDocDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <Alert className="border-primary/20 bg-primary/5">
                <Shield className="h-4 w-4 text-primary" />
                <AlertDescription className="text-muted-foreground">
                  La documentación será revisada por nuestro equipo médico antes de publicar la campaña.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-card-foreground">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Revisión Final
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Título</p>
                    <p className="text-sm font-medium text-card-foreground">{form.title || "—"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Beneficiario</p>
                    <p className="text-sm font-medium text-card-foreground">{form.beneficiaryName || "—"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                    <p className="text-sm font-medium text-card-foreground">{form.location || "—"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                    <p className="text-sm font-medium text-card-foreground">{form.category || "—"}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Meta</p>
                    <p className="text-sm font-medium text-card-foreground">
                      {form.goalAmount ? `$${parseInt(form.goalAmount).toLocaleString()} MXN` : "—"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Condición</p>
                    <p className="text-sm font-medium text-card-foreground">{form.medicalCondition || "—"}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                  <p className="text-sm text-card-foreground">{form.description || "—"}</p>
                </div>

                {/* Wallet Connection */}
                <div className="p-4 border border-border rounded-lg">
                  <p className="text-sm font-medium text-card-foreground mb-2">Wallet para recibir donaciones</p>
                  {wallet ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {wallet.address.slice(0, 12)}...{wallet.address.slice(-6)}
                      </span>
                      <Badge variant="outline" className="text-xs">Conectada</Badge>
                    </div>
                  ) : (
                    <Button
                      variant="donate"
                      className="rounded-full"
                      onClick={connect}
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Conectando..." : "Conectar Wallet Stellar"}
                    </Button>
                  )}
                </div>

                <Alert className="border-primary/20 bg-primary/5">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-muted-foreground">
                    Tu campaña será revisada por nuestro equipo antes de ser publicada. Este proceso toma 24-48 horas.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step > 1 ? "Anterior" : "Cancelar"}
          </Button>

          {step < totalSteps ? (
            <Button
              variant="hero"
              className="rounded-full"
              onClick={() => setStep(step + 1)}
              disabled={!canAdvance()}
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="donate"
              className="rounded-full px-8"
              onClick={handleSubmit}
              disabled={isSubmitting || !wallet}
            >
              {isSubmitting ? "Creando..." : "Crear Campaña"}
              <Heart className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

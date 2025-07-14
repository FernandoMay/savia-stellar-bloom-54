import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Zap, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-mint py-20 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-savia-teal/5 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Trust badge */}
          <Badge variant="secondary" className="bg-savia-accent text-savia-teal border-0 rounded-full px-4 py-2 text-sm font-medium">
            <Shield className="w-4 h-4 mr-2" />
            Plataforma 100% Verificada y Transparente
          </Badge>

          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-savia-teal leading-tight">
              Donar con{" "}
              <span className="text-transparent bg-gradient-hero bg-clip-text">
                confianza
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-savia-teal/80">
              Recibir con dignidad
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plataforma de recaudación de fondos para causas de salud, con{" "}
            <strong className="text-savia-teal">verificación KYC mexicana</strong>,{" "}
            documentación médica certificada y{" "}
            <strong className="text-savia-teal">pagos directos en pesos o cripto</strong>.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-6">
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
              <Coins className="w-5 h-5 text-savia-teal" />
              <span className="text-sm font-medium">Pagos en Pesos y Crypto</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
              <Shield className="w-5 h-5 text-savia-teal" />
              <span className="text-sm font-medium">KYC Seguro Personalizado</span>
            </div>
            <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
              <Zap className="w-5 h-5 text-savia-teal" />
              <span className="text-sm font-medium">Prueba de Uso de Donaciones</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <a href="/#campaigns">
            
            <Button variant="hero" size="xl" className="w-full sm:w-auto min-w-48">
              <Heart className="w-5 h-5" />
              Explorar Campañas
            </Button>
            </a>
            <Button variant="mint" size="xl" className="w-full sm:w-auto min-w-48" onClick={() => navigate("/create-campaign")}>
              Crear mi Campaña
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-savia-teal">95%</div>
              <div className="text-sm text-muted-foreground">Confianza de Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-savia-teal">$2.5M</div>
              <div className="text-sm text-muted-foreground">Recaudado Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-savia-teal">15,000+</div>
              <div className="text-sm text-muted-foreground">Vidas Impactadas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
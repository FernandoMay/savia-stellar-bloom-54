import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield, FileCheck, Heart, Zap, Users, Award } from "lucide-react";

const steps = [
  {
    icon: Shield,
    title: "Verificación KYC",
    description: "Proceso riguroso de verificación de identidad y documentación médica mexicana.",
    color: "text-savia-teal",
  },
  {
    icon: FileCheck,
    title: "Validación Médica",
    description: "Nuestro equipo médico revisa y certifica toda la documentación clínica.",
    color: "text-savia-coral",
  },
  {
    icon: Heart,
    title: "Donación Segura",
    description: "Dona en pesos mexicanos o crypto con total transparencia y trazabilidad.",
    color: "text-savia-teal",
  },
  {
    icon: Zap,
    title: "Transferencia Directa",
    description: "Los fondos llegan directamente al beneficiario sin intermediarios.",
    color: "text-savia-coral",
  },
  {
    icon: Users,
    title: "Seguimiento Transparente",
    description: "Monitoreo en tiempo real del uso de fondos con pruebas documentadas.",
    color: "text-savia-teal",
  },
  {
    icon: Award,
    title: "NFT de Impacto",
    description: "Recibe un NFT evolutivo que crece con cada donación y representa tu impacto.",
    color: "text-savia-coral",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-mint">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="bg-savia-accent text-savia-teal border-0 rounded-full px-4 py-2 mb-4">
            Proceso Transparente
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-savia-teal mb-4">
            ¿Cómo funciona Savia?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un proceso diseñado para garantizar la máxima transparencia, 
            seguridad y dignidad en cada donación.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-0 shadow-card hover:shadow-elegant transition-all duration-300 p-6 text-center group hover:-translate-y-2">
              <div className="relative mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-card rounded-full flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-savia-teal text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-savia-teal mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-savia-teal mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Campañas Verificadas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-savia-teal mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoreo Continuo</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-savia-teal mb-2">0%</div>
            <div className="text-sm text-muted-foreground">Tolerancia al Fraude</div>
          </div>
        </div>
      </div>
    </section>
  );
}
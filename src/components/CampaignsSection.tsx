import { CampaignCard } from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";

const sampleCampaigns = [
  {
    id: "1",
    title: "Transparent Crowdfunding On Stellar",
    description: "Providing Clean Water Access To Remote Villages Through Sustainable Well Construction And Water Purification Systems.",
    location: "México",
    category: "Environment",
    trustScore: 85,
    beneficiary: "GBXR...MPLE",
    raisedAmount: 32500,
    goalAmount: 50000,
    progressPercentage: 65,
    daysLeft: 22,
    verified: true,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "2",
    title: "Tratamiento de Cáncer Infantil",
    description: "Ayuda urgente para el tratamiento de leucemia en niños de bajos recursos. Incluye quimioterapias, medicamentos y cuidados especializados.",
    location: "Ciudad de México",
    category: "Oncología",
    trustScore: 92,
    beneficiary: "GCDR...HOPE",
    raisedAmount: 18750,
    goalAmount: 25000,
    progressPercentage: 75,
    daysLeft: 15,
    verified: true,
    image: "public/cancer.jpeg",
  },
  {
    id: "3",
    title: "Cirugía Cardiovascular Urgente",
    description: "Fondos necesarios para una operación de corazón abierto que salvará la vida de un padre de familia trabajador.",
    location: "Guadalajara",
    category: "Cardiología",
    trustScore: 88,
    beneficiary: "GHRT...LIFE",
    raisedAmount: 45000,
    goalAmount: 80000,
    progressPercentage: 56,
    daysLeft: 30,
    verified: true,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "4",
    title: "Rehabilitación Post-Accidente",
    description: "Terapia física especializada y equipo médico para la recuperación completa de un joven deportista.",
    location: "Monterrey",
    category: "Rehabilitación",
    trustScore: 90,
    beneficiary: "GFYS...HEAL",
    raisedAmount: 12300,
    goalAmount: 35000,
    progressPercentage: 35,
    daysLeft: 45,
    verified: true,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center",
  },
  {
    id: "5",
    title: "Tratamiento de Diabetes Tipo 1",
    description: "Insulina, monitores y cuidados médicos continuos para una niña de 8 años diagnosticada recientemente.",
    location: "Puebla",
    category: "Endocrinología",
    trustScore: 94,
    beneficiary: "GSWT...CARE",
    raisedAmount: 8500,
    goalAmount: 15000,
    progressPercentage: 57,
    daysLeft: 20,
    verified: true,
    image: "public/diabetes.jpeg",
  },
  {
    id: "6",
    title: "Cirugía Reconstructiva",
    description: "Operación para corregir malformación facial congénita y devolver la sonrisa a una adolescente.",
    location: "Tijuana",
    category: "Cirugía Plástica",
    trustScore: 86,
    beneficiary: "GPLR...SMIL",
    raisedAmount: 28000,
    goalAmount: 60000,
    progressPercentage: 47,
    daysLeft: 35,
    verified: true,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=faces",
  },
];

export function CampaignsSection() {
  return (
    <section id="campaigns" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="bg-brand-amarillo-relleno text-brand-verde-titulo border border-brand-amarillo-trazo/30 rounded-full px-4 py-2 mb-4">
            Campañas Verificadas
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-verde-titulo mb-4">
            Causas que necesitan tu ayuda
          </h2>
          <p className="text-lg text-brand-gris-savia max-w-2xl mx-auto">
            Cada campaña ha sido verificada por nuestro equipo médico y cumple con 
            los estándares más altos de transparencia y autenticidad.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Button variant="mint" className="rounded-full bg-gradient-savia border-brand-amarillo-trazo/30">
            <Filter className="w-4 h-4" />
            Todas las Categorías
          </Button>
          <Button variant="ghost" className="rounded-full hover:bg-brand-amarillo-relleno hover:text-brand-verde-titulo">
            Oncología
          </Button>
          <Button variant="ghost" className="rounded-full hover:bg-brand-amarillo-relleno hover:text-brand-verde-titulo">
            Cardiología
          </Button>
          <Button variant="ghost" className="rounded-full hover:bg-brand-amarillo-relleno hover:text-brand-verde-titulo">
            Emergencias
          </Button>
          <Button variant="ghost" className="rounded-full hover:bg-brand-amarillo-relleno hover:text-brand-verde-titulo">
            Cirugías
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por ubicación o condición médica..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-brand-amarillo-trazo/30 bg-card focus:outline-none focus:ring-2 focus:ring-brand-verde-titulo/20 focus:border-brand-verde-titulo"
            />
          </div>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {sampleCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full">
            Ver Más Campañas
          </Button>
        </div>
      </div>
    </section>
  );
}
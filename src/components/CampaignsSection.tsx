import { CampaignCard } from "./CampaignCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search } from "lucide-react";
import { useCampaigns } from "@/context/CampaignContext";
import { useState } from "react";

export function CampaignsSection() {
  const { campaigns } = useCampaigns();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const categories = ["all", "Oncología", "Cardiología", "Rehabilitación", "Cirugía", "Endocrinología"];

  const filtered = campaigns.filter(c => {
    const matchesCategory = filter === "all" || c.category === filter;
    const matchesSearch = !search || 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.medicalCondition.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="campaigns" className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
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

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={filter === cat ? "hero" : "ghost"}
              className="rounded-full"
              size="sm"
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? (
                <><Filter className="w-4 h-4" /> Todas</>
              ) : cat}
            </Button>
          ))}
        </div>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por ubicación o condición médica..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-brand-amarillo-trazo/30 bg-card focus:outline-none focus:ring-2 focus:ring-brand-verde-titulo/20 focus:border-brand-verde-titulo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
          {filtered.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              title={campaign.title}
              description={campaign.description}
              location={campaign.location}
              category={campaign.category}
              trustScore={campaign.trustScore}
              beneficiary={campaign.beneficiaryName}
              raisedAmount={campaign.raisedAmount}
              goalAmount={campaign.goalAmount}
              progressPercentage={Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}
              daysLeft={campaign.daysLeft}
              verified={campaign.verified}
              image={campaign.image}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron campañas con esos filtros.
          </div>
        )}
      </div>
    </section>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MapPin, Shield, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CampaignCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  trustScore: number;
  beneficiary: string;
  raisedAmount: number;
  goalAmount: number;
  progressPercentage: number;
  daysLeft: number;
  verified: boolean;
  image?: string;
}

export function CampaignCard({
  title,
  description,
  location,
  category,
  trustScore,
  beneficiary,
  raisedAmount,
  goalAmount,
  progressPercentage,
  daysLeft,
  verified,
  image,
}: CampaignCardProps) {
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-lg bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 border-0 rounded-3xl overflow-hidden group hover:scale-[1.02]">
      {/* Campaign Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-brand-amarillo-relleno text-brand-verde-titulo border border-brand-amarillo-trazo/30 rounded-full px-3 py-1"
          >
            {category}
          </Badge>
        </div>
      )}
      
      {/* Header with category badge */}
      <div className={`${image ? 'bg-brand-amarillo-relleno' : 'bg-savia-mint'} p-4 relative`}>
        {!image && (
          <Badge 
            variant="secondary" 
            className="absolute top-4 right-4 bg-brand-amarillo-relleno text-brand-verde-titulo border border-brand-amarillo-trazo/30 rounded-full px-3 py-1"
          >
            {category}
          </Badge>
        )}
        
        <div className={image ? 'mt-4' : 'mt-8'}>
          <h3 className="text-xl font-bold text-brand-verde-titulo mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-brand-gris-savia text-sm line-clamp-3 mb-4">
            {description}
          </p>
        </div>
      </div>

      {/* Campaign details */}
      <div className="p-6 space-y-4">
        {/* Location and Trust Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-brand-verde-titulo font-medium">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-verde-titulo font-medium">
            <Shield className="w-4 h-4" />
            <span>Trust: {trustScore}%</span>
          </div>
        </div>

        {/* Beneficiary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-brand-gris-savia">Beneficiary:</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-verde-titulo font-medium">{beneficiary}</span>
            {verified && (
              <Badge variant="secondary" className="bg-gradient-savia text-brand-verde-titulo text-xs px-2 py-0.5 border border-brand-amarillo-trazo/30">
                Trust: {trustScore}%
              </Badge>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-gris-savia">
              {raisedAmount.toLocaleString()} XLM Raised
            </span>
            <span className="text-brand-verde-titulo font-bold">{progressPercentage}%</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-2 bg-brand-amarillo-relleno"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-verde-titulo font-bold">
              Goal: {goalAmount.toLocaleString()} XLM
            </span>
            <div className="flex items-center gap-1 text-brand-gris-savia">
              <Clock className="w-4 h-4" />
              <span>{daysLeft} Days Left</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="donate" className="flex-1 rounded-full" onClick={() => navigate("/donation-flow")}>
            <Heart className="w-4 h-4" />
            Donar
          </Button>
          <Button variant="mint" className="flex-1 rounded-full">
            Ver Detalles
          </Button>
        </div>
      </div>
    </Card>
  );
}
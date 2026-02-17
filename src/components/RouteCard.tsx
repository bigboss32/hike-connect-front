import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp, Star, DollarSign, Users } from "lucide-react";

interface RouteCardProps {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  image: string;
  type: "pública" | "privada" | "agroturismo";
  company?: string;
  category: "senderismo" | "agroturismo";
  rating_avg?: number | null;
  rating_count?: number;
  base_price?: string | null;
  requires_payment?: boolean;
  max_capacity?: number | null;
}

const RouteCard = ({
  id,
  title,
  location,
  distance,
  duration,
  difficulty,
  image,
  type,
  company,
  category,
  rating_avg,
  rating_count,
  base_price,
  requires_payment,
  max_capacity,
}: RouteCardProps) => {
  const navigate = useNavigate();

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
  };
  const difficultyColor = {
    Fácil: "bg-primary text-primary-foreground",
    Medio: "bg-secondary text-secondary-foreground",
    Difícil: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card 
      className="overflow-hidden shadow-soft hover:shadow-elevated transition-all cursor-pointer"
      onClick={() => navigate(`/routes/${id}`)}
    >
      <div className="relative h-40">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${difficultyColor[difficulty]}`}>
          {difficulty}
        </Badge>
        {/* Rating badge */}
        {rating_avg !== undefined && rating_avg !== null && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-semibold">
              {rating_avg.toFixed(1)}
            </span>
            {rating_count !== undefined && rating_count > 0 && (
              <span className="text-white/70 text-xs">
                ({rating_count})
              </span>
            )}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
          <div className="flex gap-1">
            {category === "agroturismo" && (
              <Badge variant="outline" className="text-xs border-accent text-accent">Finca</Badge>
            )}
            {type === "privada" && (
              <Badge variant="secondary" className="text-xs">Premium</Badge>
            )}
          </div>
        </div>
        {(type === "privada" || type === "agroturismo") && company && (
          <p className="text-xs text-muted-foreground mb-2">Por {company}</p>
        )}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            {max_capacity && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{max_capacity}</span>
              </div>
            )}
          </div>
        </div>
        {/* Price row */}
        {base_price && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-lg font-bold text-primary">{formatPrice(base_price)}</span>
            {requires_payment && (
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="w-3 h-3 mr-0.5" />
                Pago requerido
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteCard;

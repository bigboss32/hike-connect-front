import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp, Star } from "lucide-react";

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
}: RouteCardProps) => {
  const navigate = useNavigate();
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
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>{distance}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteCard;

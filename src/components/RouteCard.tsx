import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, TrendingUp } from "lucide-react";

interface RouteCardProps {
  title: string;
  location: string;
  distance: string;
  duration: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  image: string;
}

const RouteCard = ({
  title,
  location,
  distance,
  duration,
  difficulty,
  image,
}: RouteCardProps) => {
  const difficultyColor = {
    Fácil: "bg-primary text-primary-foreground",
    Medio: "bg-secondary text-secondary-foreground",
    Difícil: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="overflow-hidden shadow-soft hover:shadow-elevated transition-all cursor-pointer">
      <div className="relative h-40">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-2 right-2 ${difficultyColor[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1">{title}</h3>
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

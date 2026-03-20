import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Coffee, UtensilsCrossed, Tent, Package } from "lucide-react";
import type { AdventurePackage } from "@/hooks/useAdventurePackages";

const packageTypeLabels: Record<string, string> = {
  mixed_package: "Mixto",
  stay_package: "Estadía",
  activity_package: "Actividad",
};

const AdventurePackageCard = ({ pkg }: { pkg: AdventurePackage }) => {
  const navigate = useNavigate();

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
  };

  const includes = [
    pkg.includes_stay && "Hospedaje",
    pkg.includes_breakfast && "Desayuno",
    pkg.includes_lunch && "Almuerzo",
    pkg.includes_dinner && "Cena",
  ].filter(Boolean);

  return (
    <Card
      className="overflow-hidden shadow-soft hover:shadow-elevated transition-all cursor-pointer"
      onClick={() => navigate(`/paquetes/${pkg.id}`)}
    >
      {/* Header with gradient instead of image */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 flex items-center justify-center">
        <Package className="w-12 h-12 text-primary/40" />
        <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
          {packageTypeLabels[pkg.package_type] || pkg.package_type}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">{pkg.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{pkg.description}</p>

        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{pkg.location}</span>
        </div>

        {/* Includes badges */}
        {includes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {includes.map((item) => (
              <Badge key={item} variant="secondary" className="text-xs gap-1">
                {item === "Hospedaje" && <Tent className="w-3 h-3" />}
                {item === "Desayuno" && <Coffee className="w-3 h-3" />}
                {(item === "Almuerzo" || item === "Cena") && <UtensilsCrossed className="w-3 h-3" />}
                {item}
              </Badge>
            ))}
          </div>
        )}

        {/* Activities */}
        {pkg.activities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pkg.activities.map((act) => (
              <Badge key={act.code} variant="outline" className="text-xs">
                {act.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-lg font-bold text-primary">{formatPrice(pkg.base_price)}</span>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users className="w-4 h-4" />
            <span>{pkg.min_people}-{pkg.max_people} personas</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdventurePackageCard;

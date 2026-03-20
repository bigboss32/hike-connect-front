import { useParams, useNavigate } from "react-router-dom";
import { useAdventurePackageById } from "@/hooks/useAdventurePackages";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, MapPin, Users, Coffee, UtensilsCrossed, Tent,
  Package, Calendar, Clock, DollarSign,
} from "lucide-react";

const packageTypeLabels: Record<string, string> = {
  mixed_package: "Paquete Mixto",
  stay_package: "Paquete de Estadía",
  activity_package: "Paquete de Actividad",
};

const AdventurePackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: pkg, isLoading, isError } = useAdventurePackageById(id);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="p-4 space-y-4 max-w-lg mx-auto">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Navigation />
      </div>
    );
  }

  if (isError || !pkg) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">No se pudo cargar el paquete</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
        </div>
        <Navigation />
      </div>
    );
  }

  const includes = [
    pkg.includes_stay && { label: "Hospedaje", icon: Tent },
    pkg.includes_breakfast && { label: "Desayuno", icon: Coffee },
    pkg.includes_lunch && { label: "Almuerzo", icon: UtensilsCrossed },
    pkg.includes_dinner && { label: "Cena", icon: UtensilsCrossed },
  ].filter(Boolean) as { label: string; icon: typeof Tent }[];

  const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const availableDaysList = pkg.available_days
    ? pkg.available_days.split(",").map((d) => weekdays[parseInt(d.trim())] || d)
    : [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative h-52 bg-gradient-to-br from-primary/25 via-accent/15 to-primary/10 flex items-center justify-center">
        <Package className="w-20 h-20 text-primary/30" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {packageTypeLabels[pkg.package_type] || pkg.package_type}
        </Badge>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 relative z-10 space-y-4">
        {/* Title card */}
        <Card>
          <CardContent className="p-5">
            <h1 className="text-xl font-bold text-foreground mb-1">{pkg.title}</h1>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>{pkg.location}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Desde</p>
                <span className="text-2xl font-bold text-primary">{formatPrice(pkg.base_price)}</span>
                <span className="text-xs text-muted-foreground ml-1">/ {pkg.currency}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Users className="w-4 h-4" />
                <span>{pkg.min_people}-{pkg.max_people} personas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Includes */}
        {includes.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-foreground mb-3">Incluye</h2>
              <div className="grid grid-cols-2 gap-2">
                {includes.map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activities */}
        {pkg.activities.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-foreground mb-3">Actividades</h2>
              <div className="flex flex-wrap gap-2">
                {pkg.activities.map((act) => (
                  <Badge key={act.code} variant="secondary" className="text-sm py-1.5 px-3">
                    {act.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Components */}
        {pkg.components.length > 0 && (
          <Card>
            <CardContent className="p-5">
              <h2 className="font-semibold text-foreground mb-3">Componentes</h2>
              <div className="space-y-2">
                {pkg.components.map((comp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{comp.nombre}</p>
                      <p className="text-xs text-muted-foreground capitalize">{comp.tipo}</p>
                    </div>
                    <Badge variant="outline">×{comp.cantidad}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Availability */}
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Disponibilidad
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {availableDaysList.map((day) => (
                <Badge key={day} variant="secondary">{day}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              Frecuencia: {pkg.frequency}
            </p>
            {pkg.booking_rules?.min_nights && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="w-3 h-3" />
                Mínimo {pkg.booking_rules.min_nights} noche(s)
              </div>
            )}
            {pkg.pricing_rules?.weekend_multiplier && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <DollarSign className="w-3 h-3" />
                Fin de semana: ×{pkg.pricing_rules.weekend_multiplier}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default AdventurePackageDetail;

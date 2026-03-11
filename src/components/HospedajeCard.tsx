import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, Clock } from "lucide-react";
import type { Hospedaje } from "@/hooks/useHospedajes";

const tipoLabels: Record<string, string> = {
  hotel: "Hotel",
  cabaña: "Cabaña",
  finca: "Finca",
  ecolodge: "Ecolodge",
  camping: "Camping",
  otro: "Otro",
};

const HospedajeCard = ({ hospedaje }: { hospedaje: Hospedaje }) => {
  const navigate = useNavigate();

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
  };

  return (
    <Card
      className="overflow-hidden shadow-soft hover:shadow-elevated transition-all cursor-pointer"
      onClick={() => navigate(`/hospedajes/${hospedaje.id}`)}
    >
      <div className="relative h-40">
        <img
          src={hospedaje.image}
          alt={hospedaje.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
          {tipoLabels[hospedaje.tipo] || hospedaje.tipo}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg text-foreground line-clamp-1">{hospedaje.title}</h3>
        </div>
        {hospedaje.company && (
          <p className="text-xs text-muted-foreground mb-2">Por {hospedaje.company}</p>
        )}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{hospedaje.location}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Máx {hospedaje.max_guests}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{hospedaje.check_in_time} - {hospedaje.check_out_time}</span>
          </div>
        </div>
        {hospedaje.base_price && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-lg font-bold text-primary">{formatPrice(hospedaje.base_price)}</span>
            {hospedaje.requires_payment && (
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

export default HospedajeCard;

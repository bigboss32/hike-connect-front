import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ApiEvent } from "@/hooks/useEvents";

interface EventCardProps {
  event: ApiEvent;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "d MMM yyyy, h:mm a", { locale: es });
  const spotsLeft = event.max_participants - event.participants_count;
  const isFull = spotsLeft <= 0;

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-3">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {event.participants_count}/{event.max_participants} participantes
              {isFull && <span className="text-destructive ml-2">(Lleno)</span>}
            </span>
          </div>
        </div>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(`/events/${event.id}`)}
        >
          Ver detalles
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;

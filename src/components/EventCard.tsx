import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
}

const EventCard = ({
  title,
  date,
  location,
  participants,
  maxParticipants,
}: EventCardProps) => {
  const [joined, setJoined] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  const handleJoin = () => {
    if (joined) {
      setJoined(false);
      setCurrentParticipants(prev => prev - 1);
      toast({
        title: "Has salido del evento",
        description: `Ya no estás inscrito en "${title}"`,
      });
    } else {
      if (currentParticipants >= maxParticipants) {
        toast({
          title: "Evento lleno",
          description: "Este evento ha alcanzado el máximo de participantes",
          variant: "destructive",
        });
        return;
      }
      setJoined(true);
      setCurrentParticipants(prev => prev + 1);
      toast({
        title: "¡Te has unido!",
        description: `Estás inscrito en "${title}"`,
      });
    }
  };

  return (
    <Card className="shadow-soft">
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-3">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {currentParticipants}/{maxParticipants} participantes
            </span>
          </div>
        </div>
        <Button 
          className="w-full" 
          variant={joined ? "secondary" : "default"}
          onClick={handleJoin}
        >
          {joined ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Inscrito
            </>
          ) : (
            "Unirse al evento"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;

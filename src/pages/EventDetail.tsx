import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, User } from "lucide-react";
import WalkingLoader from "@/components/WalkingLoader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEventById, useJoinEvent } from "@/hooks/useEvents";
import RouteMap from "@/components/RouteMap";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: event, isLoading, error } = useEventById(id);
  const { mutate: joinEvent, isPending: isJoining } = useJoinEvent();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <div className="bg-card border-b border-border">
          <div className="max-w-lg mx-auto px-4 py-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-40" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Evento no encontrado</h1>
          <Button onClick={() => navigate('/events')}>Volver a eventos</Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  const formattedTime = format(eventDate, "h:mm a", { locale: es });
  const spotsLeft = event.max_participants - event.participants_count;
  const isFull = spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Title and status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isFull ? (
              <Badge variant="destructive">Evento lleno</Badge>
            ) : (
              <Badge variant="secondary">{spotsLeft} lugares disponibles</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
        </div>

        {/* Event info */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium capitalize">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center gap-3 text-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span>{event.participants_count}/{event.max_participants} participantes</span>
            </div>
            
            <div className="flex items-center gap-3 text-foreground">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Organizado por</p>
                <p className="font-medium">{event.organized_by}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {event.description && (
          <section>
            <h2 className="text-lg font-bold mb-3">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </section>
        )}

        {/* Meeting point map */}
        <section>
          <h2 className="text-lg font-bold mb-3">Punto de encuentro</h2>
          <RouteMap 
            coordinates={event.meeting_point} 
            title={event.title} 
          />
        </section>

        {/* Join button */}
        <Button 
          className="w-full" 
          size="lg"
          disabled={isFull || isJoining}
          onClick={() => id && joinEvent(id)}
        >
          {isJoining ? (
            <>
              <WalkingLoader />
              <span>Inscribiendo...</span>
            </>
          ) : isFull ? "Evento lleno" : "Unirse al evento"}
        </Button>
      </main>
    </div>
  );
};

export default EventDetail;

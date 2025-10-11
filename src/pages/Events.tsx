import Navigation from "@/components/Navigation";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Events = () => {
  const events = [
    {
      title: "Senderismo al Nevado",
      date: "15 Oct 2025, 8:00 AM",
      location: "Sierra Nevada",
      participants: 8,
      maxParticipants: 15,
    },
    {
      title: "Ruta de los Miradores",
      date: "18 Oct 2025, 9:00 AM",
      location: "Picos de Europa",
      participants: 12,
      maxParticipants: 20,
    },
    {
      title: "Amanecer en la Montaña",
      date: "20 Oct 2025, 6:00 AM",
      location: "Guadarrama",
      participants: 5,
      maxParticipants: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Eventos</h1>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Crear
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Próximas salidas de senderismo
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid gap-4">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Events;

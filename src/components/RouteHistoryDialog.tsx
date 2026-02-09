import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Clock, Mountain, Star, CalendarDays, ChevronRight } from "lucide-react";

interface CompletedRoute {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  image: string;
  completedAt: string;
  rating: number | null;
}

const mockCompletedRoutes: CompletedRoute[] = [
  {
    id: "1",
    title: "Sendero del Bosque Nublado",
    location: "Reserva Biológica Bosque Nublado",
    distance: "5.2 km",
    duration: "2h 30min",
    difficulty: "Medio",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    completedAt: "2025-01-15",
    rating: 5,
  },
  {
    id: "2",
    title: "Ruta Cascada Escondida",
    location: "Parque Nacional Volcán",
    distance: "3.8 km",
    duration: "1h 45min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400",
    completedAt: "2025-01-02",
    rating: 4,
  },
  {
    id: "3",
    title: "Cumbre del Cerro Alto",
    location: "Cordillera Central",
    distance: "8.7 km",
    duration: "5h 00min",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
    completedAt: "2024-12-20",
    rating: 5,
  },
  {
    id: "4",
    title: "Sendero Río Cristalino",
    location: "Valle del Río",
    distance: "4.1 km",
    duration: "2h 00min",
    difficulty: "Fácil",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
    completedAt: "2024-12-10",
    rating: null,
  },
  {
    id: "5",
    title: "Travesía del Páramo",
    location: "Páramo de las Flores",
    distance: "12.3 km",
    duration: "6h 30min",
    difficulty: "Difícil",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    completedAt: "2024-11-28",
    rating: 4,
  },
  {
    id: "6",
    title: "Circuito Laguna Azul",
    location: "Reserva Natural",
    distance: "6.5 km",
    duration: "3h 15min",
    difficulty: "Medio",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    completedAt: "2024-11-15",
    rating: 3,
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Fácil":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "Medio":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "Difícil":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "";
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

interface RouteHistoryDialogProps {
  children: React.ReactNode;
}

const RouteHistoryDialog = ({ children }: RouteHistoryDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Mountain className="w-5 h-5 text-primary" />
            Historial de Rutas
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {mockCompletedRoutes.length} rutas completadas
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] px-5 pb-5">
          <div className="space-y-3">
            {mockCompletedRoutes.map((route) => (
              <Link
                key={route.id}
                to={`/routes/${route.id}`}
                onClick={() => setOpen(false)}
                className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
              >
                <img
                  src={route.image}
                  alt={route.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {route.title}
                    </h4>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {route.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-5 ${getDifficultyColor(route.difficulty)}`}
                    >
                      {route.difficulty}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Mountain className="w-3 h-3" />
                      {route.distance}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {route.duration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(route.completedAt)}
                    </span>
                    {route.rating && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: route.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RouteHistoryDialog;

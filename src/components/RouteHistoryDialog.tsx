import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Clock,
  Mountain,
  Star,
  CalendarDays,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  RotateCcw,
  Globe,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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

type SortBy = "date-desc" | "date-asc" | "rating-desc" | "rating-asc";

interface HistoryFilters {
  difficulty: string;
  rating: string;
  sortBy: SortBy;
}

const defaultFilters: HistoryFilters = {
  difficulty: "todas",
  rating: "todas",
  sortBy: "date-desc",
};

interface RouteHistoryDialogProps {
  children: React.ReactNode;
}

const RouteHistoryDialog = ({ children }: RouteHistoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>(defaultFilters);

  const difficulties = [
    { value: "todas", label: "Todas" },
    { value: "Fácil", label: "Fácil" },
    { value: "Medio", label: "Medio" },
    { value: "Difícil", label: "Difícil" },
  ];

  const ratings = [
    { value: "todas", label: "Todas", icon: Globe },
    { value: "5", label: "5 ★" },
    { value: "4", label: "4+ ★" },
    { value: "3", label: "3+ ★" },
  ];

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: "date-desc", label: "Más recientes" },
    { value: "date-asc", label: "Más antiguas" },
    { value: "rating-desc", label: "Mejor calificación" },
    { value: "rating-asc", label: "Menor calificación" },
  ];

  const hasActiveFilters =
    filters.difficulty !== "todas" ||
    filters.rating !== "todas" ||
    filters.sortBy !== "date-desc";

  const activeFilterCount = [
    filters.difficulty !== "todas",
    filters.rating !== "todas",
    filters.sortBy !== "date-desc",
  ].filter(Boolean).length;

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const filteredRoutes = useMemo(() => {
    let result = [...mockCompletedRoutes];

    // Filter by difficulty
    if (filters.difficulty !== "todas") {
      result = result.filter((r) => r.difficulty === filters.difficulty);
    }

    // Filter by rating
    if (filters.rating !== "todas") {
      const minRating = parseInt(filters.rating);
      if (filters.rating === "5") {
        result = result.filter((r) => r.rating === 5);
      } else {
        result = result.filter((r) => r.rating !== null && r.rating >= minRating);
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "date-desc":
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        case "date-asc":
          return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
        case "rating-desc":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "rating-asc":
          return (a.rating ?? 0) - (b.rating ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [filters]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0">
        <DialogHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Historial de Rutas
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${hasActiveFilters ? "border-primary text-primary" : ""}`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1.5" />
              Filtros
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              {showFilters ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredRoutes.length} de {mockCompletedRoutes.length} rutas completadas
          </p>
        </DialogHeader>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-5 pb-3 space-y-4 animate-fade-in">
            {/* Difficulty */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Dificultad
              </Label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((d) => {
                  const isActive = filters.difficulty === d.value;
                  const difficultyColor =
                    d.value === "Fácil"
                      ? "bg-green-500/10 text-green-600 border-green-500/30"
                      : d.value === "Medio"
                        ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
                        : d.value === "Difícil"
                          ? "bg-red-500/10 text-red-600 border-red-500/30"
                          : "";
                  return (
                    <Badge
                      key={d.value}
                      variant={isActive ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : d.value !== "todas"
                            ? difficultyColor
                            : "hover:bg-accent"
                      }`}
                      onClick={() => setFilters({ ...filters, difficulty: d.value })}
                    >
                      {d.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Calificación
              </Label>
              <div className="flex flex-wrap gap-2">
                {ratings.map((r) => {
                  const isActive = filters.rating === r.value;
                  return (
                    <Badge
                      key={r.value}
                      variant={isActive ? "default" : "outline"}
                      className={`cursor-pointer px-4 py-2 transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setFilters({ ...filters, rating: r.value })}
                    >
                      {r.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Sort */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-primary" />
                Ordenar por
              </Label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((s) => {
                  const isActive = filters.sortBy === s.value;
                  return (
                    <Badge
                      key={s.value}
                      variant={isActive ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-2 text-xs transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setFilters({ ...filters, sortBy: s.value })}
                    >
                      {s.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Reset */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Limpiar filtros
              </Button>
            )}

            <Separator />
          </div>
        )}

        {/* Route List */}
        <ScrollArea className="max-h-[55vh] px-5 pb-5">
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-10">
              <Mountain className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                No hay rutas con estos filtros
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={handleReset}
                className="text-primary mt-1"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRoutes.map((route) => (
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
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RouteHistoryDialog;

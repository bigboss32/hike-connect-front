import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mountain, Trees, Globe, Crown, MapPin, Clock, TrendingUp, RotateCcw } from "lucide-react";

interface RouteFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    category: string;
    type: string;
    maxDistance: number;
    difficulty: string;
    maxDuration: number;
  };
  onFiltersChange: (filters: RouteFiltersDialogProps["filters"]) => void;
}

const RouteFiltersDialog = ({ open, onOpenChange, filters, onFiltersChange }: RouteFiltersDialogProps) => {
  const categories = [
    { value: "todas", label: "Todas", icon: Globe },
    { value: "senderismo", label: "Senderismo", icon: Mountain },
    { value: "agroturismo", label: "Agroturismo", icon: Trees },
  ];

  const types = [
    { value: "todas", label: "Todas", icon: Globe },
    { value: "públicas", label: "Públicas", icon: Globe },
    { value: "premium", label: "Premium/Fincas", icon: Crown },
  ];

  const difficulties = [
    { value: "todas", label: "Todas" },
    { value: "Fácil", label: "Fácil" },
    { value: "Moderado", label: "Moderado" },
    { value: "Difícil", label: "Difícil" },
  ];

  const handleReset = () => {
    onFiltersChange({
      category: "todas",
      type: "todas",
      maxDistance: 50,
      difficulty: "todas",
      maxDuration: 12,
    });
  };

  const hasActiveFilters = 
    filters.category !== "todas" || 
    filters.type !== "todas" || 
    filters.maxDistance < 50 || 
    filters.difficulty !== "todas" ||
    filters.maxDuration < 12;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Filtrar Rutas</DialogTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mountain className="w-4 h-4 text-primary" />
              Categoría
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = filters.category === cat.value;
                return (
                  <Badge
                    key={cat.value}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 transition-all ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => onFiltersChange({ ...filters, category: cat.value })}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {cat.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              Tipo de Ruta
            </Label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => {
                const Icon = t.icon;
                const isActive = filters.type === t.value;
                return (
                  <Badge
                    key={t.value}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 transition-all ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => onFiltersChange({ ...filters, type: t.value })}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {t.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Dificultad
            </Label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => {
                const isActive = filters.difficulty === d.value;
                const difficultyColor = d.value === "Fácil" 
                  ? "bg-green-500/10 text-green-600 border-green-500/30" 
                  : d.value === "Moderado" 
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
                        : d.value !== "todas" ? difficultyColor : "hover:bg-accent"
                    }`}
                    onClick={() => onFiltersChange({ ...filters, difficulty: d.value })}
                  >
                    {d.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Distance Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Distancia máxima
              </Label>
              <span className="text-sm font-semibold text-primary">
                {filters.maxDistance === 50 ? "Sin límite" : `${filters.maxDistance} km`}
              </span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={(value) => onFiltersChange({ ...filters, maxDistance: value[0] })}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km+</span>
            </div>
          </div>

          <Separator />

          {/* Duration Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Duración máxima
              </Label>
              <span className="text-sm font-semibold text-primary">
                {filters.maxDuration === 12 ? "Sin límite" : `${filters.maxDuration} horas`}
              </span>
            </div>
            <Slider
              value={[filters.maxDuration]}
              onValueChange={(value) => onFiltersChange({ ...filters, maxDuration: value[0] })}
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1h</span>
              <span>6h</span>
              <span>12h+</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Aplicar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteFiltersDialog;

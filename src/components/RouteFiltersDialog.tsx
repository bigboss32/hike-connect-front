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
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mountain, Trees, Globe, Crown, MapPin, Clock, TrendingUp, RotateCcw,
  Users, Heart, Sparkles, TreePine, Moon, Waves, Home, BookOpen, Compass,
  Footprints, Lamp, Leaf
} from "lucide-react";

export interface RouteFilters {
  category: string;
  type: string;
  maxDistance: number;
  difficulty: string;
  maxDuration: number;
  // Agroturismo-specific
  companion: string;
  experience: string;
  format: string;
  agroDuration: number;
}

interface RouteFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: RouteFilters;
  onFiltersChange: (filters: RouteFilters) => void;
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

  const companions = [
    { value: "familia", label: "Familia" },
    { value: "aventurero", label: "Aventurero" },
    { value: "en_pareja", label: "En pareja" },
  ];

  const experiences = [
    { value: "conexion_naturaleza", label: "Conexión con la naturaleza", icon: TreePine },
    { value: "noches_selva", label: "Noches en la selva", icon: Moon },
    { value: "paseos_rio", label: "Paseos privados en río", icon: Waves },
    { value: "vida_comunidad", label: "Vida en la comunidad", icon: Home },
    { value: "aprender_selva", label: "Aprender de la selva", icon: BookOpen },
    { value: "oficios_artesanias", label: "Oficios y artesanías", icon: Sparkles },
    { value: "paseos_tranquilos", label: "Paseos tranquilos en río", icon: Footprints },
    { value: "relatos_tradiciones", label: "Relatos y tradiciones", icon: Lamp },
    { value: "recorridos_guiados", label: "Recorridos guiados", icon: Compass },
    { value: "exploracion_selva", label: "Exploración en la selva", icon: TreePine },
    { value: "experiencias_nocturnas", label: "Experiencias nocturnas", icon: Moon },
    { value: "travesias_rio", label: "Travesías en río", icon: Waves },
    { value: "saberes_ancestrales", label: "Saberes ancestrales", icon: BookOpen },
    { value: "inmersion_naturaleza", label: "Inmersión en la naturaleza", icon: Leaf },
  ];

  const formats = [
    { value: "estancia", label: "Estancia" },
    { value: "pernocta", label: "Pernocta" },
  ];

  const durationQuickTags = [
    { value: 8, label: "Día completo" },
    { value: 24, label: "Más de una noche" },
  ];

  const handleReset = () => {
    onFiltersChange({
      category: filters.category, // keep category
      type: "todas",
      maxDistance: 50,
      difficulty: "todas",
      maxDuration: 12,
      companion: "todas",
      experience: "todas",
      format: "todas",
      agroDuration: 24,
    });
  };

  const isAgroturismo = filters.category === "agroturismo";

  const hasActiveFilters = isAgroturismo
    ? filters.companion !== "todas" || 
      filters.experience !== "todas" || 
      filters.format !== "todas" || 
      filters.agroDuration < 24
    : filters.category !== "todas" || 
      filters.type !== "todas" || 
      filters.maxDistance < 50 || 
      filters.difficulty !== "todas" ||
      filters.maxDuration < 12;

  const dialogTitle = isAgroturismo ? "Filtros de Experiencia" : "Filtrar Rutas";

  // Get experiences filtered by companion type
  const getFilteredExperiences = () => {
    if (filters.companion === "familia") {
      return experiences.filter(e => 
        ["aprender_selva", "oficios_artesanias", "paseos_tranquilos", "relatos_tradiciones", "recorridos_guiados"].includes(e.value)
      );
    }
    if (filters.companion === "aventurero") {
      return experiences.filter(e => 
        ["exploracion_selva", "experiencias_nocturnas", "travesias_rio", "saberes_ancestrales", "inmersion_naturaleza"].includes(e.value)
      );
    }
    // en_pareja or todas
    return experiences.filter(e => 
      ["conexion_naturaleza", "noches_selva", "paseos_rio", "vida_comunidad"].includes(e.value)
    );
  };

  const visibleExperiences = getFilteredExperiences();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">{dialogTitle}</DialogTitle>
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
          {/* Category Filter - always visible */}
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

          {isAgroturismo ? (
            <>
              {/* ¿Con quién viajas? */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  ¿CON QUIÉN VIAJAS?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {companions.map((c) => {
                    const isActive = filters.companion === c.value;
                    return (
                      <Badge
                        key={c.value}
                        variant={isActive ? "default" : "outline"}
                        className={`cursor-pointer px-4 py-2 transition-all ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                        onClick={() => onFiltersChange({ 
                          ...filters, 
                          companion: isActive ? "todas" : c.value,
                          experience: "todas" // reset experience when companion changes
                        })}
                      >
                        {c.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* ¿Qué te gustaría vivir? */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  ¿QUÉ TE GUSTARÍA VIVIR?
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {visibleExperiences.map((exp) => {
                    const Icon = exp.icon;
                    const isActive = filters.experience === exp.value;
                    return (
                      <Card 
                        key={exp.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          isActive 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "hover:border-primary/40"
                        }`}
                        onClick={() => onFiltersChange({ 
                          ...filters, 
                          experience: isActive ? "todas" : exp.value 
                        })}
                      >
                        <CardContent className="p-3 flex flex-col items-start gap-1.5">
                          <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-xs leading-tight ${isActive ? "text-primary font-medium" : "text-foreground"}`}>
                            {exp.label}
                          </span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* ¿Cómo quieres vivirlo? - Formato */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Compass className="w-4 h-4 text-primary" />
                  ¿CÓMO QUIERES VIVIRLO?
                </Label>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Formato</p>
                <div className="flex gap-2">
                  {formats.map((f) => {
                    const isActive = filters.format === f.value;
                    return (
                      <Badge
                        key={f.value}
                        variant={isActive ? "default" : "outline"}
                        className={`cursor-pointer px-5 py-2.5 text-sm transition-all ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                        onClick={() => onFiltersChange({ 
                          ...filters, 
                          format: isActive ? "todas" : f.value 
                        })}
                      >
                        {f.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Duración - Agroturismo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    DURACIÓN
                  </Label>
                  <span className="text-sm font-semibold text-primary">
                    {filters.agroDuration >= 24 ? "24+ horas" : `${filters.agroDuration} horas`}
                  </span>
                </div>
                <Slider
                  value={[filters.agroDuration]}
                  onValueChange={(value) => onFiltersChange({ ...filters, agroDuration: value[0] })}
                  max={24}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 HORA</span>
                  <span>12 HORAS</span>
                  <span>24+ HORAS</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {durationQuickTags.map((tag) => {
                    const isActive = filters.agroDuration === tag.value;
                    return (
                      <Badge
                        key={tag.value}
                        variant={isActive ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1.5 text-xs transition-all ${
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-accent"
                        }`}
                        onClick={() => onFiltersChange({ ...filters, agroDuration: tag.value })}
                      >
                        {tag.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
            {isAgroturismo ? "Ver experiencias" : "Aplicar Filtros"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RouteFiltersDialog;

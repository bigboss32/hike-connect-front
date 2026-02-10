import { useState } from "react";
import { 
  Mountain, 
  Footprints, 
  MapPin, 
  Users, 
  Calendar, 
  Sunrise,
  Flame,
  Trophy,
  Star,
  Compass,
  TreePine,
  Camera,
  Heart,
  Zap,
  Crown,
  Target,
  Award,
  Timer,
  Route,
  Flag
} from "lucide-react";
import Navigation from "@/components/Navigation";
import ScrollHeader from "@/components/ScrollHeader";
import AchievementBadge from "@/components/AchievementBadge";
import AchievementShowcase from "@/components/AchievementShowcase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock data de logros
const achievementsData = {
  explorer: [
    { id: 1, icon: Footprints, title: "Primeros Pasos", description: "Completa tu primera ruta de senderismo", unlocked: true, rarity: "common" as const, unlockedAt: "15 Ene 2024" },
    { id: 2, icon: MapPin, title: "Cartógrafo", description: "Visita 10 rutas diferentes", progress: 7, maxProgress: 10, unlocked: false, rarity: "rare" as const },
    { id: 3, icon: Mountain, title: "Conquistador de Cumbres", description: "Alcanza 5 cimas de montaña", progress: 3, maxProgress: 5, unlocked: false, rarity: "epic" as const },
    { id: 4, icon: Compass, title: "Sin Límites", description: "Recorre más de 100km en total", progress: 67, maxProgress: 100, unlocked: false, rarity: "legendary" as const },
    { id: 5, icon: TreePine, title: "Guardián del Bosque", description: "Completa 5 rutas en zonas boscosas", unlocked: true, rarity: "rare" as const, unlockedAt: "28 Dic 2023" },
    { id: 6, icon: Route, title: "Maratonista", description: "Completa una ruta de más de 20km", unlocked: false, rarity: "epic" as const },
  ],
  social: [
    { id: 7, icon: Users, title: "Vida Social", description: "Únete a tu primera comunidad", unlocked: true, rarity: "common" as const, unlockedAt: "10 Ene 2024" },
    { id: 8, icon: Heart, title: "Amigo Fiel", description: "Completa 10 rutas con amigos", progress: 4, maxProgress: 10, unlocked: false, rarity: "rare" as const },
    { id: 9, icon: Calendar, title: "Organizador", description: "Crea tu primer evento", unlocked: true, rarity: "common" as const, unlockedAt: "20 Ene 2024" },
    { id: 10, icon: Crown, title: "Líder de la Manada", description: "Lidera un grupo de 10+ personas", unlocked: false, rarity: "legendary" as const },
    { id: 11, icon: Star, title: "Influencer", description: "Recibe 50 likes en tus publicaciones", progress: 23, maxProgress: 50, unlocked: false, rarity: "epic" as const },
  ],
  challenge: [
    { id: 12, icon: Sunrise, title: "Madrugador", description: "Comienza una ruta antes de las 6 AM", unlocked: true, rarity: "rare" as const, unlockedAt: "5 Feb 2024" },
    { id: 13, icon: Flame, title: "Racha de Fuego", description: "Mantén una racha de 7 días activo", progress: 3, maxProgress: 7, unlocked: false, rarity: "epic" as const },
    { id: 14, icon: Zap, title: "Velocista", description: "Completa una ruta en tiempo récord", unlocked: false, rarity: "rare" as const },
    { id: 15, icon: Target, title: "Perfeccionista", description: "Completa una ruta con puntuación perfecta", unlocked: true, rarity: "epic" as const, unlockedAt: "1 Feb 2024" },
    { id: 16, icon: Timer, title: "Incansable", description: "Acumula 24 horas de caminata", progress: 18, maxProgress: 24, unlocked: false, rarity: "legendary" as const },
  ],
  special: [
    { id: 17, icon: Camera, title: "Fotógrafo", description: "Comparte 20 fotos de tus aventuras", progress: 12, maxProgress: 20, unlocked: false, rarity: "rare" as const },
    { id: 18, icon: Award, title: "Veterano", description: "Usa la app durante 1 año", unlocked: false, rarity: "legendary" as const },
    { id: 19, icon: Flag, title: "Pionero", description: "Sé el primero en completar una nueva ruta", unlocked: true, rarity: "legendary" as const, unlockedAt: "12 Ene 2024" },
    { id: 20, icon: Trophy, title: "Coleccionista", description: "Desbloquea todos los logros", progress: 7, maxProgress: 20, unlocked: false, rarity: "legendary" as const },
  ]
};

const categories = [
  { id: "all", label: "Todos", icon: Trophy },
  { id: "explorer", label: "Explorador", icon: Compass },
  { id: "social", label: "Social", icon: Users },
  { id: "challenge", label: "Desafíos", icon: Flame },
  { id: "special", label: "Especiales", icon: Star },
];

const featuredAchievements = [
  { icon: Flag, title: "Pionero", rarity: "legendary" as const },
  { icon: Sunrise, title: "Madrugador", rarity: "rare" as const },
  { icon: TreePine, title: "Guardián del Bosque", rarity: "rare" as const },
  { icon: Target, title: "Perfeccionista", rarity: "epic" as const },
  { icon: Footprints, title: "Primeros Pasos", rarity: "common" as const },
];

const Achievements = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

  const allAchievements = [
    ...achievementsData.explorer,
    ...achievementsData.social,
    ...achievementsData.challenge,
    ...achievementsData.special,
  ];

  const getFilteredAchievements = () => {
    let achievements = activeCategory === "all" 
      ? allAchievements 
      : achievementsData[activeCategory as keyof typeof achievementsData] || [];

    if (filter === "unlocked") {
      achievements = achievements.filter(a => a.unlocked);
    } else if (filter === "locked") {
      achievements = achievements.filter(a => !a.unlocked);
    }

    return achievements;
  };

  const totalUnlocked = allAchievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <ScrollHeader className="bg-background/80 backdrop-blur-lg border-b">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Mis Logros</h1>
          <p className="text-sm text-muted-foreground">Tu progreso como explorador</p>
        </div>
      </ScrollHeader>

      <div className="px-4 py-4 space-y-6">
        {/* Showcase */}
        <AchievementShowcase
          achievements={featuredAchievements}
          totalUnlocked={totalUnlocked}
          totalAchievements={allAchievements.length}
          currentLevel={12}
          xp={2450}
          xpToNextLevel={3000}
        />

        {/* Category tabs */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "Todos" },
            { id: "unlocked", label: "Desbloqueados" },
            { id: "locked", label: "Bloqueados" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f.id
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground">
            {getFilteredAchievements().length} logros
          </span>
        </div>

        {/* Achievements grid */}
        <div className="grid gap-3">
          {getFilteredAchievements().map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              progress={achievement.progress}
              maxProgress={achievement.maxProgress}
              unlocked={achievement.unlocked}
              rarity={achievement.rarity}
              unlockedAt={achievement.unlockedAt}
            />
          ))}
        </div>

        {/* Empty state */}
        {getFilteredAchievements().length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No hay logros</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "unlocked" 
                ? "Aún no has desbloqueado logros en esta categoría" 
                : "No hay logros bloqueados en esta categoría"}
            </p>
          </div>
        )}

        {/* Motivational card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 p-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">¡Sigue así!</h3>
              <p className="text-sm text-muted-foreground">
                Te faltan solo <span className="font-semibold text-amber-600 dark:text-amber-400">{allAchievements.length - totalUnlocked} logros</span> para completar tu colección
              </p>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Achievements;

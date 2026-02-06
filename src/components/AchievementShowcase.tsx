import { cn } from "@/lib/utils";
import { LucideIcon, Trophy, Sparkles } from "lucide-react";

interface FeaturedAchievement {
  icon: LucideIcon;
  title: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface AchievementShowcaseProps {
  achievements: FeaturedAchievement[];
  totalUnlocked: number;
  totalAchievements: number;
  currentLevel: number;
  xp: number;
  xpToNextLevel: number;
}

const rarityGradients = {
  common: "from-slate-400 to-slate-500",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-amber-400 via-orange-500 to-red-500"
};

const AchievementShowcase = ({
  achievements,
  totalUnlocked,
  totalAchievements,
  currentLevel,
  xp,
  xpToNextLevel
}: AchievementShowcaseProps) => {
  const progressPercent = (xp / xpToNextLevel) * 100;
  const unlockedPercent = (totalUnlocked / totalAchievements) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative p-6">
        {/* Header con nivel */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Level badge */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-2xl font-black text-primary-foreground">{currentLevel}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-foreground">Nivel {currentLevel}</h2>
              <p className="text-sm text-muted-foreground">Explorador Experto</p>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-lg font-bold text-foreground">{totalUnlocked}</span>
              <span className="text-muted-foreground">/ {totalAchievements}</span>
            </div>
            <p className="text-xs text-muted-foreground">Logros desbloqueados</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Experiencia</span>
            <span className="font-medium text-foreground">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
          </div>
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {(xpToNextLevel - xp).toLocaleString()} XP para el nivel {currentLevel + 1}
          </p>
        </div>

        {/* Featured achievements */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Logros Destacados</h3>
          <div className="flex items-center gap-3">
            {achievements.slice(0, 5).map((achievement, index) => {
              const Icon = achievement.icon;
              const gradient = rarityGradients[achievement.rarity];
              
              return (
                <div 
                  key={index}
                  className="group relative"
                >
                  {/* Glow */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity",
                    `bg-gradient-to-br ${gradient}`
                  )} />
                  
                  {/* Badge */}
                  <div className={cn(
                    "relative w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 shadow-lg transition-transform group-hover:scale-110",
                    `bg-gradient-to-br ${gradient}`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-[10px] font-medium bg-foreground text-background px-2 py-1 rounded whitespace-nowrap">
                      {achievement.title}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* More indicator */}
            {totalUnlocked > 5 && (
              <div className="w-12 h-12 rounded-xl bg-muted/50 border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <span className="text-sm font-bold text-muted-foreground">+{totalUnlocked - 5}</span>
              </div>
            )}
          </div>
        </div>

        {/* Completion bar */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground">Colección completada</span>
            <span className="font-semibold text-primary">{Math.round(unlockedPercent)}%</span>
          </div>
          <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${unlockedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementShowcase;

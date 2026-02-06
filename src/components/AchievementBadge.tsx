import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AchievementBadgeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  size?: "sm" | "md" | "lg";
}

const rarityConfig = {
  common: {
    gradient: "from-slate-400 to-slate-500",
    glow: "shadow-slate-400/30",
    border: "border-slate-400/50",
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    label: "Común"
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-500/40",
    border: "border-blue-400/50",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    label: "Raro"
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "shadow-purple-500/40",
    border: "border-purple-400/50",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    label: "Épico"
  },
  legendary: {
    gradient: "from-amber-400 via-orange-500 to-red-500",
    glow: "shadow-amber-500/50",
    border: "border-amber-400/50",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    label: "Legendario"
  }
};

const AchievementBadge = ({
  icon: Icon,
  title,
  description,
  progress,
  maxProgress,
  unlocked,
  rarity,
  unlockedAt,
  size = "md"
}: AchievementBadgeProps) => {
  const config = rarityConfig[rarity];
  const hasProgress = progress !== undefined && maxProgress !== undefined;
  const progressPercent = hasProgress ? (progress / maxProgress) * 100 : 0;

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9"
  };

  return (
    <div className={cn(
      "group relative p-4 rounded-2xl transition-all duration-300",
      unlocked 
        ? `${config.bg} hover:scale-[1.02]` 
        : "bg-muted/30 opacity-60 grayscale hover:opacity-80"
    )}>
      {/* Badge principal */}
      <div className="flex items-start gap-4">
        {/* Icono del logro */}
        <div className="relative flex-shrink-0">
          {/* Glow effect para desbloqueados */}
          {unlocked && (
            <div className={cn(
              "absolute inset-0 rounded-2xl blur-xl opacity-50 transition-opacity group-hover:opacity-75",
              `bg-gradient-to-br ${config.gradient}`
            )} />
          )}
          
          {/* Badge container */}
          <div className={cn(
            "relative rounded-2xl flex items-center justify-center border-2 transition-all",
            sizeClasses[size],
            unlocked 
              ? `bg-gradient-to-br ${config.gradient} border-transparent shadow-lg ${config.glow}` 
              : "bg-muted border-muted-foreground/20"
          )}>
            <Icon className={cn(
              iconSizes[size],
              unlocked ? "text-white" : "text-muted-foreground/50"
            )} />
            
            {/* Shine effect */}
            {unlocked && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </div>
            )}
          </div>

          {/* Lock indicator */}
          {!unlocked && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/30 flex items-center justify-center">
              <svg className="w-3 h-3 text-muted-foreground/70" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Info del logro */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={cn(
                "font-bold text-sm leading-tight",
                unlocked ? "text-foreground" : "text-muted-foreground"
              )}>
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {description}
              </p>
            </div>
            
            {/* Rarity badge */}
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0",
              unlocked ? `${config.bg} ${config.text}` : "bg-muted text-muted-foreground"
            )}>
              {config.label}
            </span>
          </div>

          {/* Progress bar */}
          {hasProgress && !unlocked && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium text-foreground">{progress}/{maxProgress}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500 bg-gradient-to-r", config.gradient)}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Unlocked date */}
          {unlocked && unlockedAt && (
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Desbloqueado {unlockedAt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementBadge;

import { useEffect, useState } from "react";

const LogoutAnimation = ({ onLogout, onComplete }: { onLogout: () => void; onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => { setPhase(2); onLogout(); }, 1800);
    const t3 = setTimeout(() => onComplete(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onLogout, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500"
      style={{ opacity: phase >= 2 ? 0 : 1 }}
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950 opacity-80" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated hiker walking away */}
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
          {/* Moon */}
          <circle cx="90" cy="25" r="12" fill="hsl(var(--primary))" opacity="0.3" />
          <circle cx="95" cy="22" r="10" fill="hsl(var(--background))" opacity="0.3" />

          {/* Stars */}
          {[
            [20, 15], [40, 25], [75, 10], [105, 35], [15, 40], [55, 18],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="1.2" fill="white" opacity="0.6"
              className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}

          {/* Ground */}
          <path d="M0 95 Q30 85 60 90 Q90 95 120 88 L120 120 L0 120Z" fill="hsl(var(--primary))" opacity="0.15" />

          {/* Hiker silhouette walking away - gets smaller */}
          <g
            className="transition-all duration-[1500ms] ease-in-out"
            style={{
              transform: phase >= 1 ? "translate(35px, -10px) scale(0.4)" : "translate(0px, 0px) scale(1)",
              opacity: phase >= 1 ? 0.3 : 1,
              transformOrigin: "60px 80px",
            }}
          >
            {/* Head */}
            <circle cx="60" cy="62" r="6" fill="hsl(var(--primary-foreground))" opacity="0.9" />
            {/* Hat */}
            <ellipse cx="60" cy="57.5" rx="8" ry="2" fill="hsl(var(--primary-foreground))" opacity="0.7" />
            {/* Body */}
            <rect x="56.5" y="68" width="7" height="14" rx="3.5" fill="hsl(var(--primary-foreground))" opacity="0.85" />
            {/* Backpack */}
            <rect x="63" y="69" width="5" height="10" rx="2" fill="hsl(var(--primary-foreground))" opacity="0.5" />
            {/* Left leg */}
            <rect x="56" y="82" width="4" height="12" rx="2" fill="hsl(var(--primary-foreground))" opacity="0.8"
              className={phase >= 1 ? "animate-pulse" : ""} />
            {/* Right leg */}
            <rect x="61" y="82" width="4" height="12" rx="2" fill="hsl(var(--primary-foreground))" opacity="0.8"
              className={phase >= 1 ? "animate-pulse" : ""}
              style={{ animationDelay: "0.25s" }} />
            {/* Walking stick */}
            <line x1="52" y1="72" x2="48" y2="94" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </g>
        </svg>

        {/* Text */}
        <div className="text-center transition-all duration-700"
          style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(10px)" }}
        >
          <p className="text-primary-foreground/80 text-sm font-medium">Hasta la próxima aventura...</p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoutAnimation;

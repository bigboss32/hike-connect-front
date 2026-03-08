/**
 * AchievementCelebration — Epic animated mountain summit scene
 * with a celebrating hiker, waving flags, floating particles and atmospheric effects.
 */

const AchievementCelebration = () => {
  return (
    <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-gradient-to-b from-sky-200/60 via-sky-100/40 to-primary/10 dark:from-sky-900/40 dark:via-primary/20 dark:to-background">
      <svg viewBox="0 0 320 140" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          {/* Mountain gradient */}
          <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150, 30%, 35%)" />
            <stop offset="100%" stopColor="hsl(150, 25%, 25%)" />
          </linearGradient>
          <linearGradient id="mountainBgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150, 20%, 50%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(150, 20%, 40%)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="skyGlow" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="hsl(40, 90%, 70%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          {/* Flag gradient */}
          <linearGradient id="flagGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(25, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(25, 85%, 45%)" />
          </linearGradient>
        </defs>

        {/* Sky glow behind summit */}
        <ellipse cx="160" cy="50" rx="80" ry="50" fill="url(#skyGlow)" />

        {/* Background mountains */}
        <polygon points="0,140 30,70 70,95 110,55 150,85 200,45 250,75 290,60 320,80 320,140" fill="url(#mountainBgGrad)" />
        
        {/* Main mountain */}
        <polygon points="60,140 160,28 260,140" fill="url(#mountainGrad)" />
        
        {/* Snow cap */}
        <polygon points="140,50 160,28 180,50 172,52 165,45 155,45 148,52" fill="url(#snowGrad)" />
        
        {/* Mountain texture lines */}
        <line x1="130" y1="65" x2="160" y2="35" stroke="hsl(150, 20%, 30%)" strokeWidth="0.5" opacity="0.3" />
        <line x1="190" y1="65" x2="160" y2="35" stroke="hsl(150, 20%, 30%)" strokeWidth="0.5" opacity="0.3" />

        {/* Small background trees on left mountain */}
        {[20, 35, 50, 75, 90].map((x, i) => (
          <g key={`tree-l-${i}`} transform={`translate(${x}, ${105 + Math.sin(i) * 5})`}>
            <polygon points="0,-8 3,0 -3,0" fill="hsl(150, 35%, 30%)" opacity="0.5" />
            <rect x="-0.5" y="0" width="1" height="3" fill="hsl(30, 30%, 30%)" opacity="0.4" />
          </g>
        ))}
        {[230, 245, 260, 275, 295].map((x, i) => (
          <g key={`tree-r-${i}`} transform={`translate(${x}, ${105 + Math.cos(i) * 5})`}>
            <polygon points="0,-8 3,0 -3,0" fill="hsl(150, 35%, 30%)" opacity="0.5" />
            <rect x="-0.5" y="0" width="1" height="3" fill="hsl(30, 30%, 30%)" opacity="0.4" />
          </g>
        ))}

        {/* Ground at base */}
        <ellipse cx="160" cy="138" rx="140" ry="8" fill="hsl(150, 25%, 22%)" opacity="0.4" />

        {/* === FLAG on summit === */}
        <g transform="translate(155, 24)">
          {/* Pole */}
          <rect x="0" y="-20" width="1.5" height="24" rx="0.5" fill="hsl(30, 20%, 50%)" />
          {/* Flag waving */}
          <g className="origin-top-left" style={{ animation: "flagWave 2s ease-in-out infinite" }}>
            <path d="M1.5,-20 Q8,-22 12,-18 Q16,-14 12,-12 Q8,-10 1.5,-12 Z" fill="url(#flagGrad)" />
            <path d="M1.5,-20 Q8,-22 12,-18" fill="none" stroke="hsl(25, 85%, 40%)" strokeWidth="0.5" />
          </g>
          {/* Flag pole top */}
          <circle cx="0.75" cy="-20.5" r="1.5" fill="hsl(40, 80%, 55%)" />
        </g>

        {/* === CELEBRATING HIKER === */}
        <g transform="translate(140, 36)">
          {/* Backpack */}
          <rect x="12" y="20" width="7" height="10" rx="2" fill="hsl(25, 60%, 40%)" />
          <rect x="13" y="22" width="5" height="3" rx="1" fill="hsl(25, 50%, 35%)" />

          {/* Body */}
          <rect x="7" y="18" width="10" height="16" rx="3" fill="hsl(150, 45%, 35%)" />
          
          {/* Head */}
          <circle cx="12" cy="12" r="6.5" fill="hsl(30, 50%, 65%)" />
          {/* Hat */}
          <ellipse cx="12" cy="7.5" rx="7" ry="2" fill="hsl(150, 40%, 30%)" />
          <rect x="7" y="4" width="10" height="4" rx="2" fill="hsl(150, 40%, 30%)" />
          
          {/* Happy face */}
          <circle cx="10" cy="12" r="0.8" fill="hsl(150, 30%, 20%)" />
          <circle cx="14" cy="12" r="0.8" fill="hsl(150, 30%, 20%)" />
          <path d="M9.5,14.5 Q12,17 14.5,14.5" fill="none" stroke="hsl(150, 30%, 20%)" strokeWidth="0.8" strokeLinecap="round" />
          
          {/* Left arm raised with celebration */}
          <g style={{ animation: "armCelebrate 1.5s ease-in-out infinite", transformOrigin: "8px 20px" }}>
            <rect x="0" y="14" width="4" height="12" rx="2" fill="hsl(150, 45%, 35%)" />
            {/* Hand */}
            <circle cx="2" cy="13" r="2" fill="hsl(30, 50%, 65%)" />
          </g>
          
          {/* Right arm raised */}
          <g style={{ animation: "armCelebrate 1.5s ease-in-out infinite 0.3s", transformOrigin: "16px 20px" }}>
            <rect x="20" y="14" width="4" height="12" rx="2" fill="hsl(150, 45%, 35%)" />
            {/* Hand holding a small trophy */}
            <circle cx="22" cy="13" r="2" fill="hsl(30, 50%, 65%)" />
            <g transform="translate(19, 4)">
              <rect x="0" y="2" width="6" height="5" rx="1" fill="hsl(40, 85%, 55%)" />
              <rect x="1.5" y="7" width="3" height="2" fill="hsl(40, 75%, 45%)" />
              <rect x="0.5" y="9" width="5" height="1.5" rx="0.5" fill="hsl(40, 75%, 45%)" />
              <path d="M-1,3 Q-2,5 0,6.5" fill="none" stroke="hsl(40, 85%, 55%)" strokeWidth="0.8" />
              <path d="M7,3 Q8,5 6,6.5" fill="none" stroke="hsl(40, 85%, 55%)" strokeWidth="0.8" />
            </g>
          </g>

          {/* Legs */}
          <rect x="8" y="33" width="4" height="12" rx="2" fill="hsl(220, 15%, 35%)" />
          <rect x="13" y="33" width="4" height="12" rx="2" fill="hsl(220, 15%, 35%)" />
          {/* Boots */}
          <ellipse cx="10" cy="46" rx="3.5" ry="2" fill="hsl(25, 40%, 30%)" />
          <ellipse cx="15" cy="46" rx="3.5" ry="2" fill="hsl(25, 40%, 30%)" />
        </g>

        {/* === SPARKLE PARTICLES === */}
        {[
          { x: 120, y: 15, delay: 0, size: 2 },
          { x: 195, y: 20, delay: 0.5, size: 1.5 },
          { x: 145, y: 8, delay: 1, size: 2.5 },
          { x: 175, y: 12, delay: 1.5, size: 1.8 },
          { x: 130, y: 25, delay: 0.8, size: 1.2 },
          { x: 185, y: 30, delay: 1.2, size: 1.5 },
        ].map((p, i) => (
          <g key={`sparkle-${i}`} style={{ animation: `sparkleFloat 2.5s ease-in-out infinite ${p.delay}s` }}>
            {/* 4-point star */}
            <path
              d={`M${p.x},${p.y - p.size} L${p.x + p.size * 0.3},${p.y} L${p.x},${p.y + p.size} L${p.x - p.size * 0.3},${p.y} Z`}
              fill="hsl(40, 90%, 60%)"
              opacity="0.8"
            />
            <path
              d={`M${p.x - p.size},${p.y} L${p.x},${p.y + p.size * 0.3} L${p.x + p.size},${p.y} L${p.x},${p.y - p.size * 0.3} Z`}
              fill="hsl(40, 90%, 60%)"
              opacity="0.6"
            />
          </g>
        ))}

        {/* === FLOATING CONFETTI === */}
        {[
          { x: 110, y: 10, color: "hsl(25, 90%, 55%)", delay: 0 },
          { x: 130, y: 5, color: "hsl(40, 85%, 55%)", delay: 0.3 },
          { x: 180, y: 8, color: "hsl(150, 45%, 45%)", delay: 0.7 },
          { x: 200, y: 15, color: "hsl(25, 90%, 55%)", delay: 1.1 },
          { x: 150, y: 3, color: "hsl(270, 60%, 60%)", delay: 0.5 },
          { x: 170, y: 12, color: "hsl(40, 85%, 55%)", delay: 1.4 },
        ].map((c, i) => (
          <rect
            key={`confetti-${i}`}
            x={c.x}
            y={c.y}
            width="3"
            height="2"
            rx="0.5"
            fill={c.color}
            style={{
              animation: `confettiFall 3s ease-in-out infinite ${c.delay}s`,
              transformOrigin: `${c.x + 1.5}px ${c.y + 1}px`,
            }}
          />
        ))}

        {/* Clouds */}
        <g opacity="0.6" style={{ animation: "cloudDriftSlow 20s linear infinite" }}>
          <ellipse cx="40" cy="20" rx="18" ry="6" fill="white" opacity="0.5" />
          <ellipse cx="48" cy="18" rx="12" ry="5" fill="white" opacity="0.4" />
        </g>
        <g opacity="0.4" style={{ animation: "cloudDriftSlow 28s linear infinite 5s" }}>
          <ellipse cx="260" cy="15" rx="15" ry="5" fill="white" opacity="0.5" />
          <ellipse cx="270" cy="13" rx="10" ry="4" fill="white" opacity="0.4" />
        </g>

        {/* Birds */}
        <g opacity="0.4" style={{ animation: "birdFly 8s linear infinite" }}>
          <path d="M0,0 Q3,-3 6,0" fill="none" stroke="hsl(150, 20%, 30%)" strokeWidth="0.8" />
        </g>
        <g opacity="0.3" style={{ animation: "birdFly 10s linear infinite 3s" }}>
          <path d="M0,0 Q2.5,-2.5 5,0" fill="none" stroke="hsl(150, 20%, 30%)" strokeWidth="0.7" transform="translate(20, 8)" />
        </g>
      </svg>

      {/* CSS Animations via style tag */}
      <style>{`
        @keyframes flagWave {
          0%, 100% { transform: scaleX(1) skewY(0deg); }
          25% { transform: scaleX(0.9) skewY(-2deg); }
          50% { transform: scaleX(1.05) skewY(1deg); }
          75% { transform: scaleX(0.95) skewY(-1deg); }
        }
        @keyframes armCelebrate {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(-35deg); }
        }
        @keyframes sparkleFloat {
          0%, 100% { opacity: 0.3; transform: translateY(0) scale(0.8); }
          50% { opacity: 1; transform: translateY(-4px) scale(1.2); }
        }
        @keyframes confettiFall {
          0% { opacity: 0; transform: translateY(-10px) rotate(0deg); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(30px) rotate(360deg); }
        }
        @keyframes cloudDriftSlow {
          0% { transform: translateX(320px); }
          100% { transform: translateX(-80px); }
        }
        @keyframes birdFly {
          0% { transform: translate(320px, 10px); }
          100% { transform: translate(-30px, 5px); }
        }
      `}</style>
    </div>
  );
};

export default AchievementCelebration;

/**
 * RoutesHeroScene — Lightweight, smooth animated SVG landscape.
 * "rutas" = trail scene, "hospedajes" = cozy cabin scene.
 * Optimized: fewer elements, will-change hints, CSS-only animations.
 */
import { useMemo } from "react";

type TimeSlot = "dawn" | "morning" | "afternoon" | "sunset" | "night";

const getTimeSlot = (): TimeSlot => {
  const h = new Date().getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "sunset";
  return "night";
};

interface Props {
  mode?: "rutas" | "hospedajes";
}

const RoutesHeroScene = ({ mode = "rutas" }: Props) => {
  const time = getTimeSlot();
  const isNight = time === "night";
  const isSunset = time === "sunset";
  const isHospedaje = mode === "hospedajes";

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/30 via-amber-200/20 to-sky-200/15",
    morning: "from-amber-200/20 via-sky-300/15 to-emerald-200/10",
    afternoon: "from-orange-200/15 via-amber-100/10 to-sky-200/10",
    sunset: "from-orange-400/30 via-rose-300/25 to-purple-300/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/15",
  };

  const sunColor = isSunset ? "#FB923C" : "#FBBF24";
  const glowColor = isSunset ? "#F97316" : "#F59E0B";

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-700`} />

      {/* Single SVG scene — much better perf than many divs */}
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full rs-scene"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rs-farMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,25%,38%)" />
            <stop offset="100%" stopColor="hsl(150,20%,28%)" />
          </linearGradient>
          <linearGradient id="rs-midMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,32%)" />
            <stop offset="100%" stopColor="hsl(150,25%,22%)" />
          </linearGradient>
          <linearGradient id="rs-nearMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,35%,28%)" />
            <stop offset="100%" stopColor="hsl(150,30%,18%)" />
          </linearGradient>
          <linearGradient id="rs-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,28%,20%)" />
            <stop offset="100%" stopColor="hsl(150,25%,14%)" />
          </linearGradient>
          <radialGradient id="rs-sun">
            <stop offset="0%" stopColor={sunColor} stopOpacity="0.9" />
            <stop offset="45%" stopColor={glowColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
            <stop offset="15%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
            <stop offset="85%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Celestial ── */}
        {isNight ? (
          <g className="rs-celestial">
            <circle cx="320" cy="30" r="12" fill="#F1F5F9" opacity="0.7" />
            <circle cx="316" cy="28" r="2" fill="#CBD5E1" opacity="0.3" />
            {[{x:30,y:15},{x:90,y:25},{x:160,y:10},{x:220,y:30},{x:290,y:18},{x:360,y:22},{x:50,y:40},{x:180,y:38}].map((s,i) => (
              <circle key={i} cx={s.x} cy={s.y} r={1 + (i % 3) * 0.4} fill="white" className="rs-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </g>
        ) : (
          <g className="rs-sun-group">
            <circle cx="320" cy={time === "dawn" ? 55 : time === "sunset" ? 50 : 28} r="22" fill="url(#rs-sun)" />
            <circle cx="320" cy={time === "dawn" ? 55 : time === "sunset" ? 50 : 28} r="8" fill={sunColor} opacity="0.85" />
          </g>
        )}

        {/* ── Clouds ── */}
        <g opacity={isNight ? 0.15 : 0.3}>
          <ellipse cx="0" cy="38" rx="28" ry="7" fill="white" opacity="0.5" className="rs-cloud1" />
          <ellipse cx="0" cy="50" rx="22" ry="5.5" fill="white" opacity="0.4" className="rs-cloud2" />
        </g>

        {/* ── Far Mountains ── */}
        <path d="M0,120 L30,88 L70,100 L110,76 L150,95 L190,68 L230,88 L270,74 L310,82 L350,65 L380,80 L400,75 L400,120Z"
          fill="url(#rs-farMtn)" opacity="0.35" />
        {/* Snow caps */}
        <path d="M190,68 L183,78 L197,78Z" fill="white" opacity="0.25" />
        <path d="M350,65 L344,74 L356,74Z" fill="white" opacity="0.2" />

        {/* ── Mid Mountains ── */}
        <path d="M0,135 L25,105 L65,118 L100,92 L140,110 L175,85 L215,103 L255,90 L290,100 L330,82 L370,98 L400,92 L400,135Z"
          fill="url(#rs-midMtn)" opacity="0.55" />
        <path d="M175,85 L169,94 L181,94Z" fill="white" opacity="0.2" />

        {/* ── Near Mountains ── */}
        <path d="M0,155 L20,128 L58,138 L95,118 L135,132 L170,112 L210,128 L250,120 L290,135 L330,122 L370,130 L400,126 L400,155Z"
          fill="url(#rs-nearMtn)" opacity="0.7" />

        {/* ── Far tree line ── */}
        <g opacity="0.3">
          {[20,50,85,120,155,190,225,260,295,330,365].map((x, i) => (
            <polygon key={i} points={`${x},145 ${x-4},132 ${x+4},132`} fill="hsl(150,38%,30%)" />
          ))}
        </g>

        {/* ── Rolling ground ── */}
        <path d="M0,160 Q50,152 100,158 Q150,166 200,154 Q250,146 300,158 Q350,166 400,152 L400,200 L0,200Z"
          fill="url(#rs-ground)" opacity="0.6" />
        <path d="M0,168 Q60,160 120,166 Q180,174 240,162 Q300,154 360,166 Q380,170 400,162 L400,200 L0,200Z"
          fill="hsl(150,22%,12%)" opacity="0.45" />

        {/* ── Near trees (gentle sway) ── */}
        <g>
          {[
            { x: 18, h: 30, d: 0 }, { x: 60, h: 24, d: 0.6 }, { x: 105, h: 28, d: 1.2 },
            { x: 180, h: 26, d: 0.3 }, { x: 240, h: 32, d: 0.9 }, { x: 295, h: 22, d: 1.5 },
            { x: 340, h: 27, d: 0.4 }, { x: 385, h: 24, d: 1.1 },
          ].map((t, i) => (
            <g key={i} className="rs-tree" style={{ animationDelay: `${t.d}s`, transformOrigin: `${t.x}px 170px` }}>
              <rect x={t.x - 1.5} y={170 - t.h * 0.5} width="3" height={t.h * 0.5} rx="1" fill="hsl(25,30%,24%)" />
              <polygon points={`${t.x},${170 - t.h} ${t.x - 8},${170 - t.h * 0.38} ${t.x + 8},${170 - t.h * 0.38}`} fill="hsl(150,40%,26%)" />
              <polygon points={`${t.x},${170 - t.h * 0.82} ${t.x - 6},${170 - t.h * 0.28} ${t.x + 6},${170 - t.h * 0.28}`} fill="hsl(150,42%,30%)" opacity="0.85" />
            </g>
          ))}
        </g>

        {/* ── MODE: RUTAS — Trail path + markers (always rendered, transitioned) ── */}
        <g className="rs-mode-layer" style={{ opacity: isHospedaje ? 0 : 1, transform: isHospedaje ? 'translateY(6px) scale(0.97)' : 'translateY(0) scale(1)' }}>
            <path d="M-10,168 Q50,158 110,165 Q170,174 230,160 Q290,150 350,165 Q380,170 410,158"
              fill="none" stroke="url(#rs-trail)" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />
            {[70, 160, 250, 340].map((x, i) => (
              <g key={i}>
                <rect x={x - 1} y="155" width="2" height="10" rx="0.5" fill="hsl(30,30%,35%)" />
                <circle cx={x} cy="153" r="3" fill="hsl(25,80%,55%)" opacity="0.7" />
                <circle cx={x} cy="153" r="1.5" fill="hsl(25,90%,65%)" opacity="0.9" />
              </g>
            ))}
            {/* Small hiker silhouette */}
            <g className="rs-hiker" opacity="0.4">
              <circle cx="195" cy="150" r="2.5" fill="hsl(25,30%,25%)" />
              <rect x="193.5" y="153" width="3" height="6" rx="1" fill="hsl(25,30%,25%)" />
              <line x1="195" y1="153" x2="192" y2="148" stroke="hsl(30,30%,35%)" strokeWidth="0.8" strokeLinecap="round" />
            </g>
        </g>

        {/* ── MODE: HOSPEDAJES — Cozy cabin (always rendered, transitioned) ── */}
        <g className="rs-mode-layer" style={{ opacity: isHospedaje ? 1 : 0, transform: isHospedaje ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)' }}>
            {/* Cabin body */}
            <rect x="168" y="132" width="64" height="38" rx="2" fill="hsl(25,38%,26%)" />
            {/* Wood planks */}
            {[140, 148, 156, 164].map((y) => (
              <line key={y} x1="170" y1={y} x2="230" y2={y} stroke="hsl(25,28%,20%)" strokeWidth="0.5" opacity="0.35" />
            ))}
            {/* Roof */}
            <polygon points="160,134 200,108 240,134" fill="hsl(25,32%,20%)" />
            <polygon points="163,134 200,112 237,134" fill="hsl(25,28%,28%)" />
            <line x1="200" y1="108" x2="200" y2="112" stroke="hsl(25,22%,16%)" strokeWidth="1.5" />
            
            {/* Windows with warm glow */}
            <rect x="174" y="140" width="12" height="10" rx="1.5" fill="hsl(25,28%,20%)" />
            <rect x="175" y="141" width="10" height="8" rx="1" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? 0.65 : 0.35} />
            <line x1="180" y1="141" x2="180" y2="149" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />
            <line x1="175" y1="145" x2="185" y2="145" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />

            <rect x="214" y="140" width="12" height="10" rx="1.5" fill="hsl(25,28%,20%)" />
            <rect x="215" y="141" width="10" height="8" rx="1" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? 0.65 : 0.35} />
            <line x1="220" y1="141" x2="220" y2="149" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />
            <line x1="215" y1="145" x2="225" y2="145" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />

            {/* Door */}
            <rect x="192" y="152" width="16" height="18" rx="1.5" fill="hsl(25,32%,18%)" />
            <rect x="193.5" y="153.5" width="13" height="15" rx="1" fill="hsl(25,28%,22%)" />
            <circle cx="204" cy="162" r="1.2" fill="#FBBF24" opacity="0.5" />
            
            {/* Chimney + smoke */}
            <rect x="218" y="114" width="7" height="16" rx="1" fill="hsl(25,26%,22%)" />
            <rect x="216" y="112" width="11" height="3" rx="1" fill="hsl(25,22%,18%)" />
            {isHospedaje && <>
              <circle cx="221" cy="106" r="2.5" fill="currentColor" className="text-muted-foreground rs-smoke1" />
              <circle cx="223" cy="99" r="2" fill="currentColor" className="text-muted-foreground rs-smoke2" />
              <circle cx="220" cy="93" r="2.8" fill="currentColor" className="text-muted-foreground rs-smoke3" />
            </>}

            {/* Night glow pools */}
            {isNight && (
              <>
                <ellipse cx="180" cy="152" rx="10" ry="4" fill="#FDE68A" opacity="0.06" />
                <ellipse cx="220" cy="152" rx="10" ry="4" fill="#FDE68A" opacity="0.06" />
                <ellipse cx="200" cy="172" rx="14" ry="5" fill="#FDE68A" opacity="0.04" />
              </>
            )}

            {/* Garden flowers */}
            {[{x: 155, c: "#F59E0B"}, {x: 162, c: "#EF4444"}, {x: 238, c: "#A78BFA"}, {x: 246, c: "#F59E0B"}].map((f, i) => (
              <g key={i} className="rs-flower" style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${f.x}px 170px` }}>
                <line x1={f.x} y1="170" x2={f.x} y2="163" stroke="hsl(150,40%,30%)" strokeWidth="1" />
                <circle cx={f.x} cy="161" r="2.5" fill={f.c} opacity="0.6" />
                <circle cx={f.x} cy="161" r="1" fill="white" opacity="0.4" />
              </g>
            ))}

            {/* Fence posts */}
            {[148, 156, 164, 236, 244, 252].map((x) => (
              <rect key={x} x={x} y="160" width="1.5" height="10" rx="0.5" fill="hsl(30,28%,35%)" opacity="0.3" />
            ))}
            <rect x="148" y="163" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.25" />
            <rect x="148" y="167" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.25" />
            <rect x="236" y="163" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.25" />
            <rect x="236" y="167" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.25" />
        </g>

        {/* ── Birds ── */}
        <g>
          {[{y: 35, d: 0}, {y: 48, d: 4}, {y: 28, d: 7}].map((b, i) => (
            <g key={i} className="rs-bird" style={{ animationDelay: `${b.d}s` }}>
              <path d={`M0,${b.y} Q4,${b.y - 4} 8,${b.y} Q12,${b.y - 4} 16,${b.y}`}
                fill="none" stroke="currentColor" className="text-foreground/20" strokeWidth="1.2" strokeLinecap="round">
                <animate attributeName="d"
                  values={`M0,${b.y} Q4,${b.y-4} 8,${b.y} Q12,${b.y-4} 16,${b.y};M0,${b.y-1} Q4,${b.y+2} 8,${b.y} Q12,${b.y+2} 16,${b.y-1};M0,${b.y} Q4,${b.y-4} 8,${b.y} Q12,${b.y-4} 16,${b.y}`}
                  dur="0.5s" repeatCount="indefinite" />
              </path>
            </g>
          ))}
        </g>

        {/* ── Fireflies (night/sunset) ── */}
        {(isNight || isSunset) && (
          <g>
            {[{x:45,y:125},{x:120,y:140},{x:200,y:118},{x:280,y:135},{x:350,y:122},{x:160,y:148}].map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r="1.5"
                fill={isNight ? "#FDE68A" : "#FDBA74"}
                className="rs-firefly" style={{ animationDelay: `${i * 0.5}s` }} />
            ))}
          </g>
        )}
      </svg>

      {/* All animations in one style block — GPU optimized */}
      <style>{`
        .rs-scene { will-change: auto; }
        .rs-mode-layer { transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out; }
        .rs-sun-group { animation: rs-sunFloat 6s ease-in-out infinite; }
        .rs-cloud1 { animation: rs-drift 22s linear infinite; }
        .rs-cloud2 { animation: rs-drift 28s linear 8s infinite; }
        .rs-tree { animation: rs-sway 5s ease-in-out infinite; }
        .rs-flower { animation: rs-sway 3.5s ease-in-out infinite; }
        .rs-bird { animation: rs-flyAcross 10s linear infinite; }
        .rs-twinkle { animation: rs-twinkle 3s ease-in-out infinite; }
        .rs-smoke1 { opacity: 0.08; animation: rs-smoke 2.5s ease-out infinite; }
        .rs-smoke2 { opacity: 0.05; animation: rs-smoke 3s ease-out 0.8s infinite; }
        .rs-smoke3 { opacity: 0.03; animation: rs-smoke 3.5s ease-out 1.5s infinite; }
        .rs-firefly { animation: rs-glow 3s ease-in-out infinite; }
        .rs-hiker { animation: rs-walk 2s ease-in-out infinite; }

        @keyframes rs-sunFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes rs-drift {
          from { transform: translateX(420px); }
          to { transform: translateX(-80px); }
        }
        @keyframes rs-sway {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(1.2deg); }
          70% { transform: rotate(-0.8deg); }
        }
        @keyframes rs-flyAcross {
          from { transform: translateX(420px); }
          to { transform: translateX(-30px); }
        }
        @keyframes rs-twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.9; }
        }
        @keyframes rs-smoke {
          0% { opacity: 0.1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(1.6); }
        }
        @keyframes rs-glow {
          0%, 100% { opacity: 0.1; }
          40% { opacity: 0.8; }
          60% { opacity: 0.15; }
          80% { opacity: 0.75; }
        }
        @keyframes rs-walk {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
      `}</style>
    </div>
  );
};

export default RoutesHeroScene;

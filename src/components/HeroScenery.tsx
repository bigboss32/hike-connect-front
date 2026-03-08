/**
 * HeroScenery — Animated mini-landscape for the home hero.
 * Time-of-day + weather + walking hiker with dog + terrain + interactive parallax.
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type TimeSlot = "dawn" | "morning" | "afternoon" | "sunset" | "night";

const getTimeSlot = (): TimeSlot => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
};

/**
 * TrailScene — Single SVG containing hiker, dog, trail details, campfire, tent.
 * Everything shares the same coordinate system so alignment is perfect.
 */
const getWeatherForTime = (time: TimeSlot): "clear" | "cloudy" | "windy" | "rainy" => {
  switch (time) {
    case "dawn": return "clear";      // Amanecer fresco y despejado
    case "morning": return "clear";   // Mañana soleada
    case "afternoon": return "cloudy"; // Tarde algo nublada
    case "sunset": return "windy";    // Atardecer con brisa
    case "night": return "clear";     // Noche estrellada
  }
};

const TrailScene = ({ rainy = false, time = "morning" as TimeSlot }: { rainy?: boolean; time?: TimeSlot }) => {
  const trailColors: Record<TimeSlot, { ground: string; bush: string; bushAlt: string; flower: string }> = {
    dawn: { ground: "hsl(var(--primary))", bush: "#34D399", bushAlt: "#10B981", flower: "#FBBF24" },
    morning: { ground: "hsl(var(--primary))", bush: "#22C55E", bushAlt: "#16A34A", flower: "#F472B6" },
    afternoon: { ground: "#D97706", bush: "#84CC16", bushAlt: "#65A30D", flower: "#FB923C" },
    sunset: { ground: "#EA580C", bush: "#4ADE80", bushAlt: "#22C55E", flower: "#F43F5E" },
    night: { ground: "#6366F1", bush: "#065F46", bushAlt: "#064E3B", flower: "#818CF8" },
  };
  const c = trailColors[time];
  return (
  <svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMax slice" className="w-full h-full" fill="none">
    {/* Ground line */}
    <line x1="10" y1="90" x2="390" y2="90" stroke="currentColor" className="text-primary" strokeWidth="0.8" opacity="0.12" />
    <line x1="20" y1="90" x2="380" y2="90" stroke="currentColor" className="text-primary" strokeWidth="0.4" opacity="0.08" strokeDasharray="4 3" />

    {/* Trail sign at start */}
    <g opacity="0.3">
      <rect x="16" y="55" width="2" height="35" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="17.5" y="58" width="12" height="6" rx="1.5" fill="currentColor" className="text-primary" />
      <polygon points="17.5,58 17.5,64 15,61" fill="currentColor" className="text-primary" />
      <rect x="7" y="67" width="11" height="5" rx="1.5" fill="currentColor" className="text-primary" opacity="0.7" />
    </g>

    {/* Bushes / grass tufts */}
    {[50, 110, 170, 230, 280, 335].map((x, i) => (
      <g key={`bush-${i}`} opacity={0.22 + (i % 2) * 0.08}>
        <ellipse cx={x} cy="87" rx={4 + (i % 2) * 2} ry={3 + (i % 2)} fill="#22C55E" />
        <ellipse cx={x + 6} cy="86" rx={3} ry={2} fill="#16A34A" />
      </g>
    ))}

    {/* Flowers */}
    {[{x:70,c:"#F472B6"},{x:145,c:"#A78BFA"},{x:210,c:"#FB923C"},{x:290,c:"#34D399"},{x:345,c:"#F472B6"}].map((f,i) => (
      <g key={`flower-${i}`} opacity="0.5">
        <line x1={f.x} y1="90" x2={f.x} y2="81" stroke="#22C55E" strokeWidth="0.7" />
        <circle cx={f.x} cy="79.5" r="2.5" fill={f.c} opacity="0.7">
          <animate attributeName="r" values="2.5;3;2.5" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={f.x + 4} cy="81" r="1.8" fill={f.c} opacity="0.5" />
      </g>
    ))}

    {/* Small rocks */}
    {[90, 180, 260, 320].map((x, i) => (
      <ellipse key={`rock-${i}`} cx={x} cy="91.5" rx={3 + i % 2} ry={1.3} fill="currentColor" className="text-muted-foreground" opacity="0.1" />
    ))}

    {/* Footprints — follow hiker */}
    <g opacity="0.06">
      <animateTransform attributeName="transform" type="translate" from="-20,0" to="320,0" dur="14s" repeatCount="indefinite" />
      {[...Array(10)].map((_, i) => (
        <ellipse key={i} cx={-i * 10} cy="91.5" rx="2" ry="0.8" fill="currentColor" className="text-primary" opacity={Math.max(0.2, 1 - i * 0.1)} />
      ))}
    </g>

    {/* ── Dog — runs slightly ahead, feet on ground y=90 ── */}
    <g>
      <animateTransform attributeName="transform" type="translate" from="12,0" to="340,0" dur="14s" repeatCount="indefinite" />
      {/* Shadow */}
      <ellipse cx="12" cy="91" rx="9" ry="1.8" fill="currentColor" className="text-primary" opacity="0.06" />
      {/* Body */}
      <ellipse cx="12" cy="78" rx="9" ry="5.5" fill="currentColor" className="text-primary" opacity="0.6" />
      {/* Head */}
      <circle cx="22" cy="73" r="4.2" fill="currentColor" className="text-primary" opacity="0.65" />
      {/* Snout */}
      <ellipse cx="25.5" cy="74" rx="2.2" ry="1.5" fill="currentColor" className="text-primary" opacity="0.5" />
      {/* Ear */}
      <ellipse cx="23" cy="70" rx="1.8" ry="2.8" fill="currentColor" className="text-primary" opacity="0.45" />
      {/* Eye */}
      <circle cx="23.5" cy="72.5" r="0.8" fill="hsl(var(--background))" opacity="0.7" />
      {/* Tail */}
      <path d="M3,76 Q-1,70 2,67" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M3,76 Q-1,70 2,67;M3,76 Q0,70 4,71;M3,76 Q-1,70 2,67" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Legs */}
      <rect x="17" y="83" width="1.8" height="7" rx="0.7" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="height" values="7;5.5;7" dur="0.4s" repeatCount="indefinite" />
      </rect>
      <rect x="20" y="83" width="1.8" height="7" rx="0.7" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="height" values="5.5;7;5.5" dur="0.4s" repeatCount="indefinite" />
      </rect>
      <rect x="7" y="83" width="1.8" height="7" rx="0.7" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="height" values="7;5.5;7" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="83" width="1.8" height="7" rx="0.7" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="height" values="5.5;7;5.5" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
      </rect>
    </g>

    {/* ── Hiker — feet on ground y=90 ── */}
    <g>
      <animateTransform attributeName="transform" type="translate" from="-8,0" to="325,0" dur="14s" repeatCount="indefinite" />
      {/* Shadow */}
      <ellipse cx="10" cy="91" rx="10" ry="2" fill="currentColor" className="text-primary" opacity="0.06" />
      {/* Head */}
      <circle cx="10" cy="42" r="5" fill="currentColor" className="text-primary" opacity="0.8" />
      {/* Hat */}
      {!rainy && <>
        <ellipse cx="10" cy="38.5" rx="7.5" ry="1.8" fill="currentColor" className="text-primary" opacity="0.6" />
        <path d="M5.5,38.5 Q10,34 14.5,38.5" fill="currentColor" className="text-primary" opacity="0.65" />
      </>}
      {/* Umbrella */}
      {rainy && <>
        <path d="M0,30 Q10,20 20,30" fill="#60A5FA" opacity="0.5" />
        <line x1="10" y1="30" x2="10" y2="42" stroke="currentColor" className="text-primary" strokeWidth="1" opacity="0.4" />
      </>}
      {/* Body */}
      <rect x="7.5" y="47" width="6" height="15" rx="2.5" fill="currentColor" className="text-primary" opacity="0.75" />
      {/* Backpack */}
      <rect x="13.5" y="48" width="5.5" height="12" rx="2" fill="currentColor" className="text-primary" opacity="0.4" />
      {/* Sleeping bag on backpack */}
      <ellipse cx="16.5" cy="47.5" rx="3" ry="1.5" fill="currentColor" className="text-primary" opacity="0.3" />
      {/* Right arm + hiking stick */}
      {!rainy && <>
        <line x1="13.5" y1="50" x2="21" y2="90" stroke="currentColor" className="text-primary" strokeWidth="1" strokeLinecap="round" opacity="0.35">
          <animate attributeName="x2" values="21;19;21" dur="1.2s" repeatCount="indefinite" />
        </line>
        <line x1="13" y1="51" x2="17" y2="60" stroke="currentColor" className="text-primary" strokeWidth="1.8" strokeLinecap="round" opacity="0.55">
          <animate attributeName="x2" values="17;15.5;17" dur="1.2s" repeatCount="indefinite" />
        </line>
      </>}
      {/* Left arm */}
      <line x1="7.5" y1="51" x2="3" y2="60" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Left leg */}
      <rect x="6.5" y="62" width="3.5" height="15" rx="1.5" fill="currentColor" className="text-primary" opacity="0.7">
        <animate attributeName="x" values="6.5;5;6.5" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="8.5" cy="78" rx="3.5" ry="1.5" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="cx" values="8.5;7;8.5" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Right leg */}
      <rect x="10" y="62" width="3.5" height="15" rx="1.5" fill="currentColor" className="text-primary" opacity="0.7">
        <animate attributeName="x" values="10;11.5;10" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="12" cy="78" rx="3.5" ry="1.5" fill="currentColor" className="text-primary" opacity="0.55">
        <animate attributeName="cx" values="12;13.5;12" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
    </g>

    {/* ── Destination: Tent ── */}
    <g opacity="0.35">
      <polygon points="370,90 395,90 382.5,60" fill="currentColor" className="text-primary" />
      <polygon points="382.5,60 377,90 388,90" fill="currentColor" className="text-primary" opacity="0.7" />
      <path d="M380,90 Q382.5,78 385,90" fill="hsl(var(--background))" opacity="0.4" />
      <line x1="382.5" y1="60" x2="382.5" y2="53" stroke="currentColor" className="text-primary" strokeWidth="0.8" />
      <polygon points="382.5,53 382.5,57 389,55" fill="#F59E0B" opacity="0.6">
        <animate attributeName="points" values="382.5,53 382.5,57 389,55;382.5,53 382.5,57 388,56;382.5,53 382.5,57 389,55" dur="2s" repeatCount="indefinite" />
      </polygon>
    </g>

    {/* ── Destination: Campfire ── */}
    <g>
      {/* Stones */}
      {[{x:348,y:88},{x:353,y:89},{x:358,y:89.5},{x:363,y:89},{x:368,y:88}].map((s,i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx="2.5" ry="1.3" fill="currentColor" className="text-muted-foreground" opacity="0.12" />
      ))}
      {/* Logs */}
      <rect x="349" y="86" width="14" height="3" rx="1.2" fill="currentColor" className="text-primary" opacity="0.2" transform="rotate(-8 356 87.5)" />
      <rect x="352" y="85" width="11" height="2.5" rx="1" fill="currentColor" className="text-primary" opacity="0.15" transform="rotate(5 357.5 86)" />
      {/* Flames */}
      <ellipse cx="358" cy="74" rx="5" ry="11" fill="#FBBF24" opacity="0.75">
        <animate attributeName="ry" values="11;12.5;10;11" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="355" cy="73" rx="3.5" ry="8.5" fill="#F97316" opacity="0.55">
        <animate attributeName="ry" values="8.5;9.5;7.5;8.5" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="361" cy="73.5" rx="3" ry="7.5" fill="#EF4444" opacity="0.4">
        <animate attributeName="ry" values="7.5;8.5;6.5;7.5" dur="0.7s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="358" cy="71" rx="2" ry="5" fill="#FDE68A" opacity="0.45">
        <animate attributeName="ry" values="5;6;4.5;5" dur="0.4s" repeatCount="indefinite" />
      </ellipse>
      {/* Sparks */}
      {[{x:355,y:60,d:"0s"},{x:361,y:57,d:"0.5s"},{x:358,y:54,d:"1s"}].map((sp,i) => (
        <circle key={i} cx={sp.x} cy={sp.y} r="1" fill="#FDE68A" opacity="0.5">
          <animate attributeName="cy" values={`${sp.y};${sp.y - 10}`} dur="1.5s" begin={sp.d} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="1.5s" begin={sp.d} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Smoke */}
      <circle cx="357" cy="54" r="2" fill="currentColor" className="text-muted-foreground" opacity="0.08">
        <animate attributeName="cy" values="54;42" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Ground glow */}
      <ellipse cx="358" cy="90" rx="16" ry="4" fill="#FBBF24" opacity="0.05" />
    </g>

    {/* Small trees near destination */}
    {[{x:340,h:18},{x:398,h:14}].map((t,i) => (
      <g key={`tree-${i}`} opacity="0.2">
        <rect x={t.x - 0.6} y={90 - t.h * 0.4} width="1.5" height={t.h * 0.45} rx="0.5" fill="currentColor" className="text-primary" />
        <polygon points={`${t.x},${90 - t.h} ${t.x - 5},${90 - t.h * 0.3} ${t.x + 5},${90 - t.h * 0.3}`} fill="#22C55E" opacity="0.7" />
      </g>
    ))}
  </svg>
  );
};

interface HeroSceneryProps {
  scrollY?: number;
}

const HeroScenery = ({ scrollY = 0 }: HeroSceneryProps) => {
  const time = getTimeSlot();
  const sc = Math.min(scrollY, 400);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const weather = useMemo(() => getWeatherForTime(time), [time]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    el.addEventListener("mousemove", onMouse);
    el.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      el.removeEventListener("mousemove", onMouse);
      el.removeEventListener("touchmove", onTouch);
    };
  }, [handleMove]);

  const px = (depth: number) => (mouse.x - 0.5) * depth * 20;
  const py = (depth: number) => (mouse.y - 0.5) * depth * 12;

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/30 via-amber-200/25 to-sky-200/20 dark:from-rose-900/25 dark:via-amber-900/20 dark:to-sky-900/15",
    morning: "from-amber-200/30 via-sky-300/20 to-emerald-200/20 dark:from-amber-900/20 dark:via-sky-900/15 dark:to-emerald-900/15",
    afternoon: "from-orange-300/25 via-amber-200/20 to-sky-200/15 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-sky-900/10",
    sunset: "from-orange-400/35 via-rose-300/30 to-purple-300/25 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-purple-950/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-emerald-950/25",
  };

  const terrainColor: Record<TimeSlot, string> = {
    dawn: "text-emerald-800/15 dark:text-emerald-400/10",
    morning: "text-emerald-700/12 dark:text-emerald-400/8",
    afternoon: "text-amber-800/10 dark:text-amber-400/8",
    sunset: "text-orange-900/15 dark:text-orange-400/10",
    night: "text-indigo-900/12 dark:text-indigo-400/8",
  };

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto z-0">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} style={{ transform: `translateY(${sc * 0.04}px)` }} />

      {/* Distant mountain silhouettes */}
      <div className="absolute bottom-[8%] left-0 right-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.05)}px, ${py(0.03) + sc * -0.04}px)` }}>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={`w-full h-10 ${terrainColor[time]}`} fill="currentColor" opacity="0.3">
          <path d="M0,40 L40,25 L80,32 L130,12 L170,28 L220,8 L260,22 L310,15 L350,30 L400,18 L400,40Z" />
        </svg>
      </div>

      {/* Rolling hills */}
      <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.08)}px, ${py(0.05) + sc * -0.01}px)` }}>
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={`w-full h-16 ${terrainColor[time]}`} fill="currentColor">
          <path d="M0,40 Q50,15 100,35 Q150,50 200,30 Q250,10 300,35 Q350,50 400,25 L400,60 L0,60Z" opacity="0.6" />
          <path d="M0,45 Q60,30 120,42 Q180,55 240,38 Q300,20 360,40 Q380,48 400,35 L400,60 L0,60Z" opacity="0.4" />
        </svg>
      </div>

      {/* Scattered trees */}
      <div className="absolute bottom-[4%] left-0 right-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.12)}px, ${py(0.08) + sc * -0.02}px)` }}>
        {[
          { x: "8%", h: 18, delay: "0s" },
          { x: "22%", h: 14, delay: "0.5s" },
          { x: "38%", h: 20, delay: "1s" },
          { x: "68%", h: 16, delay: "0.3s" },
          { x: "85%", h: 22, delay: "0.8s" },
        ].map((tree, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: tree.x }}>
            <svg width="10" height={tree.h} viewBox={`0 0 12 ${tree.h + 2}`} className="text-primary" opacity="0.2">
              <rect x="5" y={tree.h * 0.5} width="2" height={tree.h * 0.5} fill="currentColor" rx="1" />
              <path d={`M6,0 L0,${tree.h * 0.6} L12,${tree.h * 0.6}Z`} fill="currentColor" style={{ animation: `treeBreeze 4s ease-in-out ${tree.delay} infinite` }} />
            </svg>
          </div>
        ))}
      </div>

      {/* Trail Scene — hiker, dog, campfire — subtle, behind fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 z-[1] opacity-40">
        <TrailScene rainy={weather === "rainy"} time={time} />
      </div>

      {/* === DAWN === */}
      {time === "dawn" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.1) + sc * -0.08}px)` }}>
          <div className="absolute bottom-[55%] right-[20%]" style={{ animation: "dawnRise 4s ease-out forwards" }}>
            <svg width="34" height="34" viewBox="0 0 30 30">
              <defs><radialGradient id="dawnSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="15" cy="15" r="15" fill="url(#dawnSun)" /><circle cx="15" cy="15" r="7" fill="#FBBF24" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line key={angle} x1="15" y1="15" x2={15 + Math.cos(angle * Math.PI / 180) * 14} y2={15 + Math.sin(angle * Math.PI / 180) * 14}
                  stroke="#FBBF24" strokeWidth="0.5" opacity="0.4" style={{ animation: `sunRayPulse 3s ease-in-out ${angle / 360}s infinite` }} />
              ))}
            </svg>
          </div>
          {[{ x: "10%", y: "75%", w: 80 }, { x: "40%", y: "80%", w: 60 }, { x: "70%", y: "72%", w: 90 }].map((m, i) => (
            <div key={i} className="absolute" style={{ left: m.x, top: m.y, animation: `mistDrift ${6 + i * 2}s ease-in-out ${i}s infinite` }}>
              <svg width={m.w} height="8" viewBox={`0 0 ${m.w} 8`} opacity="0.15">
                <ellipse cx={m.w / 2} cy="4" rx={m.w / 2} ry="3" fill="white" />
              </svg>
            </div>
          ))}
          {[{ x: "15%", y: "85%", d: "0s" }, { x: "35%", y: "88%", d: "0.8s" }, { x: "55%", y: "83%", d: "0.4s" }, { x: "75%", y: "87%", d: "1.2s" }].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white/80" style={{ left: d.x, top: d.y, animation: `dewSparkle 3s ease-in-out ${d.d} infinite` }} />
          ))}
        </div>
      )}

      {/* === MORNING === */}
      {time === "morning" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "10%", right: "12%", transform: `translate(${px(0.12)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <defs><radialGradient id="mornSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="18" cy="18" r="18" fill="url(#mornSun)" /><circle cx="18" cy="18" r="8" fill="#FBBF24" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <line key={a} x1="18" y1="18" x2={18 + Math.cos(a * Math.PI / 180) * 16} y2={18 + Math.sin(a * Math.PI / 180) * 16}
                  stroke="#FBBF24" strokeWidth="0.6" opacity="0.3" style={{ animation: `sunRayPulse 4s ease-in-out ${a / 360}s infinite` }} />
              ))}
            </svg>
          </div>
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ y: "18%", dur: "7s", delay: "0s", size: 10 }, { y: "28%", dur: "9s", delay: "3s", size: 8 }, { y: "14%", dur: "11s", delay: "5s", size: 7 }].map((b, i) => (
              <div key={i} className="absolute" style={{ top: b.y, animation: `heroBirdFly ${b.dur} linear ${b.delay} infinite` }}>
                <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/30">
                  <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}>
            {[{ x: "20%", y: "35%", color: "#F59E0B", dur: "6s" }, { x: "65%", y: "30%", color: "#A78BFA", dur: "7s" }, { x: "45%", y: "42%", color: "#34D399", dur: "8s" }].map((bf, i) => (
              <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur} ease-in-out ${i}s infinite` }}>
                <svg width="10" height="7" viewBox="0 0 14 10" opacity="0.6">
                  <ellipse cx="4" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="10" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                </svg>
              </div>
            ))}
          </div>
          {[{ x: "30%", dur: "8s", delay: "0s" }, { x: "60%", dur: "10s", delay: "3s" }, { x: "80%", dur: "7s", delay: "1s" }].map((l, i) => (
            <div key={i} className="absolute" style={{ left: l.x, animation: `leafFall ${l.dur} ease-in-out ${l.delay} infinite` }}>
              <svg width="8" height="6" viewBox="0 0 10 8" opacity="0.3">
                <ellipse cx="5" cy="4" rx="4" ry="2" fill="#22C55E" transform="rotate(-30 5 4)" />
                <line x1="2" y1="5" x2="8" y2="3" stroke="#16A34A" strokeWidth="0.5" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* === AFTERNOON === */}
      {time === "afternoon" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "6%", right: "18%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="36" height="36" viewBox="0 0 32 32">
              <defs><radialGradient id="aftSun"><stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8" /><stop offset="60%" stopColor="#F97316" stopOpacity="0.4" /><stop offset="100%" stopColor="#F97316" stopOpacity="0" /></radialGradient></defs>
              <circle cx="16" cy="16" r="16" fill="url(#aftSun)" /><circle cx="16" cy="16" r="7" fill="#FB923C" />
            </svg>
          </div>
          {[{ y: "65%", delay: "0s" }, { y: "70%", delay: "1s" }, { y: "75%", delay: "2s" }].map((h, i) => (
            <div key={i} className="absolute left-[10%] right-[10%]" style={{ top: h.y, animation: `heatShimmer 3s ease-in-out ${h.delay} infinite` }}>
              <svg width="100%" height="3" viewBox="0 0 300 3" preserveAspectRatio="none" opacity="0.08">
                <path d="M0,1.5 Q50,0 100,1.5 Q150,3 200,1.5 Q250,0 300,1.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </svg>
            </div>
          ))}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ x: "18%", y: "25%", dur: "5s", delay: "0s" }, { x: "60%", y: "20%", dur: "6s", delay: "2s" }, { x: "40%", y: "35%", dur: "7s", delay: "1s" }].map((df, i) => (
              <div key={i} className="absolute" style={{ left: df.x, top: df.y, animation: `dragonflyDart ${df.dur} ease-in-out ${df.delay} infinite` }}>
                <svg width="12" height="8" viewBox="0 0 16 10" opacity="0.5">
                  <line x1="3" y1="5" x2="13" y2="5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="5" cy="3" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5"><animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="5" cy="7" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5"><animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" /></ellipse>
                  <circle cx="14" cy="5" r="1.5" fill="#3B82F6" />
                </svg>
              </div>
            ))}
          </div>
          {[{ x: "15%", y: "50%", dur: "5s" }, { x: "50%", y: "45%", dur: "7s" }, { x: "78%", y: "55%", dur: "6s" }].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-300/30" style={{ left: d.x, top: d.y, animation: `dustFloat ${d.dur} ease-in-out ${i}s infinite` }} />
          ))}
        </>
      )}

      {/* === SUNSET === */}
      {time === "sunset" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ bottom: "55%", left: "15%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunsetSink 10s ease-in forwards" }}>
            <svg width="48" height="48" viewBox="0 0 42 42">
              <defs><radialGradient id="setSun"><stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" /><stop offset="40%" stopColor="#F97316" stopOpacity="0.6" /><stop offset="100%" stopColor="#DC2626" stopOpacity="0" /></radialGradient></defs>
              <circle cx="21" cy="21" r="21" fill="url(#setSun)" /><circle cx="21" cy="21" r="10" fill="#FB923C" />
            </svg>
          </div>
          <div className="absolute bottom-[15%] left-0 right-0 h-20 bg-gradient-to-t from-orange-400/20 via-rose-400/10 to-transparent dark:from-orange-800/15 dark:via-rose-800/8" />
          <div className="absolute transition-transform duration-200 ease-out" style={{ top: "18%", transform: `translate(${px(0.2)}px, ${py(0.1)}px)`, animation: "heroBirdFly 12s linear 1s infinite reverse" }}>
            <svg width="30" height="12" viewBox="0 0 50 18" className="text-foreground/30">
              <path d="M0,10 Q6,3 12,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10,12 Q16,5 22,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M20,8 Q26,1 32,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M28,14 Q34,7 40,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,10 Q42,3 48,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          {[{ x: "20%", dur: "4s" }, { x: "45%", dur: "5s" }, { x: "70%", dur: "3.5s" }, { x: "85%", dur: "6s" }].map((e, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-orange-400/40" style={{ left: e.x, animation: `emberRise ${e.dur} ease-out ${i * 0.8}s infinite` }} />
          ))}
        </>
      )}

      {/* === NIGHT === */}
      {time === "night" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "8%", right: "14%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 8s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 28 28">
              <defs><radialGradient id="heroMoon"><stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.5" /><stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" /></radialGradient></defs>
              <circle cx="14" cy="14" r="14" fill="url(#heroMoon)" /><circle cx="14" cy="14" r="9" fill="#E0E7FF" /><circle cx="17" cy="12" r="7" fill="hsl(var(--background))" opacity="0.7" />
            </svg>
          </div>
          {[
            { x: "8%", y: "8%", s: 2, d: "0s" }, { x: "22%", y: "15%", s: 1.5, d: "0.5s" },
            { x: "35%", y: "6%", s: 2.5, d: "1s" }, { x: "55%", y: "12%", s: 2, d: "1.5s" },
            { x: "75%", y: "5%", s: 2, d: "0.3s" }, { x: "88%", y: "18%", s: 1.5, d: "0.8s" },
            { x: "15%", y: "25%", s: 1, d: "2s" }, { x: "45%", y: "22%", s: 1.5, d: "0.2s" },
            { x: "65%", y: "28%", s: 1, d: "1.2s" }, { x: "92%", y: "10%", s: 2, d: "0.6s" },
          ].map((st, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ left: st.x, top: st.y, width: st.s, height: st.s, animation: `twinkle 2.5s ease-in-out ${st.d} infinite` }} />
          ))}
          <div className="absolute" style={{ animation: "shootingStar 8s ease-in 2s infinite" }}>
            <svg width="20" height="2" viewBox="0 0 20 2">
              <line x1="0" y1="1" x2="20" y2="1" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <circle cx="20" cy="1" r="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          <div className="absolute inset-0 transition-transform duration-150 ease-out" style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}>
            {[
              { x: "15%", y: "55%", dur: "4s", delay: "0s" }, { x: "45%", y: "50%", dur: "5s", delay: "1s" },
              { x: "75%", y: "58%", dur: "4.5s", delay: "2s" }, { x: "60%", y: "45%", dur: "5.5s", delay: "1.5s" },
              { x: "30%", y: "62%", dur: "3.5s", delay: "0.5s" }, { x: "85%", y: "42%", dur: "6s", delay: "2.5s" },
            ].map((f, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ left: f.x, top: f.y, background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite` }} />
            ))}
          </div>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "38%", left: "82%", transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            <svg width="10" height="12" viewBox="0 0 14 18" className="text-foreground/15">
              <ellipse cx="7" cy="7" rx="6" ry="7" fill="currentColor" /><ellipse cx="7" cy="14" rx="5" ry="4" fill="currentColor" />
              <circle cx="5" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
              <circle cx="9" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
            </svg>
          </div>
          <div className="absolute top-0 left-[10%] right-[10%] h-[40%] opacity-[0.06]" style={{ animation: "auroraShift 12s ease-in-out infinite" }}>
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs><linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#22C55E" /><stop offset="50%" stopColor="#818CF8" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient></defs>
              <path d="M0,80 Q75,20 150,60 Q225,100 300,40" fill="none" stroke="url(#aurora)" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* === WEATHER: Clouds === */}
      {weather === "cloudy" && time !== "night" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.08)}px)` }}>
          {[
            { top: "12%", opacity: 0.4, dur: "18s", delay: "0s", w: 60 },
            { top: "28%", opacity: 0.25, dur: "25s", delay: "6s", w: 45 },
            { top: "20%", opacity: 0.15, dur: "22s", delay: "10s", w: 35 },
          ].map((c, i) => (
            <div key={i} className="absolute" style={{ top: c.top, opacity: c.opacity, animation: `heroCloudDrift ${c.dur} linear ${c.delay} infinite` }}>
              <svg width={c.w} height={c.w * 0.35} viewBox={`0 0 ${c.w} ${c.w * 0.35}`} className="text-white dark:text-white/30">
                <ellipse cx={c.w / 2} cy={c.w * 0.25} rx={c.w * 0.47} ry={c.w * 0.12} fill="currentColor" />
                <ellipse cx={c.w * 0.33} cy={c.w * 0.17} rx={c.w * 0.23} ry={c.w * 0.15} fill="currentColor" />
                <ellipse cx={c.w * 0.63} cy={c.w * 0.15} rx={c.w * 0.2} ry={c.w * 0.13} fill="currentColor" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === WEATHER: Wind === */}
      {weather === "windy" && (
        <div className="absolute inset-0">
          {[{ y: "30%", dur: "3s", delay: "0s" }, { y: "45%", dur: "4s", delay: "1.5s" }, { y: "60%", dur: "3.5s", delay: "0.8s" }].map((w, i) => (
            <div key={i} className="absolute" style={{ top: w.y, animation: `windStreak ${w.dur} linear ${w.delay} infinite` }}>
              <svg width="40" height="3" viewBox="0 0 40 3" className="text-foreground/10">
                <path d="M0,1.5 Q10,0 20,1.5 Q30,3 40,1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          ))}
          {[{ y: "35%", dur: "4s", delay: "0s" }, { y: "50%", dur: "3s", delay: "2s" }].map((l, i) => (
            <div key={i} className="absolute" style={{ top: l.y, animation: `windStreak ${l.dur} linear ${l.delay} infinite` }}>
              <svg width="6" height="4" viewBox="0 0 8 6" opacity="0.3">
                <ellipse cx="4" cy="3" rx="3" ry="1.5" fill="#22C55E" style={{ animation: "leafSpin 0.5s linear infinite" }} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === WEATHER: Rain === */}
      {weather === "rainy" && (
        <>
          <div className="absolute inset-0" style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            {[
              { top: "5%", opacity: 0.35, dur: "20s", delay: "0s", w: 70 },
              { top: "8%", opacity: 0.25, dur: "28s", delay: "8s", w: 55 },
              { top: "3%", opacity: 0.2, dur: "24s", delay: "4s", w: 50 },
            ].map((c, i) => (
              <div key={i} className="absolute" style={{ top: c.top, opacity: c.opacity, animation: `heroCloudDrift ${c.dur} linear ${c.delay} infinite` }}>
                <svg width={c.w} height={c.w * 0.35} viewBox={`0 0 ${c.w} ${c.w * 0.35}`} className="text-slate-400 dark:text-slate-500/40">
                  <ellipse cx={c.w / 2} cy={c.w * 0.25} rx={c.w * 0.47} ry={c.w * 0.12} fill="currentColor" />
                  <ellipse cx={c.w * 0.33} cy={c.w * 0.17} rx={c.w * 0.23} ry={c.w * 0.15} fill="currentColor" />
                  <ellipse cx={c.w * 0.63} cy={c.w * 0.15} rx={c.w * 0.2} ry={c.w * 0.13} fill="currentColor" />
                </svg>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const x = `${(i * 3.3 + Math.random() * 2) % 100}%`;
              const dur = 0.6 + Math.random() * 0.4;
              const delay = Math.random() * 2;
              return (
                <div key={i} className="absolute w-[1px] h-3 bg-gradient-to-b from-transparent via-sky-300/40 to-sky-400/20 dark:via-sky-400/25 dark:to-sky-500/15"
                  style={{ left: x, animation: `rainFall ${dur}s linear ${delay}s infinite` }} />
              );
            })}
          </div>
          {[{ x: "15%", delay: "0s" }, { x: "45%", delay: "0.8s" }, { x: "72%", delay: "1.5s" }].map((r, i) => (
            <div key={i} className="absolute bottom-[4%]" style={{ left: r.x }}>
              <svg width="12" height="4" viewBox="0 0 16 6" opacity="0.2">
                <ellipse cx="8" cy="3" rx="7" ry="2.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-300 dark:text-sky-400">
                  <animate attributeName="rx" values="2;7;2" dur="2s" begin={r.delay} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin={r.delay} repeatCount="indefinite" />
                </ellipse>
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.2)}px, ${py(0.15)}px)` }}>
        {[
          { x: "10%", dur: "6s", delay: "0s", size: 3 },
          { x: "25%", dur: "8s", delay: "1s", size: 2 },
          { x: "42%", dur: "7s", delay: "2.5s", size: 2.5 },
          { x: "58%", dur: "9s", delay: "0.5s", size: 2 },
          { x: "72%", dur: "6.5s", delay: "3s", size: 3 },
          { x: "88%", dur: "7.5s", delay: "1.5s", size: 2 },
        ].map((p, i) => (
          <div key={i} className={`absolute rounded-full ${
            time === "night" ? "bg-indigo-300/30" :
            time === "sunset" ? "bg-orange-300/25" :
            time === "dawn" ? "bg-rose-300/25" :
            "bg-primary/15"
          }`} style={{ left: p.x, width: p.size, height: p.size, animation: `particleDrift ${p.dur} ease-in-out ${p.delay} infinite` }} />
        ))}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />

      <style>{`
        @keyframes sunFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes fireflyFloat { 0% { transform: translate(0, 0); } 25% { transform: translate(8px, -6px); } 50% { transform: translate(-4px, -10px); } 75% { transform: translate(6px, -3px); } 100% { transform: translate(0, 0); } }
        @keyframes fireflyGlow { 0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #FBBF24; } 50% { opacity: 1; box-shadow: 0 0 10px 3px #FBBF24; } }
        @keyframes heroCloudDrift { 0% { transform: translateX(-80px); } 100% { transform: translateX(calc(100vw + 80px)); } }
        @keyframes heroBirdFly { 0% { left: -5%; } 100% { left: 105%; } }
        @keyframes butterflyFloat { 0% { transform: translate(0,0); } 25% { transform: translate(10px,-12px) rotate(6deg); } 50% { transform: translate(-6px,-20px) rotate(-4deg); } 75% { transform: translate(12px,-8px) rotate(8deg); } 100% { transform: translate(0,0); } }
        @keyframes dragonflyDart { 0%,100% { transform: translate(0,0); } 20% { transform: translate(15px,-8px); } 40% { transform: translate(-10px,5px); } 60% { transform: translate(20px,-3px); } 80% { transform: translate(-5px,8px); } }
        @keyframes dawnRise { 0% { transform: translateY(20px); opacity: 0.3; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes dewSparkle { 0%,100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes sunsetSink { 0% { transform: translateY(0); } 100% { transform: translateY(8px); opacity: 0.7; } }
        @keyframes windStreak { 0% { left: -10%; opacity: 0; } 20% { opacity: 0.4; } 80% { opacity: 0.4; } 100% { left: 110%; opacity: 0; } }
        @keyframes particleDrift { 0% { top: 15%; opacity: 0; } 15% { opacity: 0.6; } 85% { opacity: 0.4; } 100% { top: 95%; opacity: 0; } }
        @keyframes treeBreeze { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2deg); } }
        @keyframes sunRayPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes mistDrift { 0%, 100% { transform: translateX(0); opacity: 0.15; } 50% { transform: translateX(15px); opacity: 0.25; } }
        @keyframes leafFall { 0% { top: 10%; opacity: 0; transform: rotate(0deg); } 20% { opacity: 0.4; } 80% { opacity: 0.3; } 100% { top: 90%; opacity: 0; transform: rotate(360deg); } }
        @keyframes heatShimmer { 0%, 100% { transform: scaleX(1); opacity: 0.08; } 50% { transform: scaleX(1.02); opacity: 0.15; } }
        @keyframes dustFloat { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.4; } 50% { transform: translate(10px, -15px); opacity: 0.3; } 100% { transform: translate(-5px, -30px); opacity: 0; } }
        @keyframes emberRise { 0% { bottom: 5%; opacity: 0; } 20% { opacity: 0.6; } 100% { bottom: 60%; opacity: 0; transform: translateX(10px); } }
        @keyframes shootingStar { 0% { top: 5%; left: 80%; opacity: 0; } 2% { opacity: 0.9; } 5% { top: 20%; left: 40%; opacity: 0; } 100% { top: 20%; left: 40%; opacity: 0; } }
        @keyframes auroraShift { 0%, 100% { transform: translateX(0); opacity: 0.06; } 50% { transform: translateX(20px); opacity: 0.1; } }
        @keyframes leafSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes rainFall { 0% { top: -3%; opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }
      `}</style>
    </div>
  );
};

export default HeroScenery;
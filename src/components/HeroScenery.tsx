/**
 * HeroScenery — Animated mini-landscape for the home hero.
 * Time-of-day + weather + walking hiker + terrain + interactive parallax.
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

/* ── Walking Hiker SVG ── */
const WalkingHiker = () => (
  <svg width="18" height="24" viewBox="0 0 20 28" fill="none" className="text-primary">
    <circle cx="10" cy="4.5" r="3" fill="currentColor" opacity="0.9" />
    <ellipse cx="10" cy="2.8" rx="4.5" ry="1" fill="currentColor" opacity="0.7" />
    <path d="M7 2.8 Q10 -0.5 13 2.8" fill="currentColor" opacity="0.8" />
    <rect x="8.5" y="7.5" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
    <rect x="5.5" y="7.5" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.45" />
    <g style={{ transformOrigin: "13px 8px", animation: "stickSwing 1.2s ease-in-out infinite" }}>
      <line x1="13" y1="8" x2="17" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <line x1="11.5" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    </g>
    <g style={{ transformOrigin: "9.5px 15px", animation: "legSwing 0.8s ease-in-out infinite" }}>
      <rect x="8" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
      <ellipse cx="9.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
    </g>
    <g style={{ transformOrigin: "11px 15px", animation: "legSwing 0.8s ease-in-out 0.4s infinite" }}>
      <rect x="10" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
      <ellipse cx="11.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
    </g>
  </svg>
);

/* ── Campfire SVG ── */
const Campfire = () => (
  <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
    <rect x="3" y="16" width="10" height="2" rx="1" fill="currentColor" className="text-primary" opacity="0.3" />
    <path d="M8 5 Q10 8 9 11 Q8.5 13 8 14 Q7.5 13 7 11 Q6 8 8 5Z" fill="#F59E0B" opacity="0.85" style={{ animation: "fireFlicker 0.6s ease-in-out infinite alternate" }} />
    <path d="M8 7 Q9 9.5 8.5 12 Q8.2 13 8 13.2 Q7.8 13 7.5 12 Q7 9.5 8 7Z" fill="#EF4444" opacity="0.55" style={{ animation: "fireFlicker 0.6s ease-in-out 0.15s infinite alternate" }} />
    <circle cx="7.5" cy="3.5" r="1" fill="currentColor" className="text-muted-foreground" opacity="0.15" style={{ animation: "smokeRise 2s ease-out infinite" }} />
    <circle cx="8.5" cy="2" r="0.7" fill="currentColor" className="text-muted-foreground" opacity="0.1" style={{ animation: "smokeRise 2.5s ease-out 0.5s infinite" }} />
  </svg>
);

const HeroScenery = () => {
  const time = getTimeSlot();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const weather = useMemo(() => {
    const opts = ["clear", "cloudy", "windy", "rainy"] as const;
    return opts[Math.floor(Math.random() * opts.length)];
  }, []);

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
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} />

      {/* === Rolling hills / terrain at bottom === */}
      <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.08)}px, ${py(0.05)}px)` }}>
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className={`w-full h-16 ${terrainColor[time]}`} fill="currentColor">
          <path d="M0,40 Q50,15 100,35 Q150,50 200,30 Q250,10 300,35 Q350,50 400,25 L400,60 L0,60Z" opacity="0.6" />
          <path d="M0,45 Q60,30 120,42 Q180,55 240,38 Q300,20 360,40 Q380,48 400,35 L400,60 L0,60Z" opacity="0.4" />
        </svg>
      </div>

      {/* === Distant mountain silhouettes === */}
      <div className="absolute bottom-[8%] left-0 right-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.05)}px, ${py(0.03)}px)` }}>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={`w-full h-10 ${terrainColor[time]}`} fill="currentColor" opacity="0.3">
          <path d="M0,40 L40,25 L80,32 L130,12 L170,28 L220,8 L260,22 L310,15 L350,30 L400,18 L400,40Z" />
        </svg>
      </div>

      {/* === Scattered trees === */}
      <div className="absolute bottom-[4%] left-0 right-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.12)}px, ${py(0.08)}px)` }}>
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

      {/* === Walking Hiker + Footprints + Campfire === */}
      <div className="absolute bottom-[3%] left-0 right-0 h-8">
        {/* Trail / ground line */}
        <div className="absolute bottom-1 left-[5%] right-[5%] h-[1.5px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        {/* Footprints trailing */}
        <div className="absolute bottom-[5px] left-0 right-0 flex gap-3 opacity-10" style={{ animation: "hikerWalk 12s linear infinite" }}>
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.05 }} />
          ))}
        </div>

        {/* Hiker walking */}
        <div className="absolute bottom-[3px]" style={{ animation: "hikerWalk 12s linear infinite" }}>
          <WalkingHiker />
        </div>

        {/* Campfire at destination */}
        <div className="absolute bottom-[3px] right-[8%]">
          <Campfire />
        </div>
      </div>

      {/* === DAWN === */}
      {time === "dawn" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.1)}px)` }}>
          <div className="absolute bottom-[55%] right-[20%]" style={{ animation: "dawnRise 4s ease-out forwards" }}>
            <svg width="34" height="34" viewBox="0 0 30 30">
              <defs><radialGradient id="dawnSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="15" cy="15" r="15" fill="url(#dawnSun)" /><circle cx="15" cy="15" r="7" fill="#FBBF24" />
              {/* Sun rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line key={angle} x1="15" y1="15" x2={15 + Math.cos(angle * Math.PI / 180) * 14} y2={15 + Math.sin(angle * Math.PI / 180) * 14}
                  stroke="#FBBF24" strokeWidth="0.5" opacity="0.4" style={{ animation: `sunRayPulse 3s ease-in-out ${angle / 360}s infinite` }} />
              ))}
            </svg>
          </div>
          {/* Morning mist wisps */}
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
          {/* Birds */}
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
          {/* Butterflies */}
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
          {/* Floating leaves */}
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
          {/* Heat shimmer lines */}
          {[{ y: "65%", delay: "0s" }, { y: "70%", delay: "1s" }, { y: "75%", delay: "2s" }].map((h, i) => (
            <div key={i} className="absolute left-[10%] right-[10%]" style={{ top: h.y, animation: `heatShimmer 3s ease-in-out ${h.delay} infinite` }}>
              <svg width="100%" height="3" viewBox="0 0 300 3" preserveAspectRatio="none" opacity="0.08">
                <path d="M0,1.5 Q50,0 100,1.5 Q150,3 200,1.5 Q250,0 300,1.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </svg>
            </div>
          ))}
          {/* Dragonflies */}
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
          {/* Dust motes */}
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
              <defs>
                <radialGradient id="setSun"><stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" /><stop offset="40%" stopColor="#F97316" stopOpacity="0.6" /><stop offset="100%" stopColor="#DC2626" stopOpacity="0" /></radialGradient>
              </defs>
              <circle cx="21" cy="21" r="21" fill="url(#setSun)" /><circle cx="21" cy="21" r="10" fill="#FB923C" />
            </svg>
          </div>
          {/* Horizon glow */}
          <div className="absolute bottom-[15%] left-0 right-0 h-20 bg-gradient-to-t from-orange-400/20 via-rose-400/10 to-transparent dark:from-orange-800/15 dark:via-rose-800/8" />
          {/* Bird flock */}
          <div className="absolute transition-transform duration-200 ease-out" style={{ top: "18%", transform: `translate(${px(0.2)}px, ${py(0.1)}px)`, animation: "heroBirdFly 12s linear 1s infinite reverse" }}>
            <svg width="30" height="12" viewBox="0 0 50 18" className="text-foreground/30">
              <path d="M0,10 Q6,3 12,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10,12 Q16,5 22,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M20,8 Q26,1 32,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M28,14 Q34,7 40,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,10 Q42,3 48,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          {/* Second bird group */}
          <div className="absolute" style={{ top: "25%", animation: "heroBirdFly 16s linear 4s infinite reverse" }}>
            <svg width="20" height="8" viewBox="0 0 30 12" className="text-foreground/20">
              <path d="M0,7 Q4,2 8,6" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M6,8 Q10,3 14,7" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M12,6 Q16,1 20,5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          {/* Floating embers */}
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
          {/* Stars — more and with shooting star */}
          {[
            { x: "8%", y: "8%", s: 2, d: "0s" }, { x: "22%", y: "15%", s: 1.5, d: "0.5s" },
            { x: "35%", y: "6%", s: 2.5, d: "1s" }, { x: "55%", y: "12%", s: 2, d: "1.5s" },
            { x: "75%", y: "5%", s: 2, d: "0.3s" }, { x: "88%", y: "18%", s: 1.5, d: "0.8s" },
            { x: "15%", y: "25%", s: 1, d: "2s" }, { x: "45%", y: "22%", s: 1.5, d: "0.2s" },
            { x: "65%", y: "28%", s: 1, d: "1.2s" }, { x: "92%", y: "10%", s: 2, d: "0.6s" },
          ].map((st, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ left: st.x, top: st.y, width: st.s, height: st.s, animation: `twinkle 2.5s ease-in-out ${st.d} infinite` }} />
          ))}
          {/* Shooting star */}
          <div className="absolute" style={{ animation: "shootingStar 8s ease-in 2s infinite" }}>
            <svg width="20" height="2" viewBox="0 0 20 2">
              <line x1="0" y1="1" x2="20" y2="1" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <circle cx="20" cy="1" r="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          {/* Fireflies */}
          <div className="absolute inset-0 transition-transform duration-150 ease-out" style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}>
            {[
              { x: "15%", y: "55%", dur: "4s", delay: "0s" }, { x: "45%", y: "50%", dur: "5s", delay: "1s" },
              { x: "75%", y: "58%", dur: "4.5s", delay: "2s" }, { x: "60%", y: "45%", dur: "5.5s", delay: "1.5s" },
              { x: "30%", y: "62%", dur: "3.5s", delay: "0.5s" }, { x: "85%", y: "42%", dur: "6s", delay: "2.5s" },
            ].map((f, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ left: f.x, top: f.y, background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite` }} />
            ))}
          </div>
          {/* Owl */}
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "38%", left: "82%", transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            <svg width="10" height="12" viewBox="0 0 14 18" className="text-foreground/15">
              <ellipse cx="7" cy="7" rx="6" ry="7" fill="currentColor" /><ellipse cx="7" cy="14" rx="5" ry="4" fill="currentColor" />
              <circle cx="5" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
              <circle cx="9" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
            </svg>
          </div>
          {/* Northern lights subtle */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[40%] opacity-[0.06]" style={{ animation: "auroraShift 12s ease-in-out infinite" }}>
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22C55E" /><stop offset="50%" stopColor="#818CF8" /><stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
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
          {/* Leaves blowing in wind */}
          {[{ y: "35%", dur: "4s", delay: "0s" }, { y: "50%", dur: "3s", delay: "2s" }].map((l, i) => (
            <div key={i} className="absolute" style={{ top: l.y, animation: `windStreak ${l.dur} linear ${l.delay} infinite` }}>
              <svg width="6" height="4" viewBox="0 0 8 6" opacity="0.3">
                <ellipse cx="4" cy="3" rx="3" ry="1.5" fill="#22C55E" style={{ animation: `leafSpin 0.5s linear infinite` }} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === WEATHER: Rain === */}
      {weather === "rainy" && (
        <>
          {/* Rain clouds */}
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
          {/* Raindrops */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const x = `${(i * 3.3 + Math.random() * 2) % 100}%`;
              const dur = 0.6 + Math.random() * 0.4;
              const delay = Math.random() * 2;
              return (
                <div
                  key={i}
                  className="absolute w-[1px] h-3 bg-gradient-to-b from-transparent via-sky-300/40 to-sky-400/20 dark:via-sky-400/25 dark:to-sky-500/15"
                  style={{
                    left: x,
                    animation: `rainFall ${dur}s linear ${delay}s infinite`,
                  }}
                />
              );
            })}
          </div>
          {/* Puddle ripples at bottom */}
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

      {/* Floating particles — drift downward */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.2)}px, ${py(0.15)}px)` }}>
        {[
          { x: "10%", dur: "6s", delay: "0s", size: 3 },
          { x: "25%", dur: "8s", delay: "1s", size: 2 },
          { x: "42%", dur: "7s", delay: "2.5s", size: 2.5 },
          { x: "58%", dur: "9s", delay: "0.5s", size: 2 },
          { x: "72%", dur: "6.5s", delay: "3s", size: 3 },
          { x: "88%", dur: "7.5s", delay: "1.5s", size: 2 },
          { x: "5%", dur: "10s", delay: "4s", size: 1.5 },
          { x: "95%", dur: "8.5s", delay: "2s", size: 2 },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              time === "night" ? "bg-indigo-300/30" :
              time === "sunset" ? "bg-orange-300/25" :
              time === "dawn" ? "bg-rose-300/25" :
              "bg-primary/15"
            }`}
            style={{
              left: p.x,
              width: p.size,
              height: p.size,
              animation: `particleDrift ${p.dur} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Soft bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />

      {/* Keyframes */}
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
        @keyframes hikerWalk { 0% { left: -5%; } 100% { left: 88%; } }
        @keyframes legSwing { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
        @keyframes stickSwing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes fireFlicker { 0% { transform: scaleY(1) scaleX(1); } 100% { transform: scaleY(1.15) scaleX(0.9); } }
        @keyframes smokeRise { 0% { transform: translateY(0); opacity: 0.15; } 100% { transform: translateY(-8px); opacity: 0; } }
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
      `}</style>
    </div>
  );
};

export default HeroScenery;

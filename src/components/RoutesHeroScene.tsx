/**
 * RoutesHeroScene — Polished animated SVG landscape for the Experiencias page.
 * Time-of-day sky, interactive parallax, layered mountains, detailed trees,
 * wildlife, weather effects, and a winding trail with a walking hiker.
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

/* ── Mini Walking Hiker ── */
const TrailHiker = () => (
  <svg width="12" height="16" viewBox="0 0 14 20" fill="none" className="text-primary">
    <circle cx="7" cy="3.5" r="2.5" fill="currentColor" opacity="0.9" />
    <ellipse cx="7" cy="2" rx="3.5" ry="0.8" fill="currentColor" opacity="0.7" />
    <path d="M5 2 Q7 -0.5 9 2" fill="currentColor" opacity="0.8" />
    <rect x="5.8" y="6" width="2.4" height="6" rx="1.2" fill="currentColor" opacity="0.85" />
    <g style={{ transformOrigin: "6.5px 12px", animation: "legSwing 0.8s ease-in-out infinite" }}>
      <rect x="5.5" y="12" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8" />
    </g>
    <g style={{ transformOrigin: "7.5px 12px", animation: "legSwing 0.8s ease-in-out 0.4s infinite" }}>
      <rect x="6.8" y="12" width="1.8" height="5" rx="0.9" fill="currentColor" opacity="0.8" />
    </g>
    <g style={{ transformOrigin: "9px 7px", animation: "stickSwing 1.2s ease-in-out infinite" }}>
      <line x1="9" y1="7" x2="12" y2="16" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
);

const RoutesHeroScene = () => {
  const time = getTimeSlot();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const weather = useMemo(() => {
    const opts = ["clear", "clear", "cloudy", "windy"] as const;
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
    morning: "from-amber-200/25 via-sky-300/20 to-emerald-200/15 dark:from-amber-900/20 dark:via-sky-900/15 dark:to-emerald-900/10",
    afternoon: "from-orange-300/20 via-amber-200/15 to-sky-200/10 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-sky-900/10",
    sunset: "from-orange-400/35 via-rose-300/30 to-purple-300/25 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-purple-950/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-emerald-950/25",
  };

  const isNight = time === "night";
  const isSunset = time === "sunset";

  return (
    <div ref={containerRef} className="relative w-full h-52 overflow-hidden pointer-events-auto">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} />

      {/* ═══ CELESTIAL BODY ═══ */}
      <div className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.15)}px, ${py(0.1)}px)` }}>
        {isNight ? (
          /* Moon + stars */
          <>
            <div className="absolute top-[10%] right-[15%]">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <defs>
                  <radialGradient id="rMoonGlow">
                    <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="14" cy="14" r="14" fill="url(#rMoonGlow)" />
                <circle cx="14" cy="14" r="7" fill="#F1F5F9" />
                <circle cx="11" cy="12" r="1.5" fill="#CBD5E1" opacity="0.5" />
                <circle cx="16" cy="15" r="1" fill="#CBD5E1" opacity="0.4" />
              </svg>
            </div>
            {/* Stars */}
            {[
              { x: "10%", y: "8%", s: 2, d: 0 }, { x: "25%", y: "15%", s: 1.5, d: 0.5 },
              { x: "40%", y: "5%", s: 1.8, d: 1 }, { x: "55%", y: "12%", s: 1.3, d: 1.5 },
              { x: "70%", y: "8%", s: 2, d: 0.8 }, { x: "85%", y: "18%", s: 1.5, d: 2 },
              { x: "15%", y: "22%", s: 1.2, d: 0.3 }, { x: "60%", y: "20%", s: 1, d: 1.2 },
            ].map((s, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ left: s.x, top: s.y, width: s.s, height: s.s, animation: `twinkle 3s ease-in-out ${s.d}s infinite` }} />
            ))}
          </>
        ) : (
          /* Sun */
          <div className="absolute" style={{
            top: time === "dawn" ? "30%" : time === "sunset" ? "25%" : "8%",
            right: time === "dawn" ? "25%" : "15%",
            animation: "sunFloat 6s ease-in-out infinite",
          }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <defs>
                <radialGradient id="rSunGrad">
                  <stop offset="0%" stopColor={isSunset ? "#FDBA74" : "#FDE68A"} stopOpacity="0.9" />
                  <stop offset="60%" stopColor={isSunset ? "#F97316" : "#F59E0B"} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isSunset ? "#F97316" : "#F59E0B"} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="18" cy="18" r="18" fill="url(#rSunGrad)" />
              <circle cx="18" cy="18" r="8" fill={isSunset ? "#FB923C" : "#FBBF24"} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line key={a} x1="18" y1="18"
                  x2={18 + Math.cos(a * Math.PI / 180) * 16}
                  y2={18 + Math.sin(a * Math.PI / 180) * 16}
                  stroke={isSunset ? "#FB923C" : "#FBBF24"} strokeWidth="0.5" opacity="0.3"
                  style={{ animation: `sunRayPulse 4s ease-in-out ${a / 360}s infinite` }} />
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* ═══ CLOUDS ═══ */}
      {(weather === "cloudy" || weather === "clear") && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `translate(${px(0.08)}px, ${py(0.05)}px)` }}>
          {[
            { y: 12, rx: 24, ry: 7, dur: 25, delay: 0 },
            { y: 18, rx: 18, ry: 5.5, dur: 32, delay: 10 },
            { y: 8, rx: 20, ry: 6, dur: 28, delay: 18 },
          ].map((c, i) => (
            <div key={i} className="absolute w-full" style={{
              top: c.y, animation: `rCloudDrift ${c.dur}s linear ${c.delay}s infinite`,
            }}>
              <svg width="60" height="20" viewBox="0 0 60 20" opacity={weather === "cloudy" ? 0.5 : 0.3}>
                <ellipse cx="30" cy="12" rx={c.rx} ry={c.ry} fill="white" opacity="0.6" />
                <ellipse cx="38" cy="10" rx={c.rx * 0.6} ry={c.ry * 0.8} fill="white" opacity="0.45" />
                <ellipse cx="22" cy="11" rx={c.rx * 0.5} ry={c.ry * 0.7} fill="white" opacity="0.35" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* ═══ FAR MOUNTAIN SILHOUETTES ═══ */}
      <div className="absolute bottom-[32%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.03)}px, ${py(0.02)}px)` }}>
        <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="w-full h-12" opacity="0.25">
          <path d="M0,50 L30,30 L60,38 L100,18 L140,32 L180,10 L220,28 L260,15 L300,22 L340,8 L370,25 L400,18 L400,50Z"
            fill="hsl(150,25%,35%)" />
        </svg>
      </div>

      {/* ═══ MID MOUNTAINS ═══ */}
      <div className="absolute bottom-[22%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.06)}px, ${py(0.04)}px)` }}>
        <svg viewBox="0 0 400 55" preserveAspectRatio="none" className="w-full h-14" opacity="0.4">
          <defs>
            <linearGradient id="rMidMtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150,30%,38%)" />
              <stop offset="100%" stopColor="hsl(150,25%,28%)" />
            </linearGradient>
          </defs>
          <path d="M0,55 L20,35 L55,42 L90,22 L130,38 L165,15 L200,32 L240,20 L275,30 L310,12 L345,28 L380,22 L400,30 L400,55Z"
            fill="url(#rMidMtGrad)" />
          {/* Snow caps */}
          <path d="M165,15 L158,22 L172,22Z" fill="white" opacity="0.4" />
          <path d="M310,12 L304,19 L316,19Z" fill="white" opacity="0.35" />
        </svg>
      </div>

      {/* ═══ NEAR MOUNTAINS ═══ */}
      <div className="absolute bottom-[12%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.1)}px, ${py(0.06)}px)` }}>
        <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="w-full h-14">
          <defs>
            <linearGradient id="rNearMtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150,35%,32%)" />
              <stop offset="100%" stopColor="hsl(150,30%,22%)" />
            </linearGradient>
          </defs>
          <path d="M0,50 L0,35 L40,28 L80,38 L120,22 L160,32 L195,18 L230,30 L270,24 L310,35 L350,28 L400,32 L400,50Z"
            fill="url(#rNearMtGrad)" />
          {/* Ridge detail lines */}
          <path d="M120,22 L135,27 L150,25" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.3" opacity="0.5" />
          <path d="M195,18 L210,24 L225,22" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.3" opacity="0.5" />
        </svg>
      </div>

      {/* ═══ FAR TREES ═══ */}
      <div className="absolute bottom-[18%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.08)}px, ${py(0.05)}px)` }}>
        {[30, 60, 100, 140, 175, 210, 250, 285, 320, 350].map((x, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${(x / 400) * 100}%` }}>
            <svg width="7" height="12" viewBox="0 0 10 16" opacity="0.3">
              <rect x="4" y="9" width="2" height="7" rx="1" fill="hsl(25,30%,30%)" />
              <polygon points="5,0 9,8 1,8" fill="hsl(150,35%,35%)" />
              <polygon points="5,3 8,9 2,9" fill="hsl(150,38%,38%)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ GROUND + TERRAIN ═══ */}
      <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.05)}px, ${py(0.03)}px)` }}>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-10">
          <path d="M0,15 Q50,5 100,12 Q150,20 200,10 Q250,2 300,14 Q350,22 400,8 L400,40 L0,40Z"
            fill="hsl(150,28%,20%)" opacity="0.6" />
          <path d="M0,20 Q60,12 120,18 Q180,25 240,15 Q300,8 360,18 Q380,22 400,15 L400,40 L0,40Z"
            fill="hsl(150,25%,18%)" opacity="0.45" />
        </svg>
      </div>

      {/* ═══ NEAR TREES (detailed, swaying) ═══ */}
      <div className="absolute bottom-[4%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.14)}px, ${py(0.08)}px)` }}>
        {[
          { x: "5%", h: 22, d: 0 }, { x: "14%", h: 18, d: 0.5 }, { x: "26%", h: 24, d: 1.2 },
          { x: "42%", h: 20, d: 0.3 }, { x: "56%", h: 26, d: 0.8 }, { x: "67%", h: 18, d: 1.5 },
          { x: "78%", h: 22, d: 0.2 }, { x: "90%", h: 20, d: 1 },
        ].map((tree, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: tree.x }}>
            <svg width="12" height={tree.h} viewBox={`0 0 14 ${tree.h + 2}`} className="text-primary"
              style={{ animation: `treeBreeze 4s ease-in-out ${tree.d}s infinite`, transformOrigin: "bottom center" }}>
              <rect x="6" y={tree.h * 0.45} width="2" height={tree.h * 0.55} fill="hsl(25,35%,28%)" rx="1" />
              <polygon points={`7,0 1,${tree.h * 0.5} 13,${tree.h * 0.5}`} fill="hsl(150,42%,30%)" opacity="0.9" />
              <polygon points={`7,${tree.h * 0.12} 2,${tree.h * 0.55} 12,${tree.h * 0.55}`} fill="hsl(150,45%,34%)" opacity="0.8" />
              <polygon points={`7,${tree.h * 0.25} 3,${tree.h * 0.58} 11,${tree.h * 0.58}`} fill="hsl(150,40%,37%)" opacity="0.7" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ TRAIL PATH ═══ */}
      <div className="absolute bottom-[6%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.12)}px, ${py(0.06)}px)` }}>
        <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-5">
          <defs>
            <linearGradient id="rTrailGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
              <stop offset="15%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
              <stop offset="85%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M-10,12 Q40,6 90,10 Q150,16 200,8 Q260,2 320,11 Q370,16 410,7"
            fill="none" stroke="url(#rTrailGrad)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3.5" />
        </svg>
      </div>

      {/* ═══ WALKING HIKER ═══ */}
      <div className="absolute bottom-[7%] left-0 right-0 h-6 z-[2]"
        style={{ transform: `translate(${px(0.12)}px, 0)` }}>
        <div className="absolute bottom-0" style={{ animation: "hikerWalk 14s linear infinite" }}>
          <TrailHiker />
        </div>
        {/* Footprints */}
        <div className="absolute bottom-[2px] left-0 right-0 flex gap-2.5 opacity-10"
          style={{ animation: "hikerWalk 14s linear infinite" }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.07 }} />
          ))}
        </div>
      </div>

      {/* ═══ TRAIL MARKERS ═══ */}
      <div className="absolute bottom-[5%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
        {[18, 38, 58, 78].map((pct, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${pct}%` }}>
            <svg width="6" height="10" viewBox="0 0 8 14" opacity="0.6">
              <rect x="3" y="5" width="2" height="9" rx="0.5" fill="hsl(30,30%,40%)" />
              <circle cx="4" cy="4" r="2.5" fill="hsl(25,80%,55%)" />
              <circle cx="4" cy="4" r="1.2" fill="hsl(25,90%,65%)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ WILDLIFE ═══ */}
      {/* Birds */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
        {[
          { y: "15%", dur: 9, delay: 0, size: 10 },
          { y: "22%", dur: 12, delay: 4, size: 8 },
          { y: "10%", dur: 11, delay: 7, size: 7 },
        ].map((b, i) => (
          <div key={i} className="absolute" style={{ top: b.y, animation: `heroBirdFly ${b.dur}s linear ${b.delay}s infinite` }}>
            <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/25">
              <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        ))}
      </div>

      {/* Butterflies (morning/afternoon) */}
      {(time === "morning" || time === "afternoon") && (
        <div className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}>
          {[
            { x: "22%", y: "35%", color: "#F59E0B", dur: 6 },
            { x: "68%", y: "30%", color: "#A78BFA", dur: 7 },
          ].map((bf, i) => (
            <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur}s ease-in-out ${i}s infinite` }}>
              <svg width="8" height="6" viewBox="0 0 14 10" opacity="0.5">
                <ellipse cx="4" cy="5" rx="3" ry="3"><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                <ellipse cx="10" cy="5" rx="3" ry="3" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Fireflies (night/sunset) */}
      {(isNight || isSunset) && (
        <>
          {[
            { x: "12%", y: "45%", d: 0 }, { x: "35%", y: "55%", d: 1.2 },
            { x: "55%", y: "40%", d: 0.5 }, { x: "75%", y: "50%", d: 1.8 },
            { x: "88%", y: "42%", d: 0.8 }, { x: "48%", y: "60%", d: 2.2 },
          ].map((f, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: f.x, top: f.y,
                background: isNight ? "#FDE68A" : "#FDBA74",
                boxShadow: `0 0 4px 1px ${isNight ? "rgba(253,230,138,0.5)" : "rgba(253,186,116,0.4)"}`,
                animation: `fireflyGlow 3s ease-in-out ${f.d}s infinite`,
              }} />
          ))}
        </>
      )}

      {/* Floating leaves (morning/afternoon) */}
      {(time === "morning" || time === "afternoon") && (
        <>
          {[
            { x: "25%", dur: 9, delay: 0 },
            { x: "55%", dur: 11, delay: 3 },
            { x: "80%", dur: 8, delay: 1.5 },
          ].map((l, i) => (
            <div key={i} className="absolute" style={{ left: l.x, animation: `leafFall ${l.dur}s ease-in-out ${l.delay}s infinite` }}>
              <svg width="7" height="5" viewBox="0 0 10 8" opacity="0.25">
                <ellipse cx="5" cy="4" rx="4" ry="2" fill="#22C55E" transform="rotate(-30 5 4)" />
                <line x1="2" y1="5" x2="8" y2="3" stroke="#16A34A" strokeWidth="0.5" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* ═══ MIST (dawn) ═══ */}
      {time === "dawn" && (
        <>
          {[
            { x: "5%", y: "65%", w: 100 },
            { x: "35%", y: "70%", w: 80 },
            { x: "65%", y: "62%", w: 110 },
          ].map((m, i) => (
            <div key={i} className="absolute" style={{ left: m.x, top: m.y, animation: `mistDrift ${6 + i * 2}s ease-in-out ${i}s infinite` }}>
              <svg width={m.w} height="10" viewBox={`0 0 ${m.w} 10`} opacity="0.12">
                <ellipse cx={m.w / 2} cy="5" rx={m.w / 2} ry="4" fill="white" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* ═══ SMALL CABIN / HOSPEDAJE (right side) ═══ */}
      <div className="absolute bottom-[8%] right-[12%] transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.1)}px, ${py(0.06)}px)` }}>
        <svg width="22" height="18" viewBox="0 0 28 24" opacity="0.6">
          {/* Cabin body */}
          <rect x="4" y="10" width="20" height="14" rx="1" fill="hsl(25,40%,30%)" />
          {/* Roof */}
          <polygon points="2,11 14,2 26,11" fill="hsl(25,35%,25%)" />
          <polygon points="4,11 14,4 24,11" fill="hsl(25,30%,35%)" />
          {/* Door */}
          <rect x="11" y="16" width="6" height="8" rx="1" fill="hsl(25,35%,22%)" />
          {/* Windows with warm glow */}
          <rect x="6" y="13" width="4" height="3" rx="0.5" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.7" : "0.4"} />
          <rect x="18" y="13" width="4" height="3" rx="0.5" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.7" : "0.4"} />
          {/* Chimney */}
          <rect x="19" y="3" width="3" height="8" rx="0.5" fill="hsl(25,30%,28%)" />
          {/* Smoke from chimney */}
          <circle cx="20.5" cy="1" r="1.5" fill="currentColor" className="text-muted-foreground" opacity="0.1"
            style={{ animation: "smokeRise 2.5s ease-out infinite" }} />
          <circle cx="21.5" cy="-1" r="1" fill="currentColor" className="text-muted-foreground" opacity="0.08"
            style={{ animation: "smokeRise 3s ease-out 0.8s infinite" }} />
        </svg>
      </div>

      {/* ═══ CSS ANIMATIONS ═══ */}
      <style>{`
        @keyframes rCloudDrift {
          0% { transform: translateX(110%); }
          100% { transform: translateX(-30%); }
        }
        @keyframes sunFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes sunRayPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes treeBreeze {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(1.5deg); }
          70% { transform: rotate(-1deg); }
        }
        @keyframes hikerWalk {
          0% { left: -5%; }
          100% { left: 95%; }
        }
        @keyframes heroBirdFly {
          0% { left: 105%; }
          100% { left: -8%; }
        }
        @keyframes butterflyFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(8px, -6px) rotate(5deg); }
          50% { transform: translate(14px, 2px) rotate(-3deg); }
          75% { transform: translate(6px, -4px) rotate(4deg); }
        }
        @keyframes fireflyGlow {
          0%, 100% { opacity: 0.15; transform: translate(0, 0); }
          30% { opacity: 0.8; transform: translate(3px, -4px); }
          60% { opacity: 0.2; transform: translate(-2px, 2px); }
          80% { opacity: 0.9; transform: translate(4px, -2px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes leafFall {
          0% { top: -5%; opacity: 0; transform: rotate(0deg) translateX(0); }
          10% { opacity: 0.3; }
          100% { top: 90%; opacity: 0; transform: rotate(360deg) translateX(20px); }
        }
        @keyframes mistDrift {
          0%, 100% { transform: translateX(0); opacity: 0.12; }
          50% { transform: translateX(20px); opacity: 0.06; }
        }
      `}</style>
    </div>
  );
};

export default RoutesHeroScene;

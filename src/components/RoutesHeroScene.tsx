/**
 * RoutesHeroScene — Polished animated SVG landscape for Experiencias.
 * Accepts `mode` prop: "rutas" shows trail + markers, "hospedajes" shows a cozy cabin scene.
 * Time-of-day sky, interactive parallax, layered mountains, wildlife, weather.
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

interface RoutesHeroSceneProps {
  mode?: "rutas" | "hospedajes";
}

const RoutesHeroScene = ({ mode = "rutas" }: RoutesHeroSceneProps) => {
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

  const px = (d: number) => (mouse.x - 0.5) * d * 20;
  const py = (d: number) => (mouse.y - 0.5) * d * 12;

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/30 via-amber-200/25 to-sky-200/20 dark:from-rose-900/25 dark:via-amber-900/20 dark:to-sky-900/15",
    morning: "from-amber-200/25 via-sky-300/20 to-emerald-200/15 dark:from-amber-900/20 dark:via-sky-900/15 dark:to-emerald-900/10",
    afternoon: "from-orange-300/20 via-amber-200/15 to-sky-200/10 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-sky-900/10",
    sunset: "from-orange-400/35 via-rose-300/30 to-purple-300/25 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-purple-950/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-emerald-950/25",
  };

  const isNight = time === "night";
  const isSunset = time === "sunset";
  const isHospedaje = mode === "hospedajes";

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto z-0">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} />

      {/* ═══ CELESTIAL ═══ */}
      <div className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.15)}px, ${py(0.1)}px)` }}>
        {isNight ? (
          <>
            <div className="absolute top-[10%] right-[15%]">
              <svg width="30" height="30" viewBox="0 0 30 30">
                <defs>
                  <radialGradient id="rMoonG"><stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" /><stop offset="100%" stopColor="#94A3B8" stopOpacity="0" /></radialGradient>
                </defs>
                <circle cx="15" cy="15" r="15" fill="url(#rMoonG)" />
                <circle cx="15" cy="15" r="7.5" fill="#F1F5F9" />
                <circle cx="12" cy="13" r="1.5" fill="#CBD5E1" opacity="0.4" />
                <circle cx="17" cy="16" r="1" fill="#CBD5E1" opacity="0.3" />
              </svg>
            </div>
            {[
              { x: "8%", y: "6%", s: 2, d: 0 }, { x: "22%", y: "14%", s: 1.5, d: 0.5 },
              { x: "38%", y: "4%", s: 1.8, d: 1 }, { x: "52%", y: "11%", s: 1.3, d: 1.5 },
              { x: "68%", y: "7%", s: 2, d: 0.8 }, { x: "82%", y: "16%", s: 1.5, d: 2 },
              { x: "13%", y: "20%", s: 1.2, d: 0.3 }, { x: "58%", y: "18%", s: 1, d: 1.2 },
              { x: "45%", y: "9%", s: 1.6, d: 0.7 }, { x: "75%", y: "22%", s: 1.4, d: 1.8 },
            ].map((s, i) => (
              <div key={i} className="absolute rounded-full bg-white"
                style={{ left: s.x, top: s.y, width: s.s, height: s.s, animation: `twinkle 3s ease-in-out ${s.d}s infinite` }} />
            ))}
          </>
        ) : (
          <div className="absolute" style={{
            top: time === "dawn" ? "28%" : time === "sunset" ? "22%" : "6%",
            right: time === "dawn" ? "22%" : "14%",
            animation: "sunFloat 6s ease-in-out infinite",
          }}>
            <svg width="44" height="44" viewBox="0 0 40 40">
              <defs>
                <radialGradient id="rSG">
                  <stop offset="0%" stopColor={isSunset ? "#FDBA74" : "#FDE68A"} stopOpacity="0.9" />
                  <stop offset="50%" stopColor={isSunset ? "#F97316" : "#F59E0B"} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={isSunset ? "#F97316" : "#F59E0B"} stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#rSG)" />
              <circle cx="20" cy="20" r="9" fill={isSunset ? "#FB923C" : "#FBBF24"} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line key={a} x1="20" y1="20"
                  x2={20 + Math.cos(a * Math.PI / 180) * 18}
                  y2={20 + Math.sin(a * Math.PI / 180) * 18}
                  stroke={isSunset ? "#FB923C" : "#FBBF24"} strokeWidth="0.6" opacity="0.25"
                  style={{ animation: `sunRayPulse 4s ease-in-out ${a / 360}s infinite` }} />
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* ═══ CLOUDS ═══ */}
      <div className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.08)}px, ${py(0.05)}px)` }}>
        {[
          { y: 10, rx: 26, ry: 8, dur: 24, delay: 0, op: 0.35 },
          { y: 16, rx: 20, ry: 6, dur: 30, delay: 9, op: 0.25 },
          { y: 6, rx: 22, ry: 7, dur: 27, delay: 16, op: 0.3 },
        ].map((c, i) => (
          <div key={i} className="absolute" style={{
            top: c.y, animation: `rCloudDrift ${c.dur}s linear ${c.delay}s infinite`,
          }}>
            <svg width="70" height="22" viewBox="0 0 70 22" opacity={weather === "cloudy" ? c.op + 0.15 : c.op}>
              <ellipse cx="35" cy="13" rx={c.rx} ry={c.ry} fill="white" opacity="0.6" />
              <ellipse cx="44" cy="11" rx={c.rx * 0.55} ry={c.ry * 0.75} fill="white" opacity="0.45" />
              <ellipse cx="26" cy="12" rx={c.rx * 0.45} ry={c.ry * 0.65} fill="white" opacity="0.35" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ FAR MOUNTAINS ═══ */}
      <div className="absolute bottom-[30%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.03)}px, ${py(0.02)}px)` }}>
        <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="w-full h-12" opacity="0.2">
          <path d="M0,50 L25,28 L55,36 L95,16 L135,30 L175,8 L215,26 L255,13 L295,20 L335,6 L365,22 L400,16 L400,50Z"
            fill="hsl(150,25%,35%)" />
        </svg>
      </div>

      {/* ═══ MID MOUNTAINS ═══ */}
      <div className="absolute bottom-[20%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.06)}px, ${py(0.04)}px)` }}>
        <svg viewBox="0 0 400 55" preserveAspectRatio="none" className="w-full h-14" opacity="0.4">
          <defs>
            <linearGradient id="rMM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150,30%,38%)" /><stop offset="100%" stopColor="hsl(150,25%,28%)" />
            </linearGradient>
          </defs>
          <path d="M0,55 L18,33 L52,40 L88,20 L128,36 L162,13 L198,30 L238,18 L272,28 L308,10 L342,26 L378,20 L400,28 L400,55Z" fill="url(#rMM)" />
          <path d="M162,13 L155,20 L169,20Z" fill="white" opacity="0.35" />
          <path d="M308,10 L302,17 L314,17Z" fill="white" opacity="0.3" />
        </svg>
      </div>

      {/* ═══ NEAR MOUNTAINS ═══ */}
      <div className="absolute bottom-[12%] left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.1)}px, ${py(0.06)}px)` }}>
        <svg viewBox="0 0 400 50" preserveAspectRatio="none" className="w-full h-14">
          <defs>
            <linearGradient id="rNM" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(150,35%,32%)" /><stop offset="100%" stopColor="hsl(150,30%,22%)" />
            </linearGradient>
          </defs>
          <path d="M0,50 L0,33 L38,26 L78,36 L118,20 L158,30 L193,16 L228,28 L268,22 L308,33 L348,26 L400,30 L400,50Z" fill="url(#rNM)" />
          <path d="M118,20 L133,25 L148,23" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.3" opacity="0.4" />
          <path d="M193,16 L208,22 L223,20" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.3" opacity="0.4" />
        </svg>
      </div>

      {/* ═══ FAR TREES ═══ */}
      <div className="absolute bottom-[16%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.08)}px, ${py(0.05)}px)` }}>
        {[25, 55, 90, 130, 165, 200, 240, 275, 310, 345].map((x, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: `${(x / 400) * 100}%` }}>
            <svg width="7" height="13" viewBox="0 0 10 17" opacity="0.28">
              <rect x="4" y="10" width="2" height="7" rx="1" fill="hsl(25,30%,30%)" />
              <polygon points="5,0 9,9 1,9" fill="hsl(150,35%,33%)" />
              <polygon points="5,3 8,10 2,10" fill="hsl(150,38%,37%)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ GROUND ═══ */}
      <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.05)}px, ${py(0.03)}px)` }}>
        <svg viewBox="0 0 400 45" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,12 Q50,4 100,10 Q150,18 200,8 Q250,0 300,12 Q350,20 400,6 L400,45 L0,45Z" fill="hsl(150,28%,20%)" opacity="0.55" />
          <path d="M0,18 Q60,10 120,16 Q180,24 240,13 Q300,5 360,16 Q380,20 400,12 L400,45 L0,45Z" fill="hsl(150,25%,16%)" opacity="0.4" />
        </svg>
      </div>

      {/* ═══ NEAR TREES (detailed, swaying) ═══ */}
      <div className="absolute bottom-[3%] left-0 right-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.14)}px, ${py(0.08)}px)` }}>
        {[
          { x: "4%", h: 24, d: 0 }, { x: "12%", h: 19, d: 0.5 }, { x: "24%", h: 26, d: 1.2 },
          { x: "40%", h: 21, d: 0.3 }, { x: "54%", h: 28, d: 0.8 }, { x: "65%", h: 19, d: 1.5 },
          { x: "76%", h: 24, d: 0.2 }, { x: "88%", h: 22, d: 1 }, { x: "96%", h: 18, d: 0.7 },
        ].map((t, i) => (
          <div key={i} className="absolute bottom-0" style={{ left: t.x }}>
            <svg width="13" height={t.h} viewBox={`0 0 16 ${t.h + 2}`}
              style={{ animation: `treeBreeze 4s ease-in-out ${t.d}s infinite`, transformOrigin: "bottom center" }}>
              <rect x="7" y={t.h * 0.42} width="2" height={t.h * 0.58} fill="hsl(25,35%,26%)" rx="1" />
              <polygon points={`8,0 1,${t.h * 0.48} 15,${t.h * 0.48}`} fill="hsl(150,42%,28%)" opacity="0.9" />
              <polygon points={`8,${t.h * 0.1} 2,${t.h * 0.52} 14,${t.h * 0.52}`} fill="hsl(150,45%,32%)" opacity="0.8" />
              <polygon points={`8,${t.h * 0.22} 3,${t.h * 0.56} 13,${t.h * 0.56}`} fill="hsl(150,40%,35%)" opacity="0.7" />
            </svg>
          </div>
        ))}
      </div>

      {/* ═══ MODE: RUTAS — Trail + markers ═══ */}
      {!isHospedaje && (
        <>
          {/* Trail path */}
          <div className="absolute bottom-[5%] left-0 right-0 transition-transform duration-200 ease-out"
            style={{ transform: `translate(${px(0.12)}px, ${py(0.06)}px)` }}>
            <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-5">
              <defs>
                <linearGradient id="rTG" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
                  <stop offset="12%" stopColor="hsl(30,40%,50%)" stopOpacity="0.45" />
                  <stop offset="88%" stopColor="hsl(30,40%,50%)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M-10,12 Q40,5 90,10 Q150,17 200,7 Q260,0 320,11 Q370,17 410,6"
                fill="none" stroke="url(#rTG)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3.5" />
            </svg>
          </div>
          {/* Trail markers */}
          <div className="absolute bottom-[4%] left-0 right-0 transition-transform duration-200 ease-out"
            style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            {[16, 36, 56, 76].map((pct, i) => (
              <div key={i} className="absolute bottom-0" style={{ left: `${pct}%` }}>
                <svg width="7" height="12" viewBox="0 0 10 16" opacity="0.55">
                  <rect x="4" y="6" width="2" height="10" rx="0.5" fill="hsl(30,30%,38%)" />
                  <circle cx="5" cy="5" r="3" fill="hsl(25,80%,55%)" />
                  <circle cx="5" cy="5" r="1.5" fill="hsl(25,90%,65%)" />
                </svg>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══ MODE: HOSPEDAJES — Cozy cabin with garden ═══ */}
      {isHospedaje && (
        <div className="absolute bottom-[4%] left-[50%] -translate-x-1/2 transition-all duration-500 ease-out"
          style={{ transform: `translateX(-50%) translate(${px(0.1)}px, ${py(0.06)}px)` }}>
          <svg width="120" height="80" viewBox="0 0 140 95" className="drop-shadow-lg">
            {/* Garden path */}
            <path d="M20,90 Q45,82 70,85 Q95,88 120,80" fill="none" stroke="hsl(30,35%,40%)" strokeWidth="3" strokeDasharray="4 3" opacity="0.35" />
            
            {/* Garden flowers */}
            {[{ x: 25, c: "#F59E0B" }, { x: 40, c: "#EF4444" }, { x: 100, c: "#A78BFA" }, { x: 115, c: "#F59E0B" }].map((f, i) => (
              <g key={i} style={{ animation: `flowerSway 3s ease-in-out ${i * 0.5}s infinite` }}>
                <line x1={f.x} y1="88" x2={f.x} y2="80" stroke="hsl(150,40%,35%)" strokeWidth="1" />
                <circle cx={f.x} cy="78" r="2.5" fill={f.c} opacity="0.7" />
                <circle cx={f.x} cy="78" r="1" fill="white" opacity="0.5" />
              </g>
            ))}

            {/* Fence */}
            {[15, 28, 41, 99, 112, 125].map((x, i) => (
              <g key={i}>
                <rect x={x} y="72" width="1.5" height="16" rx="0.5" fill="hsl(30,30%,40%)" opacity="0.35" />
              </g>
            ))}
            <rect x="15" y="76" width="28" height="1.2" rx="0.5" fill="hsl(30,30%,40%)" opacity="0.3" />
            <rect x="15" y="82" width="28" height="1.2" rx="0.5" fill="hsl(30,30%,40%)" opacity="0.3" />
            <rect x="99" y="76" width="28" height="1.2" rx="0.5" fill="hsl(30,30%,40%)" opacity="0.3" />
            <rect x="99" y="82" width="28" height="1.2" rx="0.5" fill="hsl(30,30%,40%)" opacity="0.3" />

            {/* Cabin — main body */}
            <rect x="45" y="40" width="50" height="48" rx="2" fill="hsl(25,40%,28%)" />
            {/* Wood plank lines */}
            {[48, 56, 64, 72, 80].map((y) => (
              <line key={y} x1="46" y1={y} x2="94" y2={y} stroke="hsl(25,30%,22%)" strokeWidth="0.5" opacity="0.3" />
            ))}
            
            {/* Roof */}
            <polygon points="38,42 70,14 102,42" fill="hsl(25,35%,22%)" />
            <polygon points="42,42 70,18 98,42" fill="hsl(25,30%,30%)" />
            {/* Roof ridgeline */}
            <line x1="70" y1="14" x2="70" y2="18" stroke="hsl(25,25%,18%)" strokeWidth="1.5" />
            
            {/* Door */}
            <rect x="60" y="62" width="20" height="26" rx="2" fill="hsl(25,35%,20%)" />
            <rect x="62" y="64" width="16" height="22" rx="1.5" fill="hsl(25,30%,25%)" />
            <circle cx="75" cy="76" r="1.5" fill="#FBBF24" opacity="0.6" />
            {/* Door window */}
            <rect x="64" y="66" width="12" height="8" rx="1" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.6" : "0.3"} />
            
            {/* Windows */}
            <g>
              <rect x="48" y="48" width="10" height="10" rx="1.5" fill="hsl(25,30%,22%)" />
              <rect x="49" y="49" width="8" height="8" rx="1" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.65" : "0.35"} />
              <line x1="53" y1="49" x2="53" y2="57" stroke="hsl(25,30%,22%)" strokeWidth="0.8" />
              <line x1="49" y1="53" x2="57" y2="53" stroke="hsl(25,30%,22%)" strokeWidth="0.8" />
            </g>
            <g>
              <rect x="82" y="48" width="10" height="10" rx="1.5" fill="hsl(25,30%,22%)" />
              <rect x="83" y="49" width="8" height="8" rx="1" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.65" : "0.35"} />
              <line x1="87" y1="49" x2="87" y2="57" stroke="hsl(25,30%,22%)" strokeWidth="0.8" />
              <line x1="83" y1="53" x2="91" y2="53" stroke="hsl(25,30%,22%)" strokeWidth="0.8" />
            </g>
            
            {/* Chimney */}
            <rect x="80" y="18" width="6" height="18" rx="1" fill="hsl(25,28%,25%)" />
            <rect x="78" y="16" width="10" height="3" rx="1" fill="hsl(25,25%,22%)" />
            {/* Smoke */}
            <circle cx="83" cy="12" r="2" fill="currentColor" className="text-muted-foreground" opacity="0.1"
              style={{ animation: "smokeRise 2.5s ease-out infinite" }} />
            <circle cx="85" cy="8" r="1.5" fill="currentColor" className="text-muted-foreground" opacity="0.07"
              style={{ animation: "smokeRise 3s ease-out 0.8s infinite" }} />
            <circle cx="82" cy="5" r="1.8" fill="currentColor" className="text-muted-foreground" opacity="0.05"
              style={{ animation: "smokeRise 3.5s ease-out 1.5s infinite" }} />

            {/* Warm glow from windows at night */}
            {isNight && (
              <>
                <ellipse cx="53" cy="58" rx="8" ry="4" fill="#FDE68A" opacity="0.08" />
                <ellipse cx="87" cy="58" rx="8" ry="4" fill="#FDE68A" opacity="0.08" />
                <ellipse cx="70" cy="88" rx="12" ry="5" fill="#FDE68A" opacity="0.06" />
              </>
            )}

            {/* Small trees next to cabin */}
            <g style={{ animation: "treeBreeze 4s ease-in-out 0.3s infinite", transformOrigin: "30px 88px" }}>
              <rect x="29" y="70" width="2" height="18" rx="1" fill="hsl(25,35%,26%)" />
              <polygon points="30,52 22,70 38,70" fill="hsl(150,42%,30%)" opacity="0.85" />
              <polygon points="30,57 24,71 36,71" fill="hsl(150,45%,34%)" opacity="0.75" />
            </g>
            <g style={{ animation: "treeBreeze 4s ease-in-out 0.8s infinite", transformOrigin: "110px 88px" }}>
              <rect x="109" y="72" width="2" height="16" rx="1" fill="hsl(25,35%,26%)" />
              <polygon points="110,56 103,72 117,72" fill="hsl(150,42%,30%)" opacity="0.85" />
              <polygon points="110,60 105,73 115,73" fill="hsl(150,45%,34%)" opacity="0.75" />
            </g>
          </svg>
        </div>
      )}

      {/* Small cabin hint when in rutas mode */}
      {!isHospedaje && (
        <div className="absolute bottom-[7%] right-[10%] transition-transform duration-200 ease-out"
          style={{ transform: `translate(${px(0.1)}px, ${py(0.06)}px)` }}>
          <svg width="18" height="15" viewBox="0 0 24 20" opacity="0.4">
            <rect x="4" y="8" width="16" height="12" rx="1" fill="hsl(25,40%,30%)" />
            <polygon points="2,9 12,2 22,9" fill="hsl(25,30%,28%)" />
            <rect x="9" y="13" width="6" height="7" rx="1" fill="hsl(25,35%,22%)" />
            <rect x="5" y="10" width="3" height="2.5" rx="0.5" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.6" : "0.3"} />
            <rect x="16" y="10" width="3" height="2.5" rx="0.5" fill={isNight ? "#FDE68A" : "#FDBA74"} opacity={isNight ? "0.6" : "0.3"} />
          </svg>
        </div>
      )}

      {/* ═══ WILDLIFE ═══ */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
        {[
          { y: "14%", dur: 9, delay: 0, size: 10 },
          { y: "20%", dur: 12, delay: 4, size: 8 },
          { y: "9%", dur: 11, delay: 7, size: 7 },
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

      {/* Butterflies (day) */}
      {(time === "morning" || time === "afternoon") && (
        <div className="absolute inset-0" style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}>
          {[
            { x: "20%", y: "32%", color: "#F59E0B", dur: 6 },
            { x: "65%", y: "28%", color: "#A78BFA", dur: 7 },
            { x: "45%", y: "38%", color: "#34D399", dur: 8 },
          ].map((bf, i) => (
            <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur}s ease-in-out ${i}s infinite` }}>
              <svg width="9" height="7" viewBox="0 0 14 10" opacity="0.45">
                <ellipse cx="4" cy="5" rx="3" ry="3" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
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
            { x: "10%", y: "42%", d: 0 }, { x: "32%", y: "52%", d: 1.2 },
            { x: "52%", y: "38%", d: 0.5 }, { x: "72%", y: "48%", d: 1.8 },
            { x: "86%", y: "40%", d: 0.8 }, { x: "45%", y: "58%", d: 2.2 },
            { x: "18%", y: "55%", d: 1.5 }, { x: "62%", y: "45%", d: 0.3 },
          ].map((f, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: f.x, top: f.y,
                background: isNight ? "#FDE68A" : "#FDBA74",
                boxShadow: `0 0 5px 2px ${isNight ? "rgba(253,230,138,0.4)" : "rgba(253,186,116,0.35)"}`,
                animation: `fireflyGlow 3s ease-in-out ${f.d}s infinite`,
              }} />
          ))}
        </>
      )}

      {/* Floating leaves */}
      {(time === "morning" || time === "afternoon") && (
        <>
          {[
            { x: "22%", dur: 9, delay: 0 },
            { x: "52%", dur: 11, delay: 3 },
            { x: "78%", dur: 8, delay: 1.5 },
          ].map((l, i) => (
            <div key={i} className="absolute" style={{ left: l.x, animation: `leafFall ${l.dur}s ease-in-out ${l.delay}s infinite` }}>
              <svg width="7" height="5" viewBox="0 0 10 8" opacity="0.22">
                <ellipse cx="5" cy="4" rx="4" ry="2" fill="#22C55E" transform="rotate(-30 5 4)" />
                <line x1="2" y1="5" x2="8" y2="3" stroke="#16A34A" strokeWidth="0.5" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Mist (dawn) */}
      {time === "dawn" && (
        <>
          {[
            { x: "5%", y: "60%", w: 100 }, { x: "35%", y: "65%", w: 80 }, { x: "65%", y: "58%", w: 110 },
          ].map((m, i) => (
            <div key={i} className="absolute" style={{ left: m.x, top: m.y, animation: `mistDrift ${6 + i * 2}s ease-in-out ${i}s infinite` }}>
              <svg width={m.w} height="10" viewBox={`0 0 ${m.w} 10`} opacity="0.1">
                <ellipse cx={m.w / 2} cy="5" rx={m.w / 2} ry="4" fill="white" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* ═══ CSS ═══ */}
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
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
        @keyframes treeBreeze {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(1.5deg); }
          70% { transform: rotate(-1deg); }
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
          0%, 100% { opacity: 0.1; transform: translate(0, 0); }
          30% { opacity: 0.85; transform: translate(3px, -4px); }
          60% { opacity: 0.15; transform: translate(-2px, 2px); }
          80% { opacity: 0.9; transform: translate(4px, -2px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.6); }
        }
        @keyframes leafFall {
          0% { top: -5%; opacity: 0; transform: rotate(0deg) translateX(0); }
          10% { opacity: 0.25; }
          100% { top: 90%; opacity: 0; transform: rotate(360deg) translateX(20px); }
        }
        @keyframes mistDrift {
          0%, 100% { transform: translateX(0); opacity: 0.1; }
          50% { transform: translateX(20px); opacity: 0.05; }
        }
        @keyframes flowerSway {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(3deg); }
          66% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  );
};

export default RoutesHeroScene;

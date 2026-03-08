/**
 * HeroScenery — Animated mini-landscape for the home hero.
 * Time-of-day + random weather sub-variant + interactive parallax.
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

const HeroScenery = () => {
  const time = getTimeSlot();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const weather = useMemo(() => {
    const opts = ["clear", "cloudy", "windy"] as const;
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

  // Removed hills — scenery is sky-only to not overlap text

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-auto z-0">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} />

      {/* === DAWN === */}
      {time === "dawn" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.1)}px)` }}>
          <div className="absolute bottom-[55%] right-[20%]" style={{ animation: "dawnRise 4s ease-out forwards" }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <defs><radialGradient id="dawnSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="15" cy="15" r="15" fill="url(#dawnSun)" /><circle cx="15" cy="15" r="7" fill="#FBBF24" />
            </svg>
          </div>
          {[{ x: "15%", y: "85%", d: "0s" }, { x: "35%", y: "88%", d: "0.8s" }, { x: "55%", y: "83%", d: "0.4s" }, { x: "75%", y: "87%", d: "1.2s" }].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white/80" style={{ left: d.x, top: d.y, animation: `dewSparkle 3s ease-in-out ${d.d} infinite` }} />
          ))}
        </div>
      )}

      {/* === MORNING === */}
      {time === "morning" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "10%", right: "12%", transform: `translate(${px(0.12)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <defs><radialGradient id="mornSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="18" cy="18" r="18" fill="url(#mornSun)" /><circle cx="18" cy="18" r="8" fill="#FBBF24" />
            </svg>
          </div>
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ y: "18%", dur: "7s", delay: "0s", size: 10 }, { y: "28%", dur: "9s", delay: "3s", size: 8 }].map((b, i) => (
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
            {[{ x: "20%", y: "35%", color: "#F59E0B", dur: "6s" }, { x: "65%", y: "30%", color: "#A78BFA", dur: "7s" }].map((bf, i) => (
              <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur} ease-in-out ${i}s infinite` }}>
                <svg width="10" height="7" viewBox="0 0 14 10" opacity="0.6">
                  <ellipse cx="4" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="10" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                </svg>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === AFTERNOON === */}
      {time === "afternoon" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "6%", right: "18%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs><radialGradient id="aftSun"><stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8" /><stop offset="60%" stopColor="#F97316" stopOpacity="0.4" /><stop offset="100%" stopColor="#F97316" stopOpacity="0" /></radialGradient></defs>
              <circle cx="16" cy="16" r="16" fill="url(#aftSun)" /><circle cx="16" cy="16" r="7" fill="#FB923C" />
            </svg>
          </div>
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ x: "18%", y: "25%", dur: "5s", delay: "0s" }, { x: "60%", y: "20%", dur: "6s", delay: "2s" }].map((df, i) => (
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
        </>
      )}

      {/* === SUNSET === */}
      {time === "sunset" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ bottom: "55%", left: "15%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunsetSink 10s ease-in forwards" }}>
            <svg width="42" height="42" viewBox="0 0 42 42">
              <defs><radialGradient id="setSun"><stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" /><stop offset="40%" stopColor="#F97316" stopOpacity="0.6" /><stop offset="100%" stopColor="#DC2626" stopOpacity="0" /></radialGradient></defs>
              <circle cx="21" cy="21" r="21" fill="url(#setSun)" /><circle cx="21" cy="21" r="10" fill="#FB923C" />
            </svg>
          </div>
          <div className="absolute transition-transform duration-200 ease-out" style={{ top: "18%", transform: `translate(${px(0.2)}px, ${py(0.1)}px)`, animation: "heroBirdFly 12s linear 1s infinite reverse" }}>
            <svg width="30" height="12" viewBox="0 0 50 18" className="text-foreground/30">
              <path d="M0,10 Q6,3 12,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10,12 Q16,5 22,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M20,8 Q26,1 32,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M28,14 Q34,7 40,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,10 Q42,3 48,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          <div className="absolute bottom-[45%] left-0 right-0 h-10 bg-gradient-to-t from-orange-400/15 to-transparent dark:from-orange-800/10" />
        </>
      )}

      {/* === NIGHT === */}
      {time === "night" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "8%", right: "14%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 8s ease-in-out infinite" }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <defs><radialGradient id="heroMoon"><stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.4" /><stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" /></radialGradient></defs>
              <circle cx="14" cy="14" r="14" fill="url(#heroMoon)" /><circle cx="14" cy="14" r="9" fill="#E0E7FF" /><circle cx="17" cy="12" r="7" fill="hsl(var(--background))" opacity="0.7" />
            </svg>
          </div>
          {[{ x: "8%", y: "8%", s: 2, d: "0s" }, { x: "22%", y: "15%", s: 1.5, d: "0.5s" }, { x: "35%", y: "6%", s: 2.5, d: "1s" }, { x: "55%", y: "12%", s: 2, d: "1.5s" }, { x: "75%", y: "5%", s: 2, d: "0.3s" }, { x: "88%", y: "18%", s: 1.5, d: "0.8s" }].map((st, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ left: st.x, top: st.y, width: st.s, height: st.s, animation: `twinkle 2.5s ease-in-out ${st.d} infinite` }} />
          ))}
          <div className="absolute inset-0 transition-transform duration-150 ease-out" style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}>
            {[{ x: "15%", y: "55%", dur: "4s", delay: "0s" }, { x: "45%", y: "50%", dur: "5s", delay: "1s" }, { x: "75%", y: "58%", dur: "4.5s", delay: "2s" }, { x: "60%", y: "45%", dur: "5.5s", delay: "1.5s" }].map((f, i) => (
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
        </>
      )}

      {/* === WEATHER: Clouds === */}
      {weather === "cloudy" && time !== "night" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.08)}px)` }}>
          <div className="absolute top-[12%] opacity-40" style={{ animation: "heroCloudDrift 18s linear infinite" }}>
            <svg width="60" height="22" viewBox="0 0 60 22" className="text-white dark:text-white/30">
              <ellipse cx="30" cy="15" rx="28" ry="7" fill="currentColor" /><ellipse cx="20" cy="10" rx="14" ry="9" fill="currentColor" /><ellipse cx="38" cy="9" rx="12" ry="8" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-[28%] opacity-25" style={{ animation: "heroCloudDrift 25s linear 6s infinite" }}>
            <svg width="45" height="16" viewBox="0 0 45 16" className="text-white dark:text-white/20">
              <ellipse cx="22" cy="11" rx="20" ry="5" fill="currentColor" /><ellipse cx="15" cy="7" rx="10" ry="6" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}

      {/* === WEATHER: Wind === */}
      {weather === "windy" && (
        <div className="absolute inset-0">
          {[{ y: "30%", dur: "3s", delay: "0s" }, { y: "45%", dur: "4s", delay: "1.5s" }].map((w, i) => (
            <div key={i} className="absolute" style={{ top: w.y, animation: `windStreak ${w.dur} linear ${w.delay} infinite` }}>
              <svg width="30" height="3" viewBox="0 0 30 3" className="text-foreground/10">
                <path d="M0,1.5 Q10,0 20,1.5 Q25,3 30,1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          ))}
        </div>
      )}


      {/* Floating particles — drift downward to connect with content below */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.2)}px, ${py(0.15)}px)` }}>
        {[
          { x: "10%", dur: "6s", delay: "0s", size: 3 },
          { x: "25%", dur: "8s", delay: "1s", size: 2 },
          { x: "42%", dur: "7s", delay: "2.5s", size: 2.5 },
          { x: "58%", dur: "9s", delay: "0.5s", size: 2 },
          { x: "72%", dur: "6.5s", delay: "3s", size: 3 },
          { x: "88%", dur: "7.5s", delay: "1.5s", size: 2 },
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
      `}</style>
    </div>
  );
};

export default HeroScenery;

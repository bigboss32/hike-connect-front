/**
 * HeroScenery — Animated mini-landscape for the home hero.
 * Time-of-day + random sub-variant for unique feel every visit.
 * Dawn: pink sky, rooster, morning dew
 * Morning: rising sun, birds, butterflies
 * Afternoon: warm sun, drifting clouds, dragonflies
 * Sunset: orange-purple sky, returning birds, long shadows
 * Night: moon, stars, fireflies, owl silhouette
 */
import { useMemo } from "react";

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
  // Random weather sub-variant
  const weather = useMemo(() => {
    const opts = ["clear", "cloudy", "windy"] as const;
    return opts[Math.floor(Math.random() * opts.length)];
  }, []);

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/30 via-amber-200/25 to-sky-200/20 dark:from-rose-900/25 dark:via-amber-900/20 dark:to-sky-900/15",
    morning: "from-amber-200/30 via-sky-300/20 to-emerald-200/20 dark:from-amber-900/20 dark:via-sky-900/15 dark:to-emerald-900/15",
    afternoon: "from-orange-300/25 via-amber-200/20 to-sky-200/15 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-sky-900/10",
    sunset: "from-orange-400/35 via-rose-300/30 to-purple-300/25 dark:from-orange-950/30 dark:via-rose-950/25 dark:to-purple-950/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-emerald-950/25",
  };

  const hillColors: Record<TimeSlot, [string, string]> = {
    dawn: ["fill-emerald-700/20 dark:fill-emerald-900/30", "fill-emerald-600/15 dark:fill-emerald-800/25"],
    morning: ["fill-emerald-700/15 dark:fill-emerald-900/25", "fill-emerald-600/10 dark:fill-emerald-800/20"],
    afternoon: ["fill-emerald-700/18 dark:fill-emerald-900/28", "fill-emerald-600/12 dark:fill-emerald-800/22"],
    sunset: ["fill-orange-800/20 dark:fill-orange-950/30", "fill-amber-700/15 dark:fill-amber-900/25"],
    night: ["fill-emerald-900/30 dark:fill-emerald-950/40", "fill-emerald-800/25 dark:fill-emerald-900/35"],
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-500`} />

      {/* === DAWN === */}
      {time === "dawn" && (
        <>
          {/* Horizon glow */}
          <div className="absolute bottom-[30%] left-0 right-0 h-16 bg-gradient-to-t from-rose-400/20 to-transparent dark:from-rose-800/15" />
          
          {/* Peeking sun */}
          <div className="absolute" style={{ bottom: "32%", right: "20%", animation: "dawnRise 4s ease-out forwards" }}>
            <svg width="30" height="30" viewBox="0 0 30 30">
              <defs>
                <radialGradient id="dawnSun">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="15" cy="15" r="15" fill="url(#dawnSun)" />
              <circle cx="15" cy="15" r="7" fill="#FBBF24" />
            </svg>
          </div>

          {/* Morning dew sparkles */}
          {[
            { x: "15%", y: "78%", delay: "0s" },
            { x: "35%", y: "82%", delay: "0.8s" },
            { x: "55%", y: "76%", delay: "0.4s" },
            { x: "75%", y: "80%", delay: "1.2s" },
          ].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white/80" style={{ left: d.x, top: d.y, animation: `dewSparkle 3s ease-in-out ${d.delay} infinite` }} />
          ))}

          {/* Rooster silhouette */}
          <div className="absolute" style={{ bottom: "34%", left: "10%" }}>
            <svg width="14" height="14" viewBox="0 0 20 20" className="text-foreground/20">
              <path d="M6,18 L6,12 L4,10 L6,8 L8,4 L10,8 L12,6 L11,10 L14,12 L14,18 Z" fill="currentColor" />
            </svg>
          </div>
        </>
      )}

      {/* === MORNING === */}
      {time === "morning" && (
        <>
          {/* Sun */}
          <div className="absolute" style={{ top: "14%", right: "12%", animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <defs>
                <radialGradient id="mornSun">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="18" cy="18" r="18" fill="url(#mornSun)" />
              <circle cx="18" cy="18" r="8" fill="#FBBF24" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <line key={a} x1="18" y1="18" x2={18 + Math.cos((a * Math.PI) / 180) * 15} y2={18 + Math.sin((a * Math.PI) / 180) * 15} stroke="#FBBF24" strokeWidth="1" opacity="0.4">
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
                </line>
              ))}
            </svg>
          </div>

          {/* Birds */}
          {[
            { y: "20%", dur: "7s", delay: "0s", size: 10 },
            { y: "28%", dur: "9s", delay: "3s", size: 8 },
          ].map((b, i) => (
            <div key={i} className="absolute" style={{ top: b.y, animation: `heroBirdFly ${b.dur} linear ${b.delay} infinite` }}>
              <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/30">
                <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          ))}

          {/* Butterflies */}
          {[
            { x: "20%", y: "40%", color: "#F59E0B", dur: "6s" },
            { x: "65%", y: "35%", color: "#A78BFA", dur: "7s" },
          ].map((bf, i) => (
            <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur} ease-in-out ${i}s infinite` }}>
              <svg width="10" height="7" viewBox="0 0 14 10" opacity="0.6">
                <ellipse cx="4" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                <ellipse cx="10" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
              </svg>
            </div>
          ))}
        </>
      )}

      {/* === AFTERNOON === */}
      {time === "afternoon" && (
        <>
          {/* Sun high */}
          <div className="absolute" style={{ top: "8%", right: "18%", animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <radialGradient id="aftSun">
                  <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#F97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="16" fill="url(#aftSun)" />
              <circle cx="16" cy="16" r="7" fill="#FB923C" />
            </svg>
          </div>

          {/* Dragonflies */}
          {[
            { x: "18%", y: "30%", dur: "5s", delay: "0s" },
            { x: "60%", y: "25%", dur: "6s", delay: "2s" },
            { x: "40%", y: "38%", dur: "4.5s", delay: "1s" },
          ].map((df, i) => (
            <div key={i} className="absolute" style={{ left: df.x, top: df.y, animation: `dragonflyDart ${df.dur} ease-in-out ${df.delay} infinite` }}>
              <svg width="12" height="8" viewBox="0 0 16 10" opacity="0.5">
                <line x1="3" y1="5" x2="13" y2="5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="5" cy="3" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5">
                  <animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="5" cy="7" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5">
                  <animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" />
                </ellipse>
                <circle cx="14" cy="5" r="1.5" fill="#3B82F6" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* === SUNSET === */}
      {time === "sunset" && (
        <>
          {/* Setting sun */}
          <div className="absolute" style={{ bottom: "34%", left: "15%", animation: "sunsetSink 10s ease-in forwards" }}>
            <svg width="42" height="42" viewBox="0 0 42 42">
              <defs>
                <radialGradient id="setSun">
                  <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#F97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="21" cy="21" r="21" fill="url(#setSun)" />
              <circle cx="21" cy="21" r="10" fill="#FB923C" />
            </svg>
          </div>

          {/* Returning birds (V formation) */}
          <div className="absolute" style={{ top: "22%", animation: "heroBirdFly 12s linear 1s infinite reverse" }}>
            <svg width="30" height="12" viewBox="0 0 50 18" className="text-foreground/30">
              <path d="M0,10 Q6,3 12,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10,12 Q16,5 22,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M20,8 Q26,1 32,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M28,14 Q34,7 40,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,10 Q42,3 48,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Warm light streaks */}
          <div className="absolute bottom-[28%] left-0 right-0 h-10 bg-gradient-to-t from-orange-400/15 to-transparent dark:from-orange-800/10" />
        </>
      )}

      {/* === NIGHT === */}
      {time === "night" && (
        <>
          {/* Moon */}
          <div className="absolute" style={{ top: "10%", right: "14%", animation: "sunFloat 8s ease-in-out infinite" }}>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <defs>
                <radialGradient id="heroMoon">
                  <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="14" cy="14" r="14" fill="url(#heroMoon)" />
              <circle cx="14" cy="14" r="9" fill="#E0E7FF" />
              <circle cx="17" cy="12" r="7" fill="hsl(var(--background))" opacity="0.7" />
            </svg>
          </div>

          {/* Stars */}
          {[
            { x: "8%", y: "8%", s: 2, d: "0s" }, { x: "22%", y: "18%", s: 1.5, d: "0.5s" },
            { x: "40%", y: "6%", s: 2.5, d: "1s" }, { x: "55%", y: "15%", s: 1.5, d: "1.5s" },
            { x: "70%", y: "5%", s: 2, d: "0.3s" }, { x: "85%", y: "20%", s: 1.5, d: "0.8s" },
          ].map((st, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ left: st.x, top: st.y, width: st.s, height: st.s, animation: `twinkle 2.5s ease-in-out ${st.d} infinite` }} />
          ))}

          {/* Fireflies */}
          {[
            { x: "15%", y: "60%", dur: "4s", delay: "0s" },
            { x: "45%", y: "55%", dur: "5s", delay: "1s" },
            { x: "75%", y: "65%", dur: "4.5s", delay: "2s" },
            { x: "60%", y: "50%", dur: "5.5s", delay: "1.5s" },
          ].map((f, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ left: f.x, top: f.y, background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite` }} />
          ))}

          {/* Owl silhouette */}
          <div className="absolute" style={{ top: "42%", left: "82%" }}>
            <svg width="10" height="12" viewBox="0 0 14 18" className="text-foreground/15">
              <ellipse cx="7" cy="7" rx="6" ry="7" fill="currentColor" />
              <ellipse cx="7" cy="14" rx="5" ry="4" fill="currentColor" />
              <circle cx="5" cy="6" r="1.5" fill="#FBBF24" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="9" cy="6" r="1.5" fill="#FBBF24" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </>
      )}

      {/* === WEATHER OVERLAYS (apply to all times) === */}
      {weather === "cloudy" && time !== "night" && (
        <>
          <div className="absolute top-[15%] opacity-40" style={{ animation: "heroCloudDrift 18s linear infinite" }}>
            <svg width="70" height="25" viewBox="0 0 70 25" className="text-white dark:text-white/30">
              <ellipse cx="35" cy="18" rx="33" ry="7" fill="currentColor" />
              <ellipse cx="24" cy="12" rx="16" ry="10" fill="currentColor" />
              <ellipse cx="44" cy="11" rx="14" ry="9" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-[32%] opacity-30" style={{ animation: "heroCloudDrift 25s linear 6s infinite" }}>
            <svg width="50" height="18" viewBox="0 0 50 18" className="text-white dark:text-white/20">
              <ellipse cx="25" cy="12" rx="23" ry="6" fill="currentColor" />
              <ellipse cx="17" cy="8" rx="12" ry="7" fill="currentColor" />
              <ellipse cx="33" cy="7" rx="10" ry="6" fill="currentColor" />
            </svg>
          </div>
        </>
      )}

      {weather === "windy" && (
        <div className="absolute inset-0">
          {[
            { y: "35%", dur: "3s", delay: "0s" },
            { y: "50%", dur: "4s", delay: "1.5s" },
            { y: "65%", dur: "3.5s", delay: "0.5s" },
          ].map((w, i) => (
            <div key={i} className="absolute" style={{ top: w.y, animation: `windStreak ${w.dur} linear ${w.delay} infinite` }}>
              <svg width="30" height="3" viewBox="0 0 30 3" className="text-foreground/10">
                <path d="M0,1.5 Q10,0 20,1.5 Q25,3 30,1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === SHARED: Hills silhouette === */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-[35%]" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,60 L0,35 Q50,15 100,30 Q150,10 200,25 Q250,8 300,28 Q350,12 400,30 L400,60 Z" className={hillColors[time][0]} />
        <path d="M0,60 L0,42 Q60,28 120,38 Q180,22 240,35 Q300,20 360,34 L400,38 L400,60 Z" className={hillColors[time][1]} />
      </svg>

      {/* Keyframes */}
      <style>{`
        @keyframes sunFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes fireflyFloat { 0% { transform: translate(0, 0); } 25% { transform: translate(8px, -6px); } 50% { transform: translate(-4px, -10px); } 75% { transform: translate(6px, -3px); } 100% { transform: translate(0, 0); } }
        @keyframes fireflyGlow { 0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #FBBF24; } 50% { opacity: 1; box-shadow: 0 0 10px 3px #FBBF24; } }
        @keyframes heroCloudDrift { 0% { transform: translateX(-80px); } 100% { transform: translateX(calc(100vw + 80px)); } }
        @keyframes heroBirdFly { 0% { left: -5%; } 100% { left: 105%; } }
        @keyframes butterflyFloat {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, -12px) rotate(6deg); }
          50% { transform: translate(-6px, -20px) rotate(-4deg); }
          75% { transform: translate(12px, -8px) rotate(8deg); }
          100% { transform: translate(0, 0); }
        }
        @keyframes dragonflyDart {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(15px, -8px); }
          40% { transform: translate(-10px, 5px); }
          60% { transform: translate(20px, -3px); }
          80% { transform: translate(-5px, 8px); }
        }
        @keyframes dawnRise { 0% { transform: translateY(20px); opacity: 0.3; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes dewSparkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes sunsetSink { 0% { transform: translateY(0); } 100% { transform: translateY(8px); opacity: 0.7; } }
        @keyframes windStreak { 0% { left: -10%; opacity: 0; } 20% { opacity: 0.4; } 80% { opacity: 0.4; } 100% { left: 110%; opacity: 0; } }
      `}</style>
    </div>
  );
};

export default HeroScenery;

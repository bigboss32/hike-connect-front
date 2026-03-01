/**
 * HeroScenery — Animated mini-landscape for the home hero, changes by time of day.
 * Morning: rising sun, birds, soft clouds
 * Afternoon: warm sun, drifting clouds
 * Night: moon, twinkling stars, fireflies
 */

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "night";
};

const HeroScenery = () => {
  const time = getTimeOfDay();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky */}
      {time === "morning" && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/30 via-sky-300/20 to-emerald-200/20 dark:from-amber-900/20 dark:via-sky-900/15 dark:to-emerald-900/15" />
      )}
      {time === "afternoon" && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300/25 via-amber-200/20 to-emerald-200/15 dark:from-orange-900/20 dark:via-amber-900/15 dark:to-emerald-900/10" />
      )}
      {time === "night" && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-800/25 to-emerald-900/20 dark:from-indigo-950/40 dark:via-slate-900/30 dark:to-emerald-950/25" />
      )}

      {/* Sun (morning/afternoon) */}
      {time !== "night" && (
        <div
          className="absolute animate-pulse"
          style={{
            top: time === "morning" ? "18%" : "12%",
            right: time === "morning" ? "12%" : "18%",
            animation: "sunFloat 6s ease-in-out infinite",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36">
            <defs>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor={time === "morning" ? "#FDE68A" : "#FDBA74"} stopOpacity="0.9" />
                <stop offset="60%" stopColor={time === "morning" ? "#F59E0B" : "#F97316"} stopOpacity="0.6" />
                <stop offset="100%" stopColor={time === "morning" ? "#F59E0B" : "#EA580C"} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="18" cy="18" r="18" fill="url(#sunGlow)" />
            <circle cx="18" cy="18" r="8" fill={time === "morning" ? "#FBBF24" : "#FB923C"} />
            {/* Rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="18"
                y1="18"
                x2={18 + Math.cos((angle * Math.PI) / 180) * 16}
                y2={18 + Math.sin((angle * Math.PI) / 180) * 16}
                stroke={time === "morning" ? "#FBBF24" : "#FB923C"}
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.5;0.2"
                  dur={`${2 + (angle % 3)}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </svg>
        </div>
      )}

      {/* Moon (night) */}
      {time === "night" && (
        <div className="absolute" style={{ top: "10%", right: "14%" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" style={{ animation: "sunFloat 8s ease-in-out infinite" }}>
            <defs>
              <radialGradient id="moonGlow">
                <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="14" cy="14" r="14" fill="url(#moonGlow)" />
            <circle cx="14" cy="14" r="9" fill="#E0E7FF" />
            <circle cx="11" cy="11" r="8" fill="transparent" stroke="none" />
            {/* Crescent effect */}
            <circle cx="17" cy="12" r="7" fill="hsl(var(--background))" opacity="0.7" />
          </svg>
        </div>
      )}

      {/* Stars (night) */}
      {time === "night" && (
        <>
          {[
            { x: "8%", y: "8%", size: 2, delay: "0s" },
            { x: "22%", y: "18%", size: 1.5, delay: "0.5s" },
            { x: "40%", y: "6%", size: 2.5, delay: "1s" },
            { x: "55%", y: "15%", size: 1.5, delay: "1.5s" },
            { x: "70%", y: "5%", size: 2, delay: "0.3s" },
            { x: "85%", y: "20%", size: 1.5, delay: "0.8s" },
            { x: "30%", y: "22%", size: 1, delay: "1.2s" },
            { x: "95%", y: "10%", size: 2, delay: "0.6s" },
          ].map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                animation: `twinkle 2.5s ease-in-out ${star.delay} infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Fireflies (night) */}
      {time === "night" && (
        <>
          {[
            { x: "15%", y: "60%", dur: "4s", delay: "0s" },
            { x: "45%", y: "55%", dur: "5s", delay: "1s" },
            { x: "75%", y: "65%", dur: "4.5s", delay: "2s" },
            { x: "30%", y: "70%", dur: "3.5s", delay: "0.5s" },
            { x: "60%", y: "50%", dur: "5.5s", delay: "1.5s" },
          ].map((f, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: f.x,
                top: f.y,
                background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)",
                animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, twinkle 2s ease-in-out ${f.delay} infinite`,
              }}
            />
          ))}
        </>
      )}

      {/* Clouds (morning/afternoon) */}
      {time !== "night" && (
        <>
          <div className="absolute top-[15%] opacity-40" style={{ animation: "heroCloudDrift 20s linear infinite" }}>
            <svg width="60" height="20" viewBox="0 0 60 20" className="text-white dark:text-white/30">
              <ellipse cx="30" cy="14" rx="28" ry="6" fill="currentColor" />
              <ellipse cx="20" cy="10" rx="14" ry="8" fill="currentColor" />
              <ellipse cx="38" cy="9" rx="12" ry="7" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-[35%] opacity-25" style={{ animation: "heroCloudDrift 28s linear 5s infinite" }}>
            <svg width="45" height="16" viewBox="0 0 45 16" className="text-white dark:text-white/20">
              <ellipse cx="22" cy="11" rx="20" ry="5" fill="currentColor" />
              <ellipse cx="15" cy="7" rx="10" ry="6" fill="currentColor" />
              <ellipse cx="30" cy="7" rx="9" ry="5" fill="currentColor" />
            </svg>
          </div>
        </>
      )}

      {/* Birds (morning) */}
      {time === "morning" && (
        <>
          {[
            { y: "20%", dur: "7s", delay: "0s", size: 10 },
            { y: "30%", dur: "9s", delay: "3s", size: 8 },
          ].map((b, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: b.y,
                animation: `heroBirdFly ${b.dur} linear ${b.delay} infinite`,
              }}
            >
              <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/30">
                <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Mini hills silhouette at bottom */}
      <svg className="absolute bottom-0 left-0 right-0 w-full h-[35%]" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path
          d="M0,60 L0,35 Q50,15 100,30 Q150,10 200,25 Q250,8 300,28 Q350,12 400,30 L400,60 Z"
          className={
            time === "night"
              ? "fill-emerald-900/30 dark:fill-emerald-950/40"
              : "fill-emerald-700/15 dark:fill-emerald-900/25"
          }
        />
        <path
          d="M0,60 L0,42 Q60,28 120,38 Q180,22 240,35 Q300,20 360,34 L400,38 L400,60 Z"
          className={
            time === "night"
              ? "fill-emerald-800/25 dark:fill-emerald-900/35"
              : "fill-emerald-600/10 dark:fill-emerald-800/20"
          }
        />
      </svg>

      {/* Keyframes */}
      <style>{`
        @keyframes sunFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes fireflyFloat {
          0% { transform: translate(0, 0); }
          25% { transform: translate(8px, -6px); }
          50% { transform: translate(-4px, -10px); }
          75% { transform: translate(6px, -3px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes heroCloudDrift {
          0% { transform: translateX(-80px); }
          100% { transform: translateX(calc(100vw + 80px)); }
        }
        @keyframes heroBirdFly {
          0% { left: -5%; }
          100% { left: 105%; }
        }
      `}</style>
    </div>
  );
};

export default HeroScenery;

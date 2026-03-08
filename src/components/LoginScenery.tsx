/**
 * LoginScenery — Full-page animated nature background for Auth.
 * Dynamically selects one of several scenarios on each visit.
 * Scenarios: sunny, rainy, night, autumn, misty
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type Scenario = "sunny" | "rainy" | "night" | "autumn" | "misty";

const SCENARIOS: Scenario[] = ["sunny", "rainy", "night", "autumn", "misty"];

const LoginScenery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  // Pick a random scenario on mount
  const scenario = useMemo<Scenario>(() => {
    return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
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

  const px = (depth: number) => (mouse.x - 0.5) * depth * 30;
  const py = (depth: number) => (mouse.y - 0.5) * depth * 20;

  // Scenario-based gradients
  const skyGradient = {
    sunny: "from-sky-400 via-sky-200 to-emerald-100 dark:from-sky-900 dark:via-indigo-950 dark:to-emerald-950",
    rainy: "from-slate-500 via-slate-400 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700",
    night: "from-indigo-950 via-slate-900 to-emerald-950",
    autumn: "from-orange-300 via-amber-200 to-yellow-100 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950",
    misty: "from-slate-300 via-gray-200 to-emerald-100 dark:from-slate-800 dark:via-gray-700 dark:to-emerald-900",
  };

  const mountainColors = {
    sunny: { far: "fill-emerald-800/30 dark:fill-emerald-950/40", mid: "fill-emerald-700/50 dark:fill-emerald-900/50", near: "fill-emerald-600/60 dark:fill-emerald-800/60" },
    rainy: { far: "fill-slate-700/40 dark:fill-slate-900/50", mid: "fill-slate-600/50 dark:fill-slate-800/60", near: "fill-slate-500/60 dark:fill-slate-700/70" },
    night: { far: "fill-emerald-950/50", mid: "fill-emerald-900/60", near: "fill-emerald-800/70" },
    autumn: { far: "fill-orange-800/30 dark:fill-orange-950/40", mid: "fill-amber-700/40 dark:fill-amber-900/50", near: "fill-yellow-700/50 dark:fill-yellow-800/60" },
    misty: { far: "fill-gray-600/20 dark:fill-gray-800/30", mid: "fill-gray-500/30 dark:fill-gray-700/40", near: "fill-gray-400/40 dark:fill-gray-600/50" },
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      style={{ containerType: "inline-size" }}
    >
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyGradient[scenario]} transition-colors duration-500`} />

      {/* === SUNNY SCENARIO === */}
      {scenario === "sunny" && (
        <>
          {/* Sun */}
          <div
            className="absolute transition-transform duration-300 ease-out"
            style={{ top: "10%", right: "15%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)` }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" style={{ animation: "sunFloat 6s ease-in-out infinite" }}>
              <defs>
                <radialGradient id="sunGlow">
                  <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="25" cy="25" r="25" fill="url(#sunGlow)" />
              <circle cx="25" cy="25" r="12" fill="#FBBF24" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1="25" y1="25"
                  x2={25 + Math.cos((angle * Math.PI) / 180) * 22}
                  y2={25 + Math.sin((angle * Math.PI) / 180) * 22}
                  stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
                />
              ))}
            </svg>
          </div>

          {/* Butterflies */}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}>
            {[
              { x: "12%", y: "35%", color: "#F59E0B", dur: "6s", delay: "0s" },
              { x: "70%", y: "30%", color: "#A78BFA", dur: "7s", delay: "1.5s" },
              { x: "40%", y: "40%", color: "#FB923C", dur: "5.5s", delay: "3s" },
            ].map((bf, i) => (
              <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur} ease-in-out ${bf.delay} infinite` }}>
                <svg width="14" height="10" viewBox="0 0 14 10" opacity="0.7">
                  <ellipse cx="4" cy="5" rx="3.5" ry="4" fill={bf.color}><animate attributeName="rx" values="3.5;1.5;3.5" dur="0.4s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="10" cy="5" rx="3.5" ry="4" fill={bf.color}><animate attributeName="rx" values="3.5;1.5;3.5" dur="0.4s" repeatCount="indefinite" /></ellipse>
                  <rect x="6.5" y="2" width="1" height="6" rx="0.5" fill={bf.color} opacity="0.8" />
                </svg>
              </div>
            ))}
          </div>

          {/* Birds */}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.12)}px)` }}>
            {[
              { top: "12%", delay: "0s", dur: "8s", size: 14 },
              { top: "8%", delay: "3s", dur: "10s", size: 11 },
            ].map((b, i) => (
              <div key={i} className="absolute" style={{ top: b.top, animation: `birdFly ${b.dur} linear ${b.delay} infinite` }}>
                <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/40">
                  <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            ))}
          </div>

          {/* Light clouds */}
          <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.08)}px)` }}>
            <div className="absolute top-[18%] animate-cloudDrift1">
              <svg width="60" height="22" viewBox="0 0 60 22" className="text-white/40 dark:text-white/15">
                <ellipse cx="30" cy="15" rx="28" ry="7" fill="currentColor" />
                <ellipse cx="20" cy="10" rx="14" ry="9" fill="currentColor" />
                <ellipse cx="38" cy="9" rx="12" ry="8" fill="currentColor" />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* === RAINY SCENARIO === */}
      {scenario === "rainy" && (
        <>
          {/* Heavy clouds */}
          <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            {[
              { top: "5%", scale: 1.2, delay: "0s" },
              { top: "12%", scale: 1, delay: "8s" },
              { top: "8%", scale: 0.9, delay: "15s" },
            ].map((c, i) => (
              <div key={i} className="absolute animate-cloudDrift1" style={{ top: c.top, transform: `scale(${c.scale})`, animationDelay: c.delay }}>
                <svg width="100" height="40" viewBox="0 0 100 40" className="text-slate-400/70 dark:text-slate-600/80">
                  <ellipse cx="50" cy="28" rx="48" ry="12" fill="currentColor" />
                  <ellipse cx="35" cy="18" rx="25" ry="16" fill="currentColor" />
                  <ellipse cx="65" cy="16" rx="22" ry="14" fill="currentColor" />
                </svg>
              </div>
            ))}
          </div>

          {/* Rain */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-slate-400/50 dark:bg-slate-300/30 animate-rainDrop"
                style={{
                  left: `${3 + (i * 3.3) % 94}%`,
                  top: `${-5 + (i * 5) % 20}%`,
                  height: "18px",
                  animationDelay: `${(i * 0.08) % 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Puddle ripples */}
          <div className="absolute bottom-[18%] left-[20%]">
            {[0, 1, 2].map((r) => (
              <div key={r} className="absolute w-8 h-2 border border-slate-400/30 rounded-full" style={{ animation: `ripple 2s ease-out ${r * 0.6}s infinite` }} />
            ))}
          </div>
          <div className="absolute bottom-[22%] left-[65%]">
            {[0, 1].map((r) => (
              <div key={r} className="absolute w-6 h-1.5 border border-slate-400/20 rounded-full" style={{ animation: `ripple 2.5s ease-out ${r * 0.8}s infinite` }} />
            ))}
          </div>
        </>
      )}

      {/* === NIGHT SCENARIO === */}
      {scenario === "night" && (
        <>
          {/* Moon */}
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "8%", right: "12%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)` }}>
            <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "sunFloat 8s ease-in-out infinite" }}>
              <defs>
                <radialGradient id="moonGlow">
                  <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#moonGlow)" />
              <circle cx="20" cy="20" r="12" fill="#E0E7FF" />
              <circle cx="25" cy="17" r="10" fill="#1e1b4b" opacity="0.6" />
            </svg>
          </div>

          {/* Stars */}
          {[
            { x: "8%", y: "10%", size: 2.5, delay: "0s" },
            { x: "22%", y: "18%", size: 1.5, delay: "0.5s" },
            { x: "35%", y: "8%", size: 3, delay: "1s" },
            { x: "55%", y: "15%", size: 2, delay: "1.5s" },
            { x: "75%", y: "6%", size: 2.5, delay: "0.3s" },
            { x: "88%", y: "22%", size: 1.5, delay: "0.8s" },
            { x: "45%", y: "25%", size: 2, delay: "1.2s" },
            { x: "15%", y: "28%", size: 1.5, delay: "0.6s" },
          ].map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: star.x, top: star.y, width: star.size, height: star.size, animation: `twinkle 2.5s ease-in-out ${star.delay} infinite` }}
            />
          ))}

          {/* Fireflies */}
          <div className="absolute inset-0 transition-transform duration-150 ease-out" style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}>
            {[
              { x: "15%", y: "50%", dur: "4s", delay: "0s" },
              { x: "45%", y: "45%", dur: "5s", delay: "1s" },
              { x: "75%", y: "52%", dur: "4.5s", delay: "2s" },
              { x: "30%", y: "58%", dur: "3.5s", delay: "0.5s" },
              { x: "60%", y: "42%", dur: "5.5s", delay: "1.5s" },
              { x: "85%", y: "48%", dur: "4s", delay: "3s" },
            ].map((f, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ left: f.x, top: f.y, background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite` }}
              />
            ))}
          </div>

          {/* Shooting star */}
          <div className="absolute top-[12%] left-[10%]" style={{ animation: "shootingStar 8s linear 2s infinite" }}>
            <div className="w-1 h-1 bg-white rounded-full" style={{ boxShadow: "0 0 6px 2px white, 20px 0 15px 1px rgba(255,255,255,0.3), 40px 0 10px 0 rgba(255,255,255,0.1)" }} />
          </div>
        </>
      )}

      {/* === AUTUMN SCENARIO === */}
      {scenario === "autumn" && (
        <>
          {/* Soft afternoon sun */}
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "12%", right: "20%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)` }}>
            <svg width="45" height="45" viewBox="0 0 45 45" style={{ animation: "sunFloat 6s ease-in-out infinite" }}>
              <defs>
                <radialGradient id="autumnSun">
                  <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#F97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="22" cy="22" r="22" fill="url(#autumnSun)" />
              <circle cx="22" cy="22" r="10" fill="#FB923C" />
            </svg>
          </div>

          {/* Falling leaves */}
          <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.2)}px, ${py(0.1)}px)` }}>
            {[
              { x: "8%", delay: "0s", dur: "7s", color: "#DC2626" },
              { x: "18%", delay: "1.5s", dur: "8s", color: "#D97706" },
              { x: "32%", delay: "0.8s", dur: "6.5s", color: "#B45309" },
              { x: "45%", delay: "2.5s", dur: "9s", color: "#F59E0B" },
              { x: "58%", delay: "0.3s", dur: "7.5s", color: "#EA580C" },
              { x: "70%", delay: "3s", dur: "8.5s", color: "#92400E" },
              { x: "82%", delay: "1s", dur: "7s", color: "#DC2626" },
              { x: "92%", delay: "2s", dur: "6s", color: "#D97706" },
            ].map((leaf, i) => (
              <div key={i} className="absolute" style={{ left: leaf.x, animation: `leafFall ${leaf.dur} ease-in-out ${leaf.delay} infinite` }}>
                <svg width="12" height="14" viewBox="0 0 12 14" opacity="0.7">
                  <path d="M6,0 Q11,4 8,9 Q6,14 4,9 Q1,4 6,0Z" fill={leaf.color}>
                    <animateTransform attributeName="transform" type="rotate" values="0 6 7;30 6 7;-20 6 7;0 6 7" dur={`${parseFloat(leaf.dur) * 0.6}s`} repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            ))}
          </div>

          {/* Wind effect — subtle horizontal leaves */}
          <div className="absolute inset-0">
            {[
              { y: "35%", delay: "0s", dur: "4s" },
              { y: "50%", delay: "2s", dur: "5s" },
            ].map((w, i) => (
              <div key={i} className="absolute" style={{ top: w.y, animation: `windLeaf ${w.dur} linear ${w.delay} infinite` }}>
                <svg width="10" height="6" viewBox="0 0 10 6" className="text-amber-600/50">
                  <ellipse cx="5" cy="3" rx="5" ry="3" fill="currentColor" />
                </svg>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === MISTY SCENARIO === */}
      {scenario === "misty" && (
        <>
          {/* Fog layers */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] w-full h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent dark:via-gray-400/10" style={{ animation: "fogDrift 15s ease-in-out infinite" }} />
            <div className="absolute top-[40%] w-full h-24 bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-gray-400/15" style={{ animation: "fogDrift 20s ease-in-out 3s infinite reverse" }} />
            <div className="absolute top-[55%] w-full h-16 bg-gradient-to-b from-transparent via-white/25 to-transparent dark:via-gray-400/12" style={{ animation: "fogDrift 18s ease-in-out 6s infinite" }} />
          </div>

          {/* Soft diffused light */}
          <div className="absolute top-[5%] right-[25%] w-32 h-32 rounded-full bg-white/20 dark:bg-white/10 blur-3xl" />

          {/* Subtle rain/drizzle */}
          <div className="absolute inset-0">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px bg-gray-400/30 dark:bg-gray-300/20 animate-rainDrop"
                style={{ left: `${8 + (i * 8) % 84}%`, top: `${-3 + (i * 6) % 15}%`, height: "10px", animationDelay: `${(i * 0.15) % 0.8}s`, animationDuration: "1.5s" }}
              />
            ))}
          </div>

          {/* Distant bird silhouette (slow) */}
          <div className="absolute" style={{ top: "25%", animation: "birdFly 20s linear 5s infinite" }}>
            <svg width="12" height="6" viewBox="0 0 20 10" className="text-foreground/20">
              <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* === SHARED: Mountains === */}
      <svg
        className="absolute w-full transition-transform duration-500 ease-out"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        style={{ top: "30%", height: "72%", left: 0, right: 0, position: "absolute", transform: `translate(${px(0.05)}px, ${py(0.03)}px)` }}
      >
        <path d="M0,200 L0,90 L40,55 L80,75 L120,40 L170,65 L220,30 L270,55 L310,35 L360,60 L400,45 L400,200 Z" className={mountainColors[scenario].far} />
        <path d="M0,200 L0,100 L35,70 L75,85 L110,55 L160,75 L200,45 L250,65 L290,50 L340,70 L380,55 L400,65 L400,200 Z" className={mountainColors[scenario].mid} />
        <path d="M0,200 L0,115 L25,105 L50,110 L80,100 L110,107 L140,98 L175,104 L210,96 L245,102 L280,94 L310,100 L345,93 L375,99 L400,95 L400,200 Z" className={mountainColors[scenario].near} />
        <rect x="0" y="130" width="400" height="70" className={scenario === "night" ? "fill-emerald-950/40" : "fill-emerald-500/20 dark:fill-emerald-900/30"} />

        {/* River (not in misty) */}
        {scenario !== "misty" && (
          <>
            <path d="M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152" fill="none" stroke="hsl(200, 60%, 65%)" strokeWidth="3" opacity={scenario === "night" ? "0.2" : "0.35"}>
              <animate attributeName="d" values="M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152;M0,153 Q60,160 120,152 Q180,146 240,155 Q300,162 360,152 Q380,148 400,155;M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152" dur="4s" repeatCount="indefinite" />
            </path>
          </>
        )}

        <defs>
          <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="hsl(150 25% 8%)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="0" y="140" width="400" height="60" fill="url(#groundFade)" className="dark:opacity-100 opacity-0" />
      </svg>

      {/* === SHARED: Trees === */}
      <div className="absolute inset-0 transition-transform duration-400 ease-out" style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
        <div className="absolute left-[8%]" style={{ top: "44%" }}>
          <svg width="16" height="26" viewBox="0 0 16 26">
            <polygon points="8,0 16,18 0,18" className={scenario === "autumn" ? "fill-orange-700 dark:fill-orange-800" : scenario === "night" ? "fill-emerald-900" : "fill-emerald-700 dark:fill-emerald-800"} />
            <rect x="6" y="17" width="4" height="9" className="fill-amber-900/60" />
          </svg>
        </div>
        <div className="absolute left-[85%]" style={{ top: "42%" }}>
          <svg width="14" height="22" viewBox="0 0 14 22">
            <polygon points="7,0 14,15 0,15" className={scenario === "autumn" ? "fill-red-600 dark:fill-red-700" : scenario === "night" ? "fill-emerald-800" : "fill-emerald-600 dark:fill-emerald-700"} />
            <rect x="5" y="14" width="4" height="8" className="fill-amber-900/50" />
          </svg>
        </div>
        <div className="absolute left-[30%]" style={{ top: "43%" }}>
          <svg width="13" height="20" viewBox="0 0 13 20">
            <polygon points="6.5,0 13,14 0,14" className={scenario === "autumn" ? "fill-amber-600 dark:fill-amber-700" : scenario === "night" ? "fill-emerald-850" : "fill-emerald-600/80 dark:fill-emerald-700/80"} />
            <rect x="5" y="13" width="3" height="7" className="fill-amber-900/50" />
          </svg>
        </div>
        <div className="absolute left-[55%]" style={{ top: "46%" }}>
          <svg width="11" height="18" viewBox="0 0 11 18">
            <polygon points="5.5,0 11,12 0,12" className={scenario === "autumn" ? "fill-yellow-600/70 dark:fill-yellow-700/70" : scenario === "night" ? "fill-emerald-800/70" : "fill-emerald-700/70 dark:fill-emerald-800/70"} />
            <rect x="4" y="11" width="3" height="7" className="fill-amber-900/40" />
          </svg>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes birdFly { 0% { left: -5%; } 100% { left: 105%; } }
        @keyframes sunFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes butterflyFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(12px, -15px) rotate(8deg); }
          50% { transform: translate(-8px, -25px) rotate(-5deg); }
          75% { transform: translate(15px, -10px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes leafFall {
          0% { top: -8%; opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.5; }
          100% { top: 65%; opacity: 0; }
        }
        @keyframes windLeaf {
          0% { left: -5%; opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { left: 105%; opacity: 0; }
        }
        @keyframes fireflyFloat {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, -8px); }
          50% { transform: translate(-6px, -14px); }
          75% { transform: translate(8px, -4px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fireflyGlow {
          0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #FBBF24; }
          50% { opacity: 1; box-shadow: 0 0 12px 4px #FBBF24; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes shootingStar {
          0% { left: 10%; top: 12%; opacity: 0; }
          2% { opacity: 1; }
          15% { left: 60%; top: 25%; opacity: 0; }
          100% { left: 60%; top: 25%; opacity: 0; }
        }
        @keyframes ripple {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes fogDrift {
          0%, 100% { transform: translateX(-20px); }
          50% { transform: translateX(20px); }
        }
      `}</style>
    </div>
  );
};

export default LoginScenery;

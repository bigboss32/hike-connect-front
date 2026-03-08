/**
 * LoginScenery — Full-page animated nature background for Auth.
 * Mountains, drifting clouds, birds, rain, butterflies, falling leaves,
 * fireflies, flowing river, and interactive parallax on mouse/touch.
 */
import { useEffect, useRef, useState, useCallback } from "react";

const LoginScenery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

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

  // Parallax offset helpers (depth 0-1, higher = more movement)
  const px = (depth: number) => (mouse.x - 0.5) * depth * 30;
  const py = (depth: number) => (mouse.y - 0.5) * depth * 20;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      style={{ containerType: "inline-size" }}
    >
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 dark:from-slate-900 dark:via-indigo-950 dark:to-emerald-950 transition-colors duration-500" />

      {/* Clouds — parallax layer 0.15 */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.15)}px, ${py(0.08)}px)` }}
      >
        <div className="absolute top-[8%] animate-cloudDrift1">
          <svg width="80" height="30" viewBox="0 0 80 30" className="text-white/50 dark:text-white/15">
            <ellipse cx="40" cy="20" rx="36" ry="10" fill="currentColor" />
            <ellipse cx="28" cy="15" rx="20" ry="12" fill="currentColor" />
            <ellipse cx="50" cy="13" rx="18" ry="11" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-[16%] animate-cloudDrift2">
          <svg width="55" height="22" viewBox="0 0 55 22" className="text-white/35 dark:text-white/10">
            <ellipse cx="28" cy="15" rx="24" ry="7" fill="currentColor" />
            <ellipse cx="18" cy="10" rx="14" ry="9" fill="currentColor" />
            <ellipse cx="36" cy="9" rx="12" ry="8" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-[22%] animate-cloudDrift3">
          <svg width="65" height="24" viewBox="0 0 65 24" className="text-white/40 dark:text-white/12">
            <ellipse cx="32" cy="16" rx="30" ry="8" fill="currentColor" />
            <ellipse cx="22" cy="11" rx="16" ry="10" fill="currentColor" />
            <ellipse cx="42" cy="10" rx="14" ry="9" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Birds — parallax layer 0.25 */}
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.25)}px, ${py(0.12)}px)` }}
      >
        {[
          { top: "10%", delay: "0s", dur: "8s", size: 14 },
          { top: "6%", delay: "2s", dur: "10s", size: 11 },
          { top: "14%", delay: "4.5s", dur: "9s", size: 12 },
          { top: "18%", delay: "7s", dur: "11s", size: 10 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{ top: b.top, animation: `birdFly ${b.dur} linear ${b.delay} infinite` }}
          >
            <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/40">
              <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        ))}
      </div>

      {/* Butterflies */}
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}
      >
        {[
          { x: "12%", y: "35%", color: "#F59E0B", dur: "6s", delay: "0s" },
          { x: "70%", y: "30%", color: "#A78BFA", dur: "7s", delay: "1.5s" },
          { x: "40%", y: "40%", color: "#FB923C", dur: "5.5s", delay: "3s" },
          { x: "85%", y: "28%", color: "#34D399", dur: "8s", delay: "2s" },
        ].map((bf, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: bf.x,
              top: bf.y,
              animation: `butterflyFloat ${bf.dur} ease-in-out ${bf.delay} infinite`,
            }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" opacity="0.7">
              <ellipse cx="4" cy="5" rx="3.5" ry="4" fill={bf.color}>
                <animate attributeName="rx" values="3.5;1.5;3.5" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="10" cy="5" rx="3.5" ry="4" fill={bf.color}>
                <animate attributeName="rx" values="3.5;1.5;3.5" dur="0.4s" repeatCount="indefinite" />
              </ellipse>
              <rect x="6.5" y="2" width="1" height="6" rx="0.5" fill={bf.color} opacity="0.8" />
            </svg>
          </div>
        ))}
      </div>

      {/* Rain */}
      <div className="absolute inset-0 animate-rainAppear">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-white/20 dark:bg-white/15 animate-rainDrop"
            style={{
              left: `${5 + (i * 5.2) % 90}%`,
              top: `${-2 + (i * 7) % 15}%`,
              height: "12px",
              animationDelay: `${(i * 0.12) % 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Falling leaves — parallax 0.2 */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${px(0.2)}px, ${py(0.1)}px)` }}
      >
        {[
          { x: "10%", delay: "0s", dur: "7s", color: "#D97706" },
          { x: "25%", delay: "2s", dur: "8s", color: "#B45309" },
          { x: "50%", delay: "1s", dur: "6.5s", color: "#DC2626" },
          { x: "65%", delay: "3.5s", dur: "9s", color: "#F59E0B" },
          { x: "80%", delay: "0.5s", dur: "7.5s", color: "#92400E" },
          { x: "38%", delay: "4s", dur: "8.5s", color: "#EA580C" },
        ].map((leaf, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: leaf.x,
              animation: `leafFall ${leaf.dur} ease-in-out ${leaf.delay} infinite`,
            }}
          >
            <svg width="10" height="12" viewBox="0 0 10 12" opacity="0.6">
              <path
                d="M5,0 Q9,3 7,7 Q5,12 3,7 Q1,3 5,0Z"
                fill={leaf.color}
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 5 6;25 5 6;-15 5 6;0 5 6"
                  dur={`${parseFloat(leaf.dur) * 0.7}s`}
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        ))}
      </div>

      {/* Mountains — parallax layer 0.05 (background) */}
      <svg
        className="absolute w-full transition-transform duration-500 ease-out"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        style={{
          top: "30%",
          height: "72%",
          left: 0,
          right: 0,
          position: "absolute",
          transform: `translate(${px(0.05)}px, ${py(0.03)}px)`,
        }}
      >
        <path
          d="M0,200 L0,90 L40,55 L80,75 L120,40 L170,65 L220,30 L270,55 L310,35 L360,60 L400,45 L400,200 Z"
          className="fill-emerald-800/30 dark:fill-emerald-950/40"
        />
        <path
          d="M0,200 L0,100 L35,70 L75,85 L110,55 L160,75 L200,45 L250,65 L290,50 L340,70 L380,55 L400,65 L400,200 Z"
          className="fill-emerald-700/50 dark:fill-emerald-900/50"
        />
        <path
          d="M0,200 L0,115 L25,105 L50,110 L80,100 L110,107 L140,98 L175,104 L210,96 L245,102 L280,94 L310,100 L345,93 L375,99 L400,95 L400,200 Z"
          className="fill-emerald-600/60 dark:fill-emerald-800/60"
        />
        <rect x="0" y="130" width="400" height="70" className="fill-emerald-500/20 dark:fill-emerald-900/30" />

        {/* River flowing at the base */}
        <path
          d="M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152"
          fill="none"
          stroke="hsl(200, 60%, 65%)"
          strokeWidth="3"
          opacity="0.35"
          className="dark:opacity-25"
        >
          <animate
            attributeName="d"
            values="M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152;M0,153 Q60,160 120,152 Q180,146 240,155 Q300,162 360,152 Q380,148 400,155;M0,155 Q60,148 120,155 Q180,162 240,153 Q300,146 360,155 Q380,158 400,152"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,158 Q60,152 120,158 Q180,165 240,157 Q300,150 360,158 Q380,161 400,156"
          fill="none"
          stroke="hsl(200, 50%, 75%)"
          strokeWidth="1.5"
          opacity="0.25"
          className="dark:opacity-15"
        >
          <animate
            attributeName="d"
            values="M0,158 Q60,152 120,158 Q180,165 240,157 Q300,150 360,158 Q380,161 400,156;M0,157 Q60,164 120,156 Q180,150 240,158 Q300,165 360,156 Q380,152 400,159;M0,158 Q60,152 120,158 Q180,165 240,157 Q300,150 360,158 Q380,161 400,156"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </path>

        <defs>
          <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="hsl(150 25% 8%)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="0" y="140" width="400" height="60" fill="url(#groundFade)" className="dark:opacity-100 opacity-0" />
      </svg>

      {/* Trees — parallax 0.1 */}
      <div
        className="absolute inset-0 transition-transform duration-400 ease-out"
        style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}
      >
        <div className="absolute left-[8%]" style={{ top: "44%" }}>
          <svg width="16" height="26" viewBox="0 0 16 26">
            <polygon points="8,0 16,18 0,18" className="fill-emerald-700 dark:fill-emerald-800" />
            <rect x="6" y="17" width="4" height="9" className="fill-amber-900/60" />
          </svg>
        </div>
        <div className="absolute left-[85%]" style={{ top: "42%" }}>
          <svg width="14" height="22" viewBox="0 0 14 22">
            <polygon points="7,0 14,15 0,15" className="fill-emerald-600 dark:fill-emerald-700" />
            <rect x="5" y="14" width="4" height="8" className="fill-amber-900/50" />
          </svg>
        </div>
        <div className="absolute left-[55%]" style={{ top: "46%" }}>
          <svg width="11" height="18" viewBox="0 0 11 18">
            <polygon points="5.5,0 11,12 0,12" className="fill-emerald-700/70 dark:fill-emerald-800/70" />
            <rect x="4" y="11" width="3" height="7" className="fill-amber-900/40" />
          </svg>
        </div>
        {/* Extra trees */}
        <div className="absolute left-[30%]" style={{ top: "43%" }}>
          <svg width="13" height="20" viewBox="0 0 13 20">
            <polygon points="6.5,0 13,14 0,14" className="fill-emerald-600/80 dark:fill-emerald-700/80" />
            <rect x="5" y="13" width="3" height="7" className="fill-amber-900/50" />
          </svg>
        </div>
      </div>

      {/* Fireflies — parallax 0.35 (foreground) */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}
      >
        {[
          { x: "15%", y: "55%", dur: "4s", delay: "0s" },
          { x: "45%", y: "50%", dur: "5s", delay: "1s" },
          { x: "75%", y: "58%", dur: "4.5s", delay: "2s" },
          { x: "30%", y: "62%", dur: "3.5s", delay: "0.5s" },
          { x: "60%", y: "48%", dur: "5.5s", delay: "1.5s" },
          { x: "88%", y: "52%", dur: "4s", delay: "3s" },
          { x: "22%", y: "45%", dur: "6s", delay: "2.5s" },
        ].map((f, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: f.x,
              top: f.y,
              background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)",
              animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes birdFly {
          0% { left: -5%; }
          100% { left: 105%; }
        }
        @keyframes butterflyFloat {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(12px, -15px) rotate(8deg); }
          40% { transform: translate(-8px, -25px) rotate(-5deg); }
          60% { transform: translate(15px, -10px) rotate(10deg); }
          80% { transform: translate(-5px, -20px) rotate(-8deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes leafFall {
          0% { top: -5%; opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.5; }
          100% { top: 70%; opacity: 0; }
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
          50% { opacity: 1; box-shadow: 0 0 10px 3px #FBBF24; }
        }
      `}</style>
    </div>
  );
};

export default LoginScenery;

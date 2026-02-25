/**
 * LoginScenery — Full-page animated nature background for Auth.
 * Mountains, drifting clouds, birds, and rain. No sun/moon — logo takes center stage.
 */
const LoginScenery = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ containerType: 'inline-size' }}>
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 dark:from-slate-900 dark:via-indigo-950 dark:to-emerald-950 transition-colors duration-500" />

      {/* Clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-[8%] animate-cloudDrift1">
          <svg width="80" height="30" viewBox="0 0 80 30" className="text-white/50 dark:text-white/15">
            <ellipse cx="40" cy="20" rx="36" ry="10" fill="currentColor"/>
            <ellipse cx="28" cy="15" rx="20" ry="12" fill="currentColor"/>
            <ellipse cx="50" cy="13" rx="18" ry="11" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-[16%] animate-cloudDrift2">
          <svg width="55" height="22" viewBox="0 0 55 22" className="text-white/35 dark:text-white/10">
            <ellipse cx="28" cy="15" rx="24" ry="7" fill="currentColor"/>
            <ellipse cx="18" cy="10" rx="14" ry="9" fill="currentColor"/>
            <ellipse cx="36" cy="9" rx="12" ry="8" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-[22%] animate-cloudDrift3">
          <svg width="65" height="24" viewBox="0 0 65 24" className="text-white/40 dark:text-white/12">
            <ellipse cx="32" cy="16" rx="30" ry="8" fill="currentColor"/>
            <ellipse cx="22" cy="11" rx="16" ry="10" fill="currentColor"/>
            <ellipse cx="42" cy="10" rx="14" ry="9" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Birds */}
      <div className="absolute inset-0">
        {[
          { top: '10%', delay: '0s', dur: '8s', size: 14 },
          { top: '6%', delay: '2s', dur: '10s', size: 11 },
          { top: '14%', delay: '4.5s', dur: '9s', size: 12 },
          { top: '18%', delay: '7s', dur: '11s', size: 10 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: b.top,
              animation: `birdFly ${b.dur} linear ${b.delay} infinite`,
            }}
          >
            <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/40">
              <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
              </path>
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
              height: '12px',
              animationDelay: `${(i * 0.12) % 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* Mountains */}
      <svg className="absolute w-full" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ top: '30%', height: '72%', left: 0, right: 0, position: 'absolute' }}>
        <path d="M0,200 L0,90 L40,55 L80,75 L120,40 L170,65 L220,30 L270,55 L310,35 L360,60 L400,45 L400,200 Z"
          className="fill-emerald-800/30 dark:fill-emerald-950/40" />
        <path d="M0,200 L0,100 L35,70 L75,85 L110,55 L160,75 L200,45 L250,65 L290,50 L340,70 L380,55 L400,65 L400,200 Z"
          className="fill-emerald-700/50 dark:fill-emerald-900/50" />
        <path d="M0,200 L0,115 L25,105 L50,110 L80,100 L110,107 L140,98 L175,104 L210,96 L245,102 L280,94 L310,100 L345,93 L375,99 L400,95 L400,200 Z"
          className="fill-emerald-600/60 dark:fill-emerald-800/60" />
        <rect x="0" y="130" width="400" height="70" className="fill-emerald-500/20 dark:fill-emerald-900/30" />
        <defs>
          <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="hsl(150 25% 8%)" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="0" y="140" width="400" height="60" fill="url(#groundFade)" className="dark:opacity-100 opacity-0" />
      </svg>

      {/* Trees */}
      <div className="absolute left-[8%]" style={{ top: '44%' }}>
        <svg width="16" height="26" viewBox="0 0 16 26"><polygon points="8,0 16,18 0,18" className="fill-emerald-700 dark:fill-emerald-800"/><rect x="6" y="17" width="4" height="9" className="fill-amber-900/60"/></svg>
      </div>
      <div className="absolute left-[85%]" style={{ top: '42%' }}>
        <svg width="14" height="22" viewBox="0 0 14 22"><polygon points="7,0 14,15 0,15" className="fill-emerald-600 dark:fill-emerald-700"/><rect x="5" y="14" width="4" height="8" className="fill-amber-900/50"/></svg>
      </div>
      <div className="absolute left-[55%]" style={{ top: '46%' }}>
        <svg width="11" height="18" viewBox="0 0 11 18"><polygon points="5.5,0 11,12 0,12" className="fill-emerald-700/70 dark:fill-emerald-800/70"/><rect x="4" y="11" width="3" height="7" className="fill-amber-900/40"/></svg>
      </div>

      {/* Bird fly keyframe */}
      <style>{`
        @keyframes birdFly {
          0% { left: -5%; }
          100% { left: 105%; }
        }
      `}</style>
    </div>
  );
};

export default LoginScenery;

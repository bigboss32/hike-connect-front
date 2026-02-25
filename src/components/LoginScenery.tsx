/**
 * LoginScenery — Animated nature background for the Auth screen.
 * Mountains, clouds drifting, sun/moon cycle, and subtle trees.
 */
const LoginScenery = () => {
  return (
    <div className="w-full h-40 relative overflow-hidden rounded-2xl mb-4" style={{ containerType: 'inline-size' }}>
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100 dark:from-slate-800 dark:via-indigo-950 dark:to-slate-900 transition-colors duration-500" />

      {/* Day/night overlay */}
      <div className="absolute inset-0 animate-dayNight" />

      {/* Sun */}
      <div className="absolute w-10 h-10 animate-celestial" style={{ top: '20%', left: '10%' }}>
        <div className="w-full h-full rounded-full bg-yellow-300 dark:bg-yellow-200 shadow-[0_0_20px_6px_rgba(250,204,21,0.4)]" />
      </div>

      {/* Moon */}
      <div className="absolute w-7 h-7 animate-celestialMoon" style={{ top: '20%', left: '10%' }}>
        <div className="w-full h-full rounded-full bg-slate-200 shadow-[0_0_14px_4px_rgba(203,213,225,0.3)]" />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 animate-starsAppear">
        {[
          { top: '15%', left: '20%' },
          { top: '10%', left: '55%' },
          { top: '25%', left: '75%' },
          { top: '8%', left: '35%' },
          { top: '20%', left: '88%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ ...pos, animationDelay: `${i * 200}ms`, opacity: 0.8 }}
          />
        ))}
      </div>

      {/* Clouds */}
      <div className="absolute inset-0 animate-cloudsHide">
        <div className="absolute top-[18%] animate-cloudDrift1">
          <svg width="60" height="24" viewBox="0 0 60 24" className="text-white/70 dark:text-white/20">
            <ellipse cx="30" cy="16" rx="28" ry="8" fill="currentColor"/>
            <ellipse cx="20" cy="12" rx="16" ry="10" fill="currentColor"/>
            <ellipse cx="38" cy="10" rx="14" ry="9" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-[28%] animate-cloudDrift2">
          <svg width="45" height="20" viewBox="0 0 45 20" className="text-white/50 dark:text-white/10">
            <ellipse cx="22" cy="13" rx="20" ry="7" fill="currentColor"/>
            <ellipse cx="15" cy="9" rx="12" ry="8" fill="currentColor"/>
            <ellipse cx="30" cy="8" rx="10" ry="7" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Mountains */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ height: '55%' }}>
        {/* Back mountain range */}
        <path d="M0,100 L0,55 L50,30 L100,50 L140,20 L190,45 L230,15 L280,40 L320,25 L370,50 L400,35 L400,100 Z"
          className="fill-emerald-800/40 dark:fill-emerald-950/50" />
        {/* Front mountain range */}
        <path d="M0,100 L0,65 L40,45 L80,60 L120,35 L170,55 L210,30 L260,50 L300,40 L350,60 L400,45 L400,100 Z"
          className="fill-emerald-700/60 dark:fill-emerald-900/60" />
        {/* Trees on front mountains */}
        <path d="M0,100 L0,75 L30,68 L60,72 L100,65 L130,70 L160,63 L200,68 L240,62 L270,66 L310,60 L340,65 L380,62 L400,68 L400,100 Z"
          className="fill-emerald-600/70 dark:fill-emerald-800/70" />
        {/* Ground */}
        <rect x="0" y="85" width="400" height="15" className="fill-emerald-500/30 dark:fill-emerald-900/40" />
      </svg>

      {/* Small trees foreground */}
      <div className="absolute bottom-2 left-[10%]">
        <svg width="14" height="22" viewBox="0 0 14 22"><polygon points="7,0 14,16 0,16" className="fill-emerald-700 dark:fill-emerald-800"/><rect x="5.5" y="15" width="3" height="7" className="fill-amber-800/70"/></svg>
      </div>
      <div className="absolute bottom-2 left-[80%]">
        <svg width="12" height="18" viewBox="0 0 12 18"><polygon points="6,0 12,13 0,13" className="fill-emerald-600 dark:fill-emerald-700"/><rect x="4.5" y="12" width="3" height="6" className="fill-amber-800/60"/></svg>
      </div>
      <div className="absolute bottom-2 left-[50%]">
        <svg width="10" height="16" viewBox="0 0 10 16"><polygon points="5,0 10,11 0,11" className="fill-emerald-700/80 dark:fill-emerald-800/80"/><rect x="3.5" y="10" width="3" height="6" className="fill-amber-800/50"/></svg>
      </div>
    </div>
  );
};

export default LoginScenery;

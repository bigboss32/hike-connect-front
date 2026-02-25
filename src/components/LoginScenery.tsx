import maroaIcon from "@/assets/maroa-icon.svg";

/**
 * LoginScenery — Full-page animated nature background for Auth.
 * The Maroá logo is embedded within the landscape, floating above the mountains.
 */
const LoginScenery = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ containerType: 'inline-size' }}>
      {/* Sky gradient — full page */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100 dark:from-slate-900 dark:via-indigo-950 dark:to-emerald-950 transition-colors duration-500" />

      {/* Day/night overlay */}
      <div className="absolute inset-0 animate-dayNight" />

      {/* Sun */}
      <div className="absolute w-12 h-12 animate-celestial" style={{ top: '8%', left: '10%' }}>
        <div className="w-full h-full rounded-full bg-yellow-300 dark:bg-yellow-200 shadow-[0_0_30px_10px_rgba(250,204,21,0.35)]" />
      </div>

      {/* Moon */}
      <div className="absolute w-8 h-8 animate-celestialMoon" style={{ top: '8%', left: '10%' }}>
        <div className="w-full h-full rounded-full bg-slate-200 shadow-[0_0_18px_6px_rgba(203,213,225,0.25)]" />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 animate-starsAppear">
        {[
          { top: '5%', left: '15%' },
          { top: '3%', left: '50%' },
          { top: '12%', left: '72%' },
          { top: '7%', left: '35%' },
          { top: '10%', left: '85%' },
          { top: '2%', left: '65%' },
          { top: '15%', left: '25%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ ...pos, opacity: 0.7 }}
          />
        ))}
      </div>

      {/* Clouds */}
      <div className="absolute inset-0 animate-cloudsHide">
        <div className="absolute top-[10%] animate-cloudDrift1">
          <svg width="80" height="30" viewBox="0 0 80 30" className="text-white/50 dark:text-white/15">
            <ellipse cx="40" cy="20" rx="36" ry="10" fill="currentColor"/>
            <ellipse cx="28" cy="15" rx="20" ry="12" fill="currentColor"/>
            <ellipse cx="50" cy="13" rx="18" ry="11" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute top-[18%] animate-cloudDrift2">
          <svg width="55" height="22" viewBox="0 0 55 22" className="text-white/35 dark:text-white/8">
            <ellipse cx="28" cy="15" rx="24" ry="7" fill="currentColor"/>
            <ellipse cx="18" cy="10" rx="14" ry="9" fill="currentColor"/>
            <ellipse cx="36" cy="9" rx="12" ry="8" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Mountains + ground — positioned at ~35% from top */}
      <svg className="absolute w-full" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ top: '28%', height: '75%', left: 0, right: 0, position: 'absolute' }}>
        {/* Far mountains */}
        <path d="M0,200 L0,90 L40,55 L80,75 L120,40 L170,65 L220,30 L270,55 L310,35 L360,60 L400,45 L400,200 Z"
          className="fill-emerald-800/30 dark:fill-emerald-950/40" />
        {/* Mid mountains */}
        <path d="M0,200 L0,100 L35,70 L75,85 L110,55 L160,75 L200,45 L250,65 L290,50 L340,70 L380,55 L400,65 L400,200 Z"
          className="fill-emerald-700/50 dark:fill-emerald-900/50" />
        {/* Front tree line */}
        <path d="M0,200 L0,115 L25,105 L50,110 L80,100 L110,107 L140,98 L175,104 L210,96 L245,102 L280,94 L310,100 L345,93 L375,99 L400,95 L400,200 Z"
          className="fill-emerald-600/60 dark:fill-emerald-800/60" />
        {/* Ground fade into card area */}
        <rect x="0" y="130" width="400" height="70" className="fill-emerald-500/20 dark:fill-emerald-900/30" />

        {/* Gradient fade to page background at bottom */}
        <defs>
          <linearGradient id="groundFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="hsl(150 25% 8%)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <rect x="0" y="150" width="400" height="50" fill="url(#groundFade)" className="dark:opacity-100 opacity-0" />
      </svg>

      {/* Trees scattered */}
      <div className="absolute left-[8%]" style={{ top: '42%' }}>
        <svg width="16" height="26" viewBox="0 0 16 26"><polygon points="8,0 16,18 0,18" className="fill-emerald-700 dark:fill-emerald-800"/><rect x="6" y="17" width="4" height="9" className="fill-amber-900/60"/></svg>
      </div>
      <div className="absolute left-[85%]" style={{ top: '40%' }}>
        <svg width="14" height="22" viewBox="0 0 14 22"><polygon points="7,0 14,15 0,15" className="fill-emerald-600 dark:fill-emerald-700"/><rect x="5" y="14" width="4" height="8" className="fill-amber-900/50"/></svg>
      </div>
      <div className="absolute left-[55%]" style={{ top: '44%' }}>
        <svg width="11" height="18" viewBox="0 0 11 18"><polygon points="5.5,0 11,12 0,12" className="fill-emerald-700/70 dark:fill-emerald-800/70"/><rect x="4" y="11" width="3" height="7" className="fill-amber-900/40"/></svg>
      </div>

      {/* Logo integrated in landscape — sitting above mountains */}
      <div className="absolute left-1/2 -translate-x-1/2 animate-logo-entrance" style={{ top: '18%' }}>
        <div className="relative">
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/10 blur-2xl scale-150" />
          <img
            src={maroaIcon}
            alt="MAROÁ"
            className="relative w-28 h-28 drop-shadow-[0_4px_20px_rgba(45,80,36,0.3)]"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScenery;

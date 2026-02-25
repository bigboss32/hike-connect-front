/**
 * EmptyRoutesScene — Animated hiker looking at a map when no routes are found.
 */
const EmptyRoutesScene = () => {
  return (
    <div className="flex flex-col items-center py-10">
      <div className="relative w-40 h-40">
        {/* Ground */}
        <div className="absolute bottom-4 left-4 right-4 h-3 rounded-full bg-muted/60" />

        {/* Hiker body */}
        <svg viewBox="0 0 80 80" className="w-full h-full text-primary">
          {/* Body */}
          <rect x="35" y="28" width="10" height="18" rx="3" fill="currentColor" />
          {/* Head */}
          <circle cx="40" cy="22" r="8" fill="currentColor" />
          {/* Hat */}
          <ellipse cx="40" cy="16" rx="10" ry="3" className="fill-secondary" />
          <rect x="35" y="13" width="10" height="4" rx="2" className="fill-secondary" />
          {/* Question mark above head */}
          <text x="52" y="14" fontSize="14" fontWeight="bold" className="fill-secondary animate-pulse">?</text>
          
          {/* Left arm holding map */}
          <rect x="26" y="30" width="10" height="4" rx="2" fill="currentColor" transform="rotate(-15, 26, 30)" />
          {/* Map */}
          <rect x="18" y="28" width="12" height="10" rx="1" className="fill-accent/80" />
          <line x1="20" y1="31" x2="28" y2="31" stroke="white" strokeWidth="0.8" />
          <line x1="20" y1="33.5" x2="26" y2="33.5" stroke="white" strokeWidth="0.8" />
          <line x1="20" y1="36" x2="27" y2="36" stroke="white" strokeWidth="0.8" />
          
          {/* Right arm scratching head */}
          <g className="origin-center" style={{ transformOrigin: '45px 30px', animation: 'headScratch 2s ease-in-out infinite' }}>
            <rect x="45" y="28" width="10" height="3.5" rx="1.5" fill="currentColor" transform="rotate(-60, 45, 28)" />
          </g>
          
          {/* Legs */}
          <g>
            <rect x="36" y="45" width="4" height="14" rx="2" fill="currentColor" />
            <rect x="41" y="45" width="4" height="14" rx="2" fill="currentColor" />
          </g>
          
          {/* Boots */}
          <ellipse cx="38" cy="60" rx="4" ry="2.5" className="fill-amber-800" />
          <ellipse cx="43" cy="60" rx="4" ry="2.5" className="fill-amber-800" />
          
          {/* Backpack */}
          <rect x="42" y="26" width="7" height="12" rx="2" className="fill-primary/60" />
        </svg>
      </div>
      
      <p className="text-muted-foreground font-medium mt-2">No se encontraron rutas</p>
      <p className="text-sm text-muted-foreground/70 mt-1">Intenta con otros filtros o busca algo diferente</p>

      <style>{`
        @keyframes headScratch {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(-8deg); }
          60% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
};

export default EmptyRoutesScene;

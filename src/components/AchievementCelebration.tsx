/**
 * AchievementCelebration — Animated campfire scene with a celebrating hiker
 * shown in the achievements showcase area.
 */
const AchievementCelebration = () => {
  return (
    <div className="relative w-full h-32 overflow-hidden">
      <svg viewBox="0 0 200 80" className="w-full h-full">
        {/* Ground */}
        <ellipse cx="100" cy="74" rx="90" ry="6" className="fill-muted/50" />

        {/* Hiker celebrating */}
        <g transform="translate(60, 8)">
          {/* Body */}
          <rect x="8" y="22" width="9" height="16" rx="3" className="fill-primary" />
          {/* Head */}
          <circle cx="12.5" cy="16" r="7" className="fill-primary" />
          {/* Happy face */}
          <path d="M10,17 Q12.5,20 15,17" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="10.5" cy="14.5" r="0.8" fill="white" />
          <circle cx="14.5" cy="14.5" r="0.8" fill="white" />
          
          {/* Left arm raised */}
          <rect x="1" y="18" width="8" height="3.5" rx="1.5" className="fill-primary" transform="rotate(-50, 5, 22)" />
          {/* Right arm raised */}
          <rect x="16" y="18" width="8" height="3.5" rx="1.5" className="fill-primary" transform="rotate(50, 20, 22)" />
          
          {/* Trophy in right hand */}
          <g transform="translate(22, 6)">
            <rect x="0" y="4" width="6" height="5" rx="1" className="fill-yellow-400" />
            <rect x="1.5" y="9" width="3" height="2" className="fill-yellow-500" />
            <rect x="0.5" y="11" width="5" height="1.5" rx="0.5" className="fill-yellow-500" />
            <path d="M-1,5 Q-2,7 0,8" fill="none" className="stroke-yellow-400" strokeWidth="1" />
            <path d="M7,5 Q8,7 6,8" fill="none" className="stroke-yellow-400" strokeWidth="1" />
          </g>
          
          {/* Legs */}
          <rect x="9" y="37" width="3.5" height="12" rx="1.5" className="fill-primary" />
          <rect x="13" y="37" width="3.5" height="12" rx="1.5" className="fill-primary" />
          {/* Boots */}
          <ellipse cx="10.5" cy="50" rx="3.5" ry="2" className="fill-amber-800" />
          <ellipse cx="14.5" cy="50" rx="3.5" ry="2" className="fill-amber-800" />
        </g>

        {/* Campfire */}
        <g transform="translate(120, 48)">
          {/* Logs */}
          <rect x="-8" y="14" width="22" height="4" rx="2" className="fill-amber-900" transform="rotate(-15, 3, 16)" />
          <rect x="-6" y="14" width="22" height="4" rx="2" className="fill-amber-800" transform="rotate(15, 5, 16)" />
          
          {/* Fire flames */}
          <g className="animate-fireFlicker" style={{ transformOrigin: '5px 14px' }}>
            <ellipse cx="5" cy="10" rx="6" ry="9" className="fill-orange-500/80" />
            <ellipse cx="5" cy="8" rx="4" ry="7" className="fill-yellow-400/90" />
            <ellipse cx="5" cy="6" rx="2" ry="5" className="fill-yellow-200/80" />
          </g>
          
          {/* Smoke */}
          <circle cx="5" cy="-2" r="2" className="fill-muted-foreground/10 animate-smokeRise" />
          <circle cx="3" cy="-5" r="1.5" className="fill-muted-foreground/10 animate-smokeRise" style={{ animationDelay: '0.7s' }} />
          <circle cx="7" cy="-4" r="1.8" className="fill-muted-foreground/10 animate-smokeRise" style={{ animationDelay: '1.4s' }} />
        </g>

        {/* Sparkle particles around hiker */}
        {[
          { x: 55, y: 10 },
          { x: 95, y: 8 },
          { x: 70, y: 5 },
          { x: 85, y: 14 },
        ].map((pos, i) => (
          <circle
            key={i}
            cx={pos.x}
            cy={pos.y}
            r="1.5"
            className="fill-yellow-400 animate-pulse"
            style={{ animationDelay: `${i * 300}ms` }}
          />
        ))}
      </svg>
    </div>
  );
};

export default AchievementCelebration;

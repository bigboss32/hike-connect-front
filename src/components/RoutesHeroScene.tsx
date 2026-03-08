/**
 * RoutesHeroScene — Animated SVG landscape banner for the Routes page
 * Features layered mountains, drifting clouds, swaying trees, and a trail path.
 */

const RoutesHeroScene = () => {
  return (
    <div className="relative w-full h-44 overflow-hidden bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-primary/10 dark:from-sky-900/30 dark:via-primary/15 dark:to-background">
      <svg viewBox="0 0 360 130" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="rMountFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,20%,55%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(150,20%,45%)" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="rMountMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,40%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(150,25%,30%)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="rMountNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,35%,35%)" />
            <stop offset="100%" stopColor="hsl(150,30%,25%)" />
          </linearGradient>
          <linearGradient id="rTrail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(30,40%,55%)" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(30,40%,55%)" stopOpacity="0.6" />
            <stop offset="80%" stopColor="hsl(30,40%,55%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(30,40%,55%)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sun glow */}
        <circle cx="300" cy="25" r="20" fill="hsl(40,90%,70%)" opacity="0.25" />
        <circle cx="300" cy="25" r="12" fill="hsl(40,95%,75%)" opacity="0.4" />

        {/* Far mountains */}
        <polygon points="0,130 0,75 40,50 80,70 120,40 170,60 210,35 260,55 300,30 340,50 360,45 360,130" fill="url(#rMountFar)" />

        {/* Mid mountains */}
        <polygon points="0,130 20,80 60,60 100,78 140,52 180,72 220,48 270,65 310,55 350,70 360,62 360,130" fill="url(#rMountMid)" />

        {/* Near mountain range */}
        <polygon points="0,130 0,90 50,72 90,85 130,68 170,80 200,65 240,78 280,70 320,82 360,75 360,130" fill="url(#rMountNear)" />

        {/* Ground */}
        <rect x="0" y="105" width="360" height="25" fill="hsl(150,25%,22%)" opacity="0.5" />
        <ellipse cx="180" cy="108" rx="180" ry="6" fill="hsl(150,30%,28%)" opacity="0.4" />

        {/* Trail path winding through */}
        <path 
          d="M-10,118 Q40,110 80,115 Q130,120 170,112 Q220,105 260,114 Q310,120 370,110" 
          fill="none" 
          stroke="url(#rTrail)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          strokeDasharray="6 4"
        />

        {/* Trees — near row */}
        {[
          { x: 25, s: 1.1 }, { x: 55, s: 0.9 }, { x: 95, s: 1.2 },
          { x: 135, s: 0.85 }, { x: 175, s: 1.05 }, { x: 215, s: 0.95 },
          { x: 255, s: 1.15 }, { x: 290, s: 0.9 }, { x: 330, s: 1 },
        ].map((t, i) => (
          <g key={`tree-${i}`} transform={`translate(${t.x}, ${100}) scale(${t.s})`}
            style={{ animation: `treeSway 4s ease-in-out infinite ${i * 0.4}s`, transformOrigin: `${t.x}px 100px` }}>
            {/* Trunk */}
            <rect x="-1" y="0" width="2.5" height="10" rx="1" fill="hsl(25,35%,30%)" />
            {/* Foliage layers */}
            <polygon points="0,-12 6,0 -6,0" fill="hsl(150,40%,32%)" />
            <polygon points="0,-8 5,0 -5,0" fill="hsl(150,45%,36%)" />
            <polygon points="0,-4 4,2 -4,2" fill="hsl(150,42%,38%)" />
          </g>
        ))}

        {/* Trees — far row (smaller, lighter) */}
        {[40, 70, 110, 150, 190, 230, 270, 310].map((x, i) => (
          <g key={`ftree-${i}`} transform={`translate(${x}, ${82}) scale(0.6)`} opacity="0.45">
            <rect x="-0.8" y="0" width="1.6" height="7" rx="0.8" fill="hsl(25,30%,35%)" />
            <polygon points="0,-9 4.5,0 -4.5,0" fill="hsl(150,35%,40%)" />
            <polygon points="0,-6 3.5,0 -3.5,0" fill="hsl(150,38%,43%)" />
          </g>
        ))}

        {/* Clouds — layer 1 */}
        <g opacity="0.5" style={{ animation: "rCloudDrift 22s linear infinite" }}>
          <ellipse cx="60" cy="22" rx="22" ry="7" fill="white" opacity="0.6" />
          <ellipse cx="72" cy="19" rx="14" ry="5.5" fill="white" opacity="0.5" />
        </g>
        {/* Clouds — layer 2 */}
        <g opacity="0.35" style={{ animation: "rCloudDrift 30s linear infinite 8s" }}>
          <ellipse cx="200" cy="16" rx="18" ry="6" fill="white" opacity="0.55" />
          <ellipse cx="210" cy="13" rx="12" ry="4.5" fill="white" opacity="0.45" />
        </g>
        {/* Clouds — layer 3 */}
        <g opacity="0.3" style={{ animation: "rCloudDrift 26s linear infinite 15s" }}>
          <ellipse cx="130" cy="28" rx="16" ry="5" fill="white" opacity="0.5" />
          <ellipse cx="140" cy="26" rx="10" ry="4" fill="white" opacity="0.4" />
        </g>

        {/* Birds */}
        <g opacity="0.35" style={{ animation: "rBirdFly 12s linear infinite" }}>
          <path d="M0,0 Q3,-3.5 6,0" fill="none" stroke="hsl(150,20%,30%)" strokeWidth="0.8" />
          <path d="M8,-1 Q11,-4 14,-1" fill="none" stroke="hsl(150,20%,30%)" strokeWidth="0.7" />
        </g>
        <g opacity="0.25" style={{ animation: "rBirdFly 15s linear infinite 5s" }}>
          <path d="M0,0 Q2.5,-3 5,0" fill="none" stroke="hsl(150,20%,30%)" strokeWidth="0.7" transform="translate(0, 8)" />
        </g>

        {/* Trail markers */}
        {[80, 170, 260].map((x, i) => (
          <g key={`marker-${i}`} transform={`translate(${x}, ${108})`}>
            <rect x="-1" y="-6" width="2" height="7" rx="0.5" fill="hsl(30,30%,45%)" />
            <circle cx="0" cy="-7.5" r="2" fill="hsl(25,80%,55%)" opacity="0.8" />
          </g>
        ))}
      </svg>

      {/* CSS Animations */}
      <style>{`
        @keyframes rCloudDrift {
          0% { transform: translateX(360px); }
          100% { transform: translateX(-100px); }
        }
        @keyframes rBirdFly {
          0% { transform: translate(380px, 8px); }
          100% { transform: translate(-40px, 3px); }
        }
        @keyframes treeSway {
          0%, 100% { transform: rotate(0deg); }
          33% { transform: rotate(1.5deg); }
          66% { transform: rotate(-1deg); }
        }
      `}</style>
    </div>
  );
};

export default RoutesHeroScene;

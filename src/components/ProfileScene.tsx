/**
 * ProfileScene — Animated silhouette contemplating the horizon.
 * Dynamic time-of-day: dawn mist, morning sun, afternoon heat, sunset glow, night stars.
 */

type TimeSlot = "dawn" | "morning" | "afternoon" | "sunset" | "night";

const getTimeSlot = (): TimeSlot => {
  const h = new Date().getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 18) return "sunset";
  return "night";
};

const ProfileScene = () => {
  const time = getTimeSlot();
  const isNight = time === "night";
  const isSunset = time === "sunset";
  const isDawn = time === "dawn";

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/40 via-amber-200/30 to-sky-300/20",
    morning: "from-sky-300/30 via-amber-100/20 to-emerald-200/15",
    afternoon: "from-orange-200/25 via-amber-100/15 to-sky-200/10",
    sunset: "from-orange-500/40 via-rose-400/35 to-purple-400/25",
    night: "from-indigo-950/60 via-slate-900/50 to-emerald-950/30",
  };

  const sunY = isDawn ? 52 : isSunset ? 45 : 30;
  const sunColor = isSunset ? "#FB923C" : isDawn ? "#FDE68A" : "#FBBF24";

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
      {/* Sky */}
      <div className={`absolute inset-0 bg-gradient-to-b ${sky[time]} transition-colors duration-700`} />

      <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">

        {/* ── Stars + Moon (night) ── */}
        {isNight && (
          <g>
            {[
              {x:20,y:10,r:1.2},{x:55,y:18,r:0.8},{x:90,y:6,r:1.4},{x:130,y:22,r:0.9},
              {x:175,y:12,r:1.1},{x:220,y:26,r:0.7},{x:260,y:8,r:1.3},{x:300,y:20,r:1},
              {x:340,y:14,r:0.8},{x:370,y:24,r:1.1},{x:42,y:32,r:0.6},{x:150,y:34,r:0.9},
              {x:280,y:30,r:0.7},{x:365,y:36,r:1},{x:105,y:38,r:0.5},
            ].map((st,i) => (
              <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="white" opacity="0.4"
                className="ps-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            {/* Moon */}
            <circle cx="340" cy="22" r="12" fill="#E2E8F0" opacity="0.1" />
            <circle cx="340" cy="22" r="8" fill="#F1F5F9" opacity="0.75" />
            <circle cx="344" cy="19" r="6" fill="hsl(var(--background))" opacity="0.6" />
          </g>
        )}

        {/* ── Sun / glow (daytime) ── */}
        {!isNight && (
          <g>
            <circle cx="320" cy={sunY} r="20" fill={sunColor} opacity="0.15" />
            <circle cx="320" cy={sunY} r="9" fill={sunColor} opacity="0.5" />
            <circle cx="320" cy={sunY} r="4.5" fill="#FDE68A" opacity="0.7" />
            {isSunset && <ellipse cx="200" cy={sunY + 20} rx="200" ry="8" fill="#F97316" opacity="0.06" />}
          </g>
        )}

        {/* ── Distant mountains ── */}
        <g opacity={isNight ? 0.4 : 0.6}>
          <path d="M0,85 L40,58 L85,72 L130,45 L170,65 L215,40 L260,60 L305,48 L350,65 L400,50 L400,85Z"
            fill="hsl(150,30%,30%)" />
          <path d="M215,40 L208,50 L222,50Z" fill="white" opacity="0.2" />
          <path d="M130,45 L124,54 L136,54Z" fill="white" opacity="0.15" />
        </g>

        {/* ── Near hills ── */}
        <g opacity={isNight ? 0.5 : 0.7}>
          <path d="M0,100 Q50,80 100,95 Q150,108 200,88 Q250,72 300,92 Q350,106 400,85 L400,100Z"
            fill="hsl(150,35%,22%)" />
        </g>

        {/* ── Ground ── */}
        <path d="M0,100 Q60,94 130,100 Q200,108 270,98 Q340,90 400,100 L400,140 L0,140Z"
          fill="hsl(150,30%,14%)" />
        <path d="M0,110 Q80,104 160,110 Q240,118 320,106 Q370,100 400,108 L400,140 L0,140Z"
          fill="hsl(150,25%,10%)" />

        {/* ── Trees silhouette ── */}
        {[15, 45, 75, 320, 350, 380].map((x, i) => (
          <g key={i} opacity={isNight ? 0.3 : 0.5}>
            <rect x={x - 0.8} y={95} width="1.6" height={6} rx="0.5" fill="hsl(150,25%,12%)" />
            <polygon points={`${x},${88 - (i%2)*3} ${x-4-(i%2)},99 ${x+4+(i%2)},99`}
              fill="hsl(150,40%,18%)" />
          </g>
        ))}

        {/* ── HIKER SILHOUETTE — contemplating the view ── */}
        <g opacity="0.85">
          {/* Shadow */}
          <ellipse cx="195" cy="101" rx="12" ry="2" fill="hsl(150,20%,8%)" opacity="0.3" />
          {/* Body — standing tall */}
          <rect x="191" y="72" width="8" height="18" rx="3" fill="hsl(150,15%,10%)" />
          {/* Head */}
          <circle cx="195" cy="66" r="5.5" fill="hsl(150,15%,10%)" />
          {/* Hat */}
          <ellipse cx="195" cy="62" rx="7" ry="1.8" fill="hsl(150,15%,10%)" />
          <rect x="190" y="58.5" width="10" height="4" rx="2" fill="hsl(150,15%,10%)" />
          {/* Backpack */}
          <rect x="199" y="73" width="5.5" height="12" rx="2" fill="hsl(150,10%,14%)" />
          <ellipse cx="202" cy="72.5" rx="3" ry="1.2" fill="hsl(150,10%,14%)" />
          {/* Left arm — relaxed */}
          <line x1="191" y1="75" x2="186" y2="85" stroke="hsl(150,15%,10%)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right arm — hand in pocket / resting */}
          <line x1="199" y1="75" x2="203" y2="84" stroke="hsl(150,15%,10%)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left leg */}
          <line x1="193" y1="90" x2="190" y2="100" stroke="hsl(150,15%,10%)" strokeWidth="3" strokeLinecap="round" />
          {/* Right leg */}
          <line x1="197" y1="90" x2="200" y2="100" stroke="hsl(150,15%,10%)" strokeWidth="3" strokeLinecap="round" />
          {/* Boots */}
          <ellipse cx="190" cy="100.5" rx="3" ry="1.5" fill="hsl(150,15%,10%)" />
          <ellipse cx="200" cy="100.5" rx="3" ry="1.5" fill="hsl(150,15%,10%)" />
        </g>

        {/* ── Fireflies (night) ── */}
        {isNight && (
          <g>
            {[{x:120,y:78},{x:270,y:72},{x:160,y:65},{x:240,y:80},{x:350,y:85},{x:60,y:82}].map((f,i) => (
              <circle key={i} cx={f.x} cy={f.y} r="1.5" fill="#FDE68A"
                className="ps-firefly" style={{ animationDelay: `${i * 0.6}s` }} />
            ))}
          </g>
        )}

        {/* ── Birds (daytime) ── */}
        {!isNight && !isDawn && (
          <g opacity="0.3">
            {[{x:80,y:35},{x:250,y:28}].map((b,i) => (
              <path key={i} d={`M${b.x},${b.y} Q${b.x+4},${b.y-3} ${b.x+8},${b.y} Q${b.x+12},${b.y-3} ${b.x+16},${b.y}`}
                fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.2" strokeLinecap="round"
                className="ps-bird" style={{ animationDelay: `${i * 4}s` }} />
            ))}
          </g>
        )}

        {/* ── Dawn mist ── */}
        {isDawn && (
          <g opacity="0.15">
            <ellipse cx="100" cy="95" rx="60" ry="4" fill="white" className="ps-mist" />
            <ellipse cx="280" cy="92" rx="50" ry="3.5" fill="white" className="ps-mist" style={{ animationDelay: "2s" }} />
          </g>
        )}

        {/* ── Sunset embers ── */}
        {isSunset && (
          <g>
            {[{x:180,y:85},{x:210,y:80},{x:160,y:88}].map((e,i) => (
              <circle key={i} cx={e.x} cy={e.y} r="0.8" fill="#FB923C" opacity="0.4"
                className="ps-ember" style={{ animationDelay: `${i * 0.8}s` }} />
            ))}
          </g>
        )}

        {/* ── Floating particles ── */}
        {[{x:50,y:55},{x:150,y:48},{x:300,y:60},{x:380,y:42}].map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1 + (i % 2) * 0.5}
            fill={isNight ? "#818CF8" : isSunset ? "#FB923C" : "hsl(var(--primary))"}
            opacity="0.15" className="ps-particle" style={{ animationDelay: `${i * 1.5}s` }} />
        ))}
      </svg>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <style>{`
        .ps-twinkle { animation: ps-twinkle 3s ease-in-out infinite; }
        .ps-firefly { animation: ps-glow 3s ease-in-out infinite; }
        .ps-bird { animation: ps-birdFly 12s linear infinite; }
        .ps-mist { animation: ps-mistDrift 8s ease-in-out infinite; }
        .ps-ember { animation: ps-emberRise 3s ease-out infinite; }
        .ps-particle { animation: ps-drift 7s ease-in-out infinite; }

        @keyframes ps-twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.9; } }
        @keyframes ps-glow { 0%,100% { opacity: 0.1; } 35% { opacity: 0.85; } 55% { opacity: 0.15; } 80% { opacity: 0.7; } }
        @keyframes ps-birdFly { from { transform: translateX(420px); } to { transform: translateX(-40px); } }
        @keyframes ps-mistDrift { 0%,100% { transform: translateX(0); opacity: 0.15; } 50% { transform: translateX(15px); opacity: 0.25; } }
        @keyframes ps-emberRise { 0% { opacity: 0.5; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        @keyframes ps-drift { 0% { transform: translateY(0); opacity: 0.1; } 50% { transform: translateY(-8px); opacity: 0.3; } 100% { transform: translateY(0); opacity: 0.1; } }
      `}</style>
    </div>
  );
};

export default ProfileScene;

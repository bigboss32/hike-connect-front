/**
 * CampfireScene — Animated SVG banner for Communities page.
 * Campfire with gathered hiker silhouettes — dynamic time-of-day.
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

interface Props {
  scrollY?: number;
}

const CampfireScene = ({ scrollY = 0 }: Props) => {
  const s = Math.min(scrollY, 300);
  const time = getTimeSlot();
  const isNight = time === "night";
  const isSunset = time === "sunset";
  const isDawn = time === "dawn";
  const showStars = isNight;
  const showSun = !isNight;

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/40 via-amber-200/30 to-emerald-800/20",
    morning: "from-amber-200/40 via-sky-300/25 to-emerald-800/20",
    afternoon: "from-amber-300/50 via-orange-200/40 to-emerald-800/30",
    sunset: "from-orange-400/50 via-rose-300/40 to-purple-800/30",
    night: "from-indigo-950/80 via-slate-900/60 to-emerald-950/40",
  };

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl" style={{ height: 220 }}>
      {/* Sky gradient — dynamic */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${sky[time]} transition-colors duration-700`}
        style={{ transform: `translateY(${s * 0.05}px)` }}
      />

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="cf-glow2">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-groundGlow2">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Stars (night only) ── */}
        {showStars && (
        <g style={{ transform: `translateY(${s * -0.12}px)` }}>
          {[
            {x:18,y:12},{x:52,y:22},{x:95,y:8},{x:135,y:28},{x:178,y:14},
            {x:225,y:24},{x:268,y:10},{x:310,y:20},{x:348,y:16},{x:380,y:28},
            {x:40,y:35},{x:155,y:38},{x:290,y:34},{x:365,y:40},{x:70,y:42},
          ].map((st,i) => (
            <circle key={i} cx={st.x} cy={st.y} r={0.7 + (i % 3) * 0.3} fill="white" opacity="0.5"
              className="cf2-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          {/* Moon */}
          <circle cx="340" cy="24" r="10" fill="#E2E8F0" opacity="0.12" />
          <circle cx="340" cy="24" r="7" fill="#F1F5F9" opacity="0.8" />
          <circle cx="337" cy="22" r="1.2" fill="#CBD5E1" opacity="0.3" />
        </g>
        )}

        {/* ── Sun (daytime) ── */}
        {showSun && (
        <g style={{ transform: `translateY(${s * -0.1}px)` }}>
          <circle cx="345" cy={isDawn ? 36 : isSunset ? 32 : 20} r="22" fill={isSunset ? "#FB923C" : "#FBBF24"} opacity="0.2" />
          <circle cx="345" cy={isDawn ? 36 : isSunset ? 32 : 20} r="10" fill={isSunset ? "#F97316" : "#F59E0B"} opacity="0.45" />
          <circle cx="345" cy={isDawn ? 36 : isSunset ? 32 : 20} r="5" fill="#FDE68A" opacity="0.7" />
        </g>
        )}

        {/* ── Birds (daytime only) ── */}
        {showSun && (
        <g opacity="0.35">
          {[{x:60,y:22},{x:150,y:15},{x:280,y:28}].map((b,i) => (
            <path key={i} d={`M${b.x},${b.y} Q${b.x+4},${b.y-3} ${b.x+8},${b.y} Q${b.x+12},${b.y-3} ${b.x+16},${b.y}`}
              fill="none" stroke="hsl(20,30%,25%)" strokeWidth="1.4" strokeLinecap="round"
              className="cf2-bird" style={{ animationDelay: `${i * 3}s` }} />
          ))}
        </g>
        )}

        {/* ── Far mountains — VIVID green ── */}
        <g style={{ transform: `translateY(${s * -0.06}px)` }} opacity={isNight ? 0.55 : 0.9}>
          <path d="M0,95 L35,62 L75,78 L120,46 L165,70 L210,42 L260,65 L305,50 L345,68 L400,52 L400,95Z"
            fill="hsl(150,40%,38%)" />
          {/* Snow caps */}
          <path d="M210,42 L203,54 L217,54Z" fill="white" opacity="0.35" />
          <path d="M120,46 L114,56 L126,56Z" fill="white" opacity="0.3" />
          <path d="M305,50 L299,60 L311,60Z" fill="white" opacity="0.25" />
        </g>

        {/* ── Near mountains ── */}
        <g style={{ transform: `translateY(${s * -0.03}px)` }} opacity={isNight ? 0.6 : 0.95}>
          <path d="M0,105 L30,74 L70,90 L115,64 L160,85 L200,60 L245,78 L290,68 L335,84 L380,72 L400,80 L400,105Z"
            fill="hsl(150,38%,28%)" />
        </g>

        {/* ── Tree line ── */}
        <g style={{ transform: `translateY(${s * -0.02}px)` }}>
          {[8,28,48,68,92,118,265,290,315,340,365,388].map((x,i) => (
            <g key={i}>
              <rect x={x-0.8} y="98" width="1.6" height={5 + i%2} rx="0.5" fill="hsl(25,30%,18%)" />
              <polygon points={`${x},${95 - (i%2)*3} ${x-5-(i%2)},104 ${x+5+(i%2)},104`}
                fill="hsl(150,45%,22%)" className="cf2-foliage" />
              {i % 2 === 0 && (
                <polygon points={`${x},${91 - (i%3)*2} ${x-3},99 ${x+3},99`}
                  fill="hsl(150,48%,26%)" />
              )}
            </g>
          ))}
        </g>

        {/* ── Ground ── */}
        <path d="M0,104 Q60,96 130,104 Q200,112 270,102 Q340,93 400,104 L400,160 L0,160Z"
          fill="hsl(150,35%,16%)" className="cf2-ground" />
        <path d="M0,114 Q80,106 160,113 Q240,121 320,109 Q370,104 400,112 L400,160 L0,160Z"
          fill="hsl(150,30%,10%)" className="cf2-ground-deep" />

        {/* ── Ground glow from fire ── */}
        <ellipse cx="200" cy="128" rx="80" ry="22" fill="url(#cf-groundGlow2)" />

        {/* ── Logs ── */}
        <rect x="184" y="125" width="13" height="3.5" rx="1.5" fill="hsl(25,45%,30%)" opacity="0.8" transform="rotate(-12 190 126)" />
        <rect x="204" y="124" width="12" height="3.5" rx="1.5" fill="hsl(25,40%,32%)" opacity="0.75" transform="rotate(10 209 125)" />
        <rect x="192" y="127" width="10" height="3" rx="1" fill="hsl(25,35%,26%)" opacity="0.65" transform="rotate(5 197 128)" />

        {/* ── CAMPFIRE ── */}
        <circle cx="200" cy="116" r="35" fill="url(#cf-glow2)" />
        <ellipse cx="200" cy="116" rx="7" ry="14" fill="#FBBF24" opacity="0.85" className="cf2-flame1" />
        <ellipse cx="196" cy="114" rx="5" ry="11" fill="#F97316" opacity="0.75" className="cf2-flame2" />
        <ellipse cx="204" cy="115" rx="4" ry="10" fill="#EF4444" opacity="0.6" className="cf2-flame3" />
        <ellipse cx="200" cy="112" rx="3" ry="7" fill="#FDE68A" opacity="0.7" className="cf2-flame4" />
        {/* Embers */}
        {[
          {x:196,y:102,d:0},{x:204,y:100,d:0.5},{x:200,y:98,d:1},{x:192,y:104,d:1.5},{x:208,y:103,d:2},
          {x:198,y:96,d:2.5},{x:202,y:97,d:0.8},
        ].map((e,i) => (
          <circle key={i} cx={e.x} cy={e.y} r="1" fill="#FDE68A" opacity="0.8"
            className="cf2-ember" style={{ animationDelay: `${e.d}s` }} />
        ))}

        {/* ── HIKER SILHOUETTES — very dark for max contrast ── */}
        {/* Person 1 — sitting left */}
        <g>
          <circle cx="156" cy="106" r="5" fill="#1a1008" />
          <rect x="152" y="111" width="8" height="11" rx="2" fill="#1a1008" />
          <line x1="152" y1="122" x2="146" y2="128" stroke="#1a1008" strokeWidth="3" strokeLinecap="round" />
          <line x1="160" y1="122" x2="166" y2="128" stroke="#1a1008" strokeWidth="3" strokeLinecap="round" />
          <line x1="160" y1="114" x2="170" y2="117" stroke="#1a1008" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="152" y1="114" x2="144" y2="118" stroke="#1a1008" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Person 2 — sitting right, cup */}
        <g>
          <circle cx="244" cy="105" r="5.2" fill="#1c1109" />
          <rect x="240" y="110" width="8" height="12" rx="2" fill="#1c1109" />
          <line x1="240" y1="122" x2="234" y2="128" stroke="#1c1109" strokeWidth="3" strokeLinecap="round" />
          <line x1="248" y1="122" x2="254" y2="128" stroke="#1c1109" strokeWidth="3" strokeLinecap="round" />
          {/* Cup */}
          <rect x="232" y="112" width="5" height="6" rx="1.5" fill="#1c1109" />
          <path d="M234,110.5 Q233,108 234.5,106" fill="none" stroke="#d4c8a0" strokeWidth="0.7" opacity="0.4" className="cf2-steam" />
        </g>

        {/* Person 3 — behind fire left */}
        <g opacity="0.7">
          <circle cx="193" cy="97" r="4" fill="#1e120a" />
          <rect x="190" y="101" width="6" height="10" rx="1.5" fill="#1e120a" />
        </g>

        {/* Person 4 — behind fire right, guitar */}
        <g opacity="0.7">
          <circle cx="212" cy="96" r="4.2" fill="#1a100a" />
          <rect x="209" y="100" width="6.5" height="10" rx="1.5" fill="#1a100a" />
          <ellipse cx="218" cy="105" rx="3.5" ry="4.5" fill="#2a1a10" />
          <line x1="218" y1="100.5" x2="218" y2="97" stroke="#2a1a10" strokeWidth="1" />
        </g>

        {/* Person 5 — standing far left */}
        <g opacity="0.65">
          <circle cx="133" cy="99" r="4.5" fill="#1a100a" />
          <rect x="130" y="103.5" width="6.5" height="16" rx="1.5" fill="#1a100a" />
          <line x1="130" y1="119" x2="127" y2="128" stroke="#1a100a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="136.5" y1="119" x2="140" y2="128" stroke="#1a100a" strokeWidth="2.5" strokeLinecap="round" />
          {/* Walking stick */}
          <line x1="140" y1="106" x2="143" y2="128" stroke="#2a1a10" strokeWidth="1.4" />
        </g>

        {/* ── Tent ── */}
        <g style={{ transform: `translateY(${s * -0.02}px)` }}>
          <polygon points="316,106 342,106 329,86" fill="hsl(150,25%,20%)" opacity="0.8" />
          <line x1="329" y1="86" x2="329" y2="80" stroke="hsl(150,25%,20%)" strokeWidth="0.8" />
          <polygon points="329,80 329,83.5 334,81.8" fill="#E8953A" opacity="0.7" className="cf2-flag" />
        </g>

        {/* ── Backpacks ── */}
        <rect x="163" y="122" width="6.5" height="7.5" rx="2" fill="hsl(25,35%,22%)" opacity="0.7" />
        <rect x="252" y="123" width="6" height="7" rx="2" fill="hsl(150,30%,20%)" opacity="0.7" />

        {/* ── Fireflies ── */}
        <g style={{ transform: `translateY(${s * -0.08}px)` }}>
          {[{x:110,y:88},{x:285,y:82},{x:155,y:72},{x:248,y:76},{x:345,y:92},{x:65,y:85},{x:180,y:68},{x:320,y:78}].map((f,i) => (
            <circle key={i} cx={f.x} cy={f.y} r="1.5" fill="#FDE68A"
              className="cf2-firefly" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>
      </svg>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <style>{`
        /* ── Animations ── */
        .cf2-twinkle { animation: cf2-twinkle 3s ease-in-out infinite; }
        .cf2-flame1 { animation: cf2-flicker 0.9s ease-in-out infinite; transform-origin: 200px 130px; }
        .cf2-flame2 { animation: cf2-flicker 0.7s ease-in-out 0.15s infinite; transform-origin: 196px 130px; }
        .cf2-flame3 { animation: cf2-flicker 0.8s ease-in-out 0.3s infinite; transform-origin: 204px 130px; }
        .cf2-flame4 { animation: cf2-flicker 0.6s ease-in-out 0.45s infinite; transform-origin: 200px 130px; }
        .cf2-ember { animation: cf2-emberRise 2.5s ease-out infinite; }
        .cf2-firefly { animation: cf2-glow 3s ease-in-out infinite; }
        .cf2-steam { animation: cf2-steamRise 3s ease-out infinite; }
        .cf2-flag { animation: cf2-flagWave 2s ease-in-out infinite; transform-origin: 329px 81.8px; }
        .cf2-bird { animation: cf2-birdFly 14s linear infinite; }

        @keyframes cf2-twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.9; } }
        @keyframes cf2-flicker { 0%,100% { transform: scaleY(1) scaleX(1); } 30% { transform: scaleY(1.18) scaleX(0.82); } 60% { transform: scaleY(0.86) scaleX(1.12); } }
        @keyframes cf2-emberRise { 0% { opacity: 0.9; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-24px) translateX(6px) scale(0.1); } }
        @keyframes cf2-glow { 0%,100% { opacity: 0.08; } 35% { opacity: 0.85; } 55% { opacity: 0.15; } 80% { opacity: 0.7; } }
        @keyframes cf2-steamRise { 0% { opacity: 0.4; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-14px); } }
        @keyframes cf2-flagWave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        @keyframes cf2-birdFly { from { transform: translateX(420px); } to { transform: translateX(-30px); } }
      `}</style>
    </div>
  );
};

export default CampfireScene;
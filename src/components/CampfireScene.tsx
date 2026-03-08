/**
 * CampfireScene — Animated SVG banner for Communities page.
 * Campfire with gathered hiker silhouettes under a warm sky.
 * Adapts to light/dark mode with proper contrast.
 */

interface Props {
  scrollY?: number;
}

const CampfireScene = ({ scrollY = 0 }: Props) => {
  const s = Math.min(scrollY, 300);

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl" style={{ height: 220 }}>
      {/* Sky — warm golden dusk (light) / deep night (dark) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-amber-400/30 via-orange-300/20 to-primary/10 dark:from-indigo-950/60 dark:via-slate-900/40 dark:to-primary/10"
        style={{ transform: `translateY(${s * 0.05}px)` }}
      />

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="cf-glow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#F97316" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-groundGlow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          {/* Light mode: warm green mountains / Dark mode: deeper */}
          <linearGradient id="cf-mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,42%)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(150,25%,32%)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="cf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,22%)" />
            <stop offset="100%" stopColor="hsl(150,25%,14%)" />
          </linearGradient>
        </defs>

        {/* ── Stars (parallax: fastest) — visible in dark, hidden in light ── */}
        <g style={{ transform: `translateY(${s * -0.12}px)` }} className="opacity-0 dark:opacity-100 transition-opacity duration-500">
          {[
            {x:18,y:12},{x:52,y:22},{x:95,y:8},{x:135,y:28},{x:178,y:14},
            {x:225,y:24},{x:268,y:10},{x:310,y:20},{x:348,y:16},{x:380,y:28},
            {x:40,y:35},{x:155,y:38},{x:290,y:34},{x:365,y:40},{x:70,y:42},
          ].map((st,i) => (
            <circle key={i} cx={st.x} cy={st.y} r={0.6 + (i % 3) * 0.3} fill="white" opacity="0.4"
              className="cf-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          {/* Moon */}
          <circle cx="340" cy="24" r="10" fill="#E2E8F0" opacity="0.1" />
          <circle cx="340" cy="24" r="7" fill="#F1F5F9" opacity="0.7" />
          <circle cx="337" cy="22" r="1.2" fill="#CBD5E1" opacity="0.25" />
        </g>

        {/* ── Light-mode sun glow (hidden in dark) ── */}
        <g className="opacity-100 dark:opacity-0 transition-opacity duration-500" style={{ transform: `translateY(${s * -0.1}px)` }}>
          <circle cx="340" cy="20" r="18" fill="#FBBF24" opacity="0.12" />
          <circle cx="340" cy="20" r="8" fill="#F59E0B" opacity="0.25" />
          <circle cx="340" cy="20" r="4" fill="#FDE68A" opacity="0.4" />
        </g>

        {/* ── Far mountains (parallax: medium) ── */}
        <g style={{ transform: `translateY(${s * -0.06}px)` }}>
          <path d="M0,95 L35,65 L75,80 L120,50 L165,72 L210,48 L260,68 L305,54 L345,70 L400,56 L400,95Z"
            fill="hsl(150,28%,38%)" className="opacity-50 dark:opacity-30" />
          {/* Snow caps */}
          <path d="M210,48 L204,58 L216,58Z" fill="white" opacity="0.2" />
          <path d="M120,50 L115,58 L125,58Z" fill="white" opacity="0.15" />
          <path d="M305,54 L300,62 L310,62Z" fill="white" opacity="0.15" />
        </g>

        {/* ── Near mountains (parallax: slow) ── */}
        <g style={{ transform: `translateY(${s * -0.03}px)` }}>
          <path d="M0,105 L30,78 L70,92 L115,68 L160,88 L200,65 L245,82 L290,72 L335,86 L380,76 L400,82 L400,105Z"
            fill="hsl(150,30%,28%)" className="opacity-60 dark:opacity-50" />
        </g>

        {/* ── Tree line ── */}
        <g style={{ transform: `translateY(${s * -0.02}px)` }}>
          {[8,28,48,68,92,118,265,290,315,340,365,388].map((x,i) => (
            <g key={i}>
              <rect x={x-0.8} y="98" width="1.6" height={5 + i%2} rx="0.5" fill="hsl(25,25%,22%)" className="opacity-40 dark:opacity-30" />
              <polygon points={`${x},${96 - (i%2)*3} ${x-5-(i%2)},104 ${x+5+(i%2)},104`}
                fill="hsl(150,35%,22%)" className="opacity-50 dark:opacity-40"
                style={{ transformOrigin: `${x}px 104px` }} />
              {i % 2 === 0 && (
                <polygon points={`${x},${92 - (i%3)*2} ${x-3},99 ${x+3},99`}
                  fill="hsl(150,38%,26%)" className="opacity-40 dark:opacity-30" />
              )}
            </g>
          ))}
        </g>

        {/* ── Ground ── */}
        <path d="M0,104 Q60,97 130,104 Q200,112 270,102 Q340,94 400,104 L400,160 L0,160Z"
          fill="hsl(150,28%,18%)" className="opacity-70 dark:opacity-60" />
        <path d="M0,114 Q80,107 160,113 Q240,120 320,110 Q370,105 400,112 L400,160 L0,160Z"
          fill="hsl(150,22%,12%)" className="opacity-60 dark:opacity-50" />

        {/* ── Ground glow from fire ── */}
        <ellipse cx="200" cy="128" rx="70" ry="18" fill="url(#cf-groundGlow)" />

        {/* ── Logs ── */}
        <rect x="184" y="125" width="12" height="3" rx="1.5" fill="hsl(25,35%,25%)" opacity="0.6" transform="rotate(-12 190 126)" />
        <rect x="204" y="124" width="11" height="3" rx="1.5" fill="hsl(25,30%,28%)" opacity="0.55" transform="rotate(10 209 125)" />
        <rect x="192" y="127" width="10" height="2.5" rx="1" fill="hsl(25,25%,22%)" opacity="0.45" transform="rotate(5 197 128)" />

        {/* ── CAMPFIRE ── */}
        <circle cx="200" cy="116" r="30" fill="url(#cf-glow)" />
        {/* Main flames — bright & visible in both modes */}
        <ellipse cx="200" cy="116" rx="5.5" ry="11" fill="#FBBF24" opacity="0.7" className="cf-flame1" />
        <ellipse cx="196" cy="114" rx="3.5" ry="9" fill="#F97316" opacity="0.6" className="cf-flame2" />
        <ellipse cx="204" cy="115" rx="3" ry="8" fill="#EF4444" opacity="0.45" className="cf-flame3" />
        <ellipse cx="200" cy="112" rx="2.2" ry="5.5" fill="#FDE68A" opacity="0.55" className="cf-flame4" />
        {/* Embers */}
        {[
          {x:196,y:105,d:0},{x:204,y:103,d:0.5},{x:200,y:101,d:1},{x:192,y:107,d:1.5},{x:208,y:106,d:2},
          {x:198,y:99,d:2.5},{x:202,y:100,d:0.8},
        ].map((e,i) => (
          <circle key={i} cx={e.x} cy={e.y} r="0.8" fill="#FDE68A" opacity="0.6"
            className="cf-ember" style={{ animationDelay: `${e.d}s` }} />
        ))}

        {/* ── HIKER SILHOUETTES — higher opacity for visibility ── */}
        {/* Person 1 — sitting left, warming hands */}
        <g className="opacity-70 dark:opacity-55">
          <circle cx="156" cy="106" r="4.2" fill="hsl(25,20%,18%)" />
          <rect x="153" y="110" width="6.5" height="10" rx="2" fill="hsl(25,20%,18%)" />
          <line x1="153" y1="120" x2="148" y2="125" stroke="hsl(25,20%,18%)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="159.5" y1="120" x2="164" y2="125" stroke="hsl(25,20%,18%)" strokeWidth="2.2" strokeLinecap="round" />
          {/* Arms reaching to fire */}
          <line x1="159.5" y1="113" x2="170" y2="116" stroke="hsl(25,20%,18%)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="153" y1="114" x2="146" y2="118" stroke="hsl(25,20%,18%)" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Person 2 — sitting right, holding cup */}
        <g className="opacity-65 dark:opacity-50">
          <circle cx="244" cy="105" r="4.4" fill="hsl(25,18%,17%)" />
          <rect x="241" y="109" width="7" height="11" rx="2" fill="hsl(25,18%,17%)" />
          <line x1="241" y1="120" x2="236" y2="126" stroke="hsl(25,18%,17%)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="248" y1="120" x2="252" y2="126" stroke="hsl(25,18%,17%)" strokeWidth="2.2" strokeLinecap="round" />
          {/* Cup */}
          <rect x="235" y="111" width="3.5" height="4.5" rx="1" fill="hsl(25,18%,17%)" />
          {/* Steam */}
          <path d="M236,110 Q235,108 236.5,106" fill="none" stroke="hsl(45,20%,60%)" strokeWidth="0.5" opacity="0.25" className="cf-steam" />
        </g>

        {/* Person 3 — behind fire left (depth) */}
        <g className="opacity-50 dark:opacity-35">
          <circle cx="193" cy="98" r="3.2" fill="hsl(25,15%,16%)" />
          <rect x="191" y="101" width="5.2" height="8.5" rx="1.5" fill="hsl(25,15%,16%)" />
        </g>

        {/* Person 4 — behind fire right, with guitar */}
        <g className="opacity-45 dark:opacity-30">
          <circle cx="212" cy="97" r="3.5" fill="hsl(25,15%,15%)" />
          <rect x="209.5" y="100.5" width="5.8" height="9" rx="1.5" fill="hsl(25,15%,15%)" />
          {/* Guitar */}
          <ellipse cx="217" cy="105" rx="2.8" ry="3.8" fill="hsl(25,22%,18%)" />
          <line x1="217" y1="101" x2="217" y2="98" stroke="hsl(25,22%,18%)" strokeWidth="0.7" />
        </g>

        {/* Person 5 — standing far left, just arriving */}
        <g className="opacity-40 dark:opacity-25">
          <circle cx="133" cy="100" r="3.8" fill="hsl(25,15%,15%)" />
          <rect x="130.5" y="104" width="5.5" height="14" rx="1.5" fill="hsl(25,15%,15%)" />
          <line x1="130.5" y1="118" x2="128" y2="125" stroke="hsl(25,15%,15%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="136" y1="118" x2="138.5" y2="125" stroke="hsl(25,15%,15%)" strokeWidth="2" strokeLinecap="round" />
          {/* Walking stick */}
          <line x1="138.5" y1="106" x2="141" y2="125" stroke="hsl(25,20%,22%)" strokeWidth="1" />
        </g>

        {/* ── Tent ── */}
        <g className="opacity-35 dark:opacity-20" style={{ transform: `translateY(${s * -0.02}px)` }}>
          <polygon points="318,106 340,106 329,88" fill="hsl(150,18%,18%)" />
          <line x1="329" y1="88" x2="329" y2="82" stroke="hsl(150,18%,18%)" strokeWidth="0.6" />
          <polygon points="329,82 329,85 333,83.5" fill="hsl(25,60%,50%)" opacity="0.4" className="cf-flag" />
        </g>

        {/* ── Backpacks ── */}
        <rect x="163" y="122" width="5.5" height="6.5" rx="1.8" fill="hsl(25,28%,22%)" className="opacity-40 dark:opacity-30" />
        <rect x="252" y="123" width="5" height="6" rx="1.8" fill="hsl(150,22%,20%)" className="opacity-35 dark:opacity-25" />

        {/* ── Fireflies (parallax) ── */}
        <g style={{ transform: `translateY(${s * -0.08}px)` }}>
          {[{x:110,y:88},{x:285,y:82},{x:155,y:72},{x:248,y:76},{x:345,y:92},{x:65,y:85},{x:180,y:68},{x:320,y:78}].map((f,i) => (
            <circle key={i} cx={f.x} cy={f.y} r="1.3" fill="#FDE68A"
              className="cf-firefly" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>

        {/* ── Light-mode birds (hidden in dark) ── */}
        <g className="opacity-20 dark:opacity-0 transition-opacity duration-500">
          {[{x:60,y:25},{x:150,y:18},{x:280,y:30}].map((b,i) => (
            <path key={i} d={`M${b.x},${b.y} Q${b.x+4},${b.y-3} ${b.x+8},${b.y} Q${b.x+12},${b.y-3} ${b.x+16},${b.y}`}
              fill="none" stroke="hsl(25,20%,25%)" strokeWidth="1" strokeLinecap="round"
              className="cf-bird" style={{ animationDelay: `${i * 3}s` }} />
          ))}
        </g>
      </svg>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/60 to-transparent" />

      <style>{`
        .cf-twinkle { animation: cf-twinkle 3s ease-in-out infinite; }
        .cf-flame1 { animation: cf-flicker 0.9s ease-in-out infinite; transform-origin: 200px 127px; }
        .cf-flame2 { animation: cf-flicker 0.7s ease-in-out 0.15s infinite; transform-origin: 196px 127px; }
        .cf-flame3 { animation: cf-flicker 0.8s ease-in-out 0.3s infinite; transform-origin: 204px 127px; }
        .cf-flame4 { animation: cf-flicker 0.6s ease-in-out 0.45s infinite; transform-origin: 200px 127px; }
        .cf-ember { animation: cf-emberRise 2.5s ease-out infinite; }
        .cf-tree { animation: cf-sway 5s ease-in-out infinite; }
        .cf-firefly { animation: cf-glow 3s ease-in-out infinite; }
        .cf-steam { animation: cf-steamRise 3s ease-out infinite; }
        .cf-flag { animation: cf-flagWave 2s ease-in-out infinite; transform-origin: 329px 83.5px; }
        .cf-bird { animation: cf-birdFly 12s linear infinite; }

        @keyframes cf-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.8; } }
        @keyframes cf-flicker { 0%,100% { transform: scaleY(1) scaleX(1); } 30% { transform: scaleY(1.15) scaleX(0.85); } 60% { transform: scaleY(0.88) scaleX(1.1); } }
        @keyframes cf-emberRise { 0% { opacity: 0.7; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-20px) translateX(5px) scale(0.2); } }
        @keyframes cf-sway { 0%,100% { transform: rotate(0deg); } 40% { transform: rotate(1deg); } 70% { transform: rotate(-0.6deg); } }
        @keyframes cf-glow { 0%,100% { opacity: 0.05; } 35% { opacity: 0.7; } 55% { opacity: 0.1; } 80% { opacity: 0.6; } }
        @keyframes cf-steamRise { 0% { opacity: 0.25; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px); } }
        @keyframes cf-flagWave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
        @keyframes cf-birdFly { from { transform: translateX(420px); } to { transform: translateX(-30px); } }
      `}</style>
    </div>
  );
};

export default CampfireScene;

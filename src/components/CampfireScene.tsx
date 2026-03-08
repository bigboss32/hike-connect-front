/**
 * CampfireScene — Animated SVG banner for Communities page.
 * Campfire with gathered hiker silhouettes under a warm sky.
 * Uses CSS class scoping for light/dark contrast.
 */

interface Props {
  scrollY?: number;
}

const CampfireScene = ({ scrollY = 0 }: Props) => {
  const s = Math.min(scrollY, 300);

  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl cf-scene" style={{ height: 220 }}>
      {/* Sky — warm golden dusk (light) / deep night (dark) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-amber-500/35 via-orange-300/25 to-primary/15 dark:from-indigo-950/60 dark:via-slate-900/40 dark:to-primary/10"
        style={{ transform: `translateY(${s * 0.05}px)` }}
      />

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="cf-glow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#F97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-groundGlow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cf-mtn-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,35%,45%)" />
            <stop offset="100%" stopColor="hsl(150,30%,35%)" />
          </linearGradient>
          <linearGradient id="cf-mtn-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,35%,35%)" />
            <stop offset="100%" stopColor="hsl(150,30%,25%)" />
          </linearGradient>
          <linearGradient id="cf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,20%)" />
            <stop offset="100%" stopColor="hsl(150,28%,12%)" />
          </linearGradient>
        </defs>

        {/* ── Stars — hidden via CSS in light mode ── */}
        <g style={{ transform: `translateY(${s * -0.12}px)` }} className="cf-stars">
          {[
            {x:18,y:12},{x:52,y:22},{x:95,y:8},{x:135,y:28},{x:178,y:14},
            {x:225,y:24},{x:268,y:10},{x:310,y:20},{x:348,y:16},{x:380,y:28},
            {x:40,y:35},{x:155,y:38},{x:290,y:34},{x:365,y:40},{x:70,y:42},
          ].map((st,i) => (
            <circle key={i} cx={st.x} cy={st.y} r={0.6 + (i % 3) * 0.3} fill="white" opacity="0.45"
              className="cf-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <circle cx="340" cy="24" r="10" fill="#E2E8F0" opacity="0.1" />
          <circle cx="340" cy="24" r="7" fill="#F1F5F9" opacity="0.7" />
          <circle cx="337" cy="22" r="1.2" fill="#CBD5E1" opacity="0.25" />
        </g>

        {/* ── Sun glow — hidden via CSS in dark mode ── */}
        <g className="cf-sun" style={{ transform: `translateY(${s * -0.1}px)` }}>
          <circle cx="345" cy="18" r="20" fill="#FBBF24" opacity="0.15" />
          <circle cx="345" cy="18" r="9" fill="#F59E0B" opacity="0.3" />
          <circle cx="345" cy="18" r="4" fill="#FDE68A" opacity="0.5" />
        </g>

        {/* ── Far mountains ── */}
        <g style={{ transform: `translateY(${s * -0.06}px)` }}>
          <path d="M0,95 L35,62 L75,78 L120,46 L165,70 L210,42 L260,65 L305,50 L345,68 L400,52 L400,95Z"
            fill="url(#cf-mtn-far)" className="cf-mtn-far" />
          <path d="M210,42 L203,54 L217,54Z" fill="white" opacity="0.25" />
          <path d="M120,46 L114,56 L126,56Z" fill="white" opacity="0.2" />
          <path d="M305,50 L299,60 L311,60Z" fill="white" opacity="0.18" />
        </g>

        {/* ── Near mountains ── */}
        <g style={{ transform: `translateY(${s * -0.03}px)` }}>
          <path d="M0,105 L30,74 L70,90 L115,64 L160,85 L200,60 L245,78 L290,68 L335,84 L380,72 L400,80 L400,105Z"
            fill="url(#cf-mtn-near)" className="cf-mtn-near" />
        </g>

        {/* ── Tree line ── */}
        <g style={{ transform: `translateY(${s * -0.02}px)` }}>
          {[8,28,48,68,92,118,265,290,315,340,365,388].map((x,i) => (
            <g key={i}>
              <rect x={x-0.8} y="98" width="1.6" height={5 + i%2} rx="0.5" fill="hsl(25,25%,20%)" className="cf-trunk" />
              <polygon points={`${x},${95 - (i%2)*3} ${x-5-(i%2)},104 ${x+5+(i%2)},104`}
                fill="hsl(150,38%,20%)" className="cf-foliage"
                style={{ transformOrigin: `${x}px 104px` }} />
              {i % 2 === 0 && (
                <polygon points={`${x},${91 - (i%3)*2} ${x-3},99 ${x+3},99`}
                  fill="hsl(150,40%,24%)" className="cf-foliage-top" />
              )}
            </g>
          ))}
        </g>

        {/* ── Ground ── */}
        <path d="M0,104 Q60,96 130,104 Q200,112 270,102 Q340,93 400,104 L400,160 L0,160Z"
          fill="url(#cf-ground)" className="cf-ground" />
        <path d="M0,114 Q80,106 160,113 Q240,121 320,109 Q370,104 400,112 L400,160 L0,160Z"
          fill="hsl(150,25%,10%)" className="cf-ground-deep" />

        {/* ── Ground glow ── */}
        <ellipse cx="200" cy="128" rx="75" ry="20" fill="url(#cf-groundGlow)" />

        {/* ── Logs ── */}
        <rect x="184" y="125" width="12" height="3.5" rx="1.5" fill="hsl(25,40%,28%)" opacity="0.7" transform="rotate(-12 190 126)" />
        <rect x="204" y="124" width="11" height="3.5" rx="1.5" fill="hsl(25,35%,30%)" opacity="0.65" transform="rotate(10 209 125)" />
        <rect x="192" y="127" width="10" height="3" rx="1" fill="hsl(25,30%,24%)" opacity="0.55" transform="rotate(5 197 128)" />

        {/* ── CAMPFIRE — bright in both modes ── */}
        <circle cx="200" cy="116" r="32" fill="url(#cf-glow)" />
        <ellipse cx="200" cy="116" rx="6" ry="12" fill="#FBBF24" opacity="0.75" className="cf-flame1" />
        <ellipse cx="196" cy="114" rx="4" ry="10" fill="#F97316" opacity="0.65" className="cf-flame2" />
        <ellipse cx="204" cy="115" rx="3.5" ry="9" fill="#EF4444" opacity="0.5" className="cf-flame3" />
        <ellipse cx="200" cy="112" rx="2.5" ry="6" fill="#FDE68A" opacity="0.6" className="cf-flame4" />
        {/* Embers */}
        {[
          {x:196,y:104,d:0},{x:204,y:102,d:0.5},{x:200,y:100,d:1},{x:192,y:106,d:1.5},{x:208,y:105,d:2},
          {x:198,y:98,d:2.5},{x:202,y:99,d:0.8},
        ].map((e,i) => (
          <circle key={i} cx={e.x} cy={e.y} r="0.9" fill="#FDE68A" opacity="0.7"
            className="cf-ember" style={{ animationDelay: `${e.d}s` }} />
        ))}

        {/* ── HIKER SILHOUETTES — dark brown, high contrast ── */}
        {/* Person 1 — sitting left */}
        <g className="cf-hiker">
          <circle cx="156" cy="106" r="4.5" fill="hsl(20,25%,12%)" />
          <rect x="152.5" y="110.5" width="7" height="10.5" rx="2" fill="hsl(20,25%,12%)" />
          <line x1="152.5" y1="121" x2="147" y2="126" stroke="hsl(20,25%,12%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="159.5" y1="121" x2="164.5" y2="126" stroke="hsl(20,25%,12%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="159.5" y1="113" x2="170" y2="116.5" stroke="hsl(20,25%,12%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="152.5" y1="114" x2="145" y2="118" stroke="hsl(20,25%,12%)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Person 2 — sitting right, cup */}
        <g className="cf-hiker">
          <circle cx="244" cy="105" r="4.8" fill="hsl(20,22%,13%)" />
          <rect x="240.5" y="110" width="7.5" height="11" rx="2" fill="hsl(20,22%,13%)" />
          <line x1="240.5" y1="121" x2="235" y2="127" stroke="hsl(20,22%,13%)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="248" y1="121" x2="253" y2="127" stroke="hsl(20,22%,13%)" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="234" y="111" width="4" height="5" rx="1.2" fill="hsl(20,22%,13%)" />
          <path d="M235.5,110 Q234.5,108 236,106" fill="none" stroke="hsl(45,25%,55%)" strokeWidth="0.6" opacity="0.35" className="cf-steam" />
        </g>

        {/* Person 3 — behind fire left */}
        <g className="cf-hiker-bg">
          <circle cx="193" cy="97" r="3.5" fill="hsl(20,20%,14%)" />
          <rect x="190.5" y="100.5" width="5.5" height="9" rx="1.5" fill="hsl(20,20%,14%)" />
        </g>

        {/* Person 4 — behind fire right, guitar */}
        <g className="cf-hiker-bg">
          <circle cx="212" cy="96" r="3.8" fill="hsl(20,18%,13%)" />
          <rect x="209" y="100" width="6" height="9.5" rx="1.5" fill="hsl(20,18%,13%)" />
          <ellipse cx="217.5" cy="105" rx="3" ry="4" fill="hsl(20,24%,16%)" />
          <line x1="217.5" y1="101" x2="217.5" y2="97.5" stroke="hsl(20,24%,16%)" strokeWidth="0.8" />
        </g>

        {/* Person 5 — standing far left, arriving */}
        <g className="cf-hiker-far">
          <circle cx="133" cy="99" r="4" fill="hsl(20,18%,12%)" />
          <rect x="130" y="103" width="6" height="15" rx="1.5" fill="hsl(20,18%,12%)" />
          <line x1="130" y1="118" x2="127" y2="126" stroke="hsl(20,18%,12%)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="136" y1="118" x2="139" y2="126" stroke="hsl(20,18%,12%)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="139" y1="105" x2="142" y2="126" stroke="hsl(20,22%,18%)" strokeWidth="1.2" />
        </g>

        {/* ── Tent ── */}
        <g className="cf-tent" style={{ transform: `translateY(${s * -0.02}px)` }}>
          <polygon points="316,106 342,106 329,86" fill="hsl(150,20%,16%)" />
          <line x1="329" y1="86" x2="329" y2="80" stroke="hsl(150,20%,16%)" strokeWidth="0.7" />
          <polygon points="329,80 329,83.5 334,81.8" fill="hsl(25,65%,50%)" opacity="0.5" className="cf-flag" />
        </g>

        {/* ── Backpacks ── */}
        <rect x="163" y="122" width="6" height="7" rx="2" fill="hsl(25,30%,20%)" className="cf-pack" />
        <rect x="252" y="123" width="5.5" height="6.5" rx="2" fill="hsl(150,25%,18%)" className="cf-pack" />

        {/* ── Fireflies ── */}
        <g style={{ transform: `translateY(${s * -0.08}px)` }}>
          {[{x:110,y:88},{x:285,y:82},{x:155,y:72},{x:248,y:76},{x:345,y:92},{x:65,y:85},{x:180,y:68},{x:320,y:78}].map((f,i) => (
            <circle key={i} cx={f.x} cy={f.y} r="1.4" fill="#FDE68A"
              className="cf-firefly" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </g>

        {/* ── Birds (light mode only via CSS) ── */}
        <g className="cf-birds">
          {[{x:60,y:22},{x:150,y:15},{x:280,y:28}].map((b,i) => (
            <path key={i} d={`M${b.x},${b.y} Q${b.x+4},${b.y-3} ${b.x+8},${b.y} Q${b.x+12},${b.y-3} ${b.x+16},${b.y}`}
              fill="none" stroke="hsl(20,25%,20%)" strokeWidth="1.2" strokeLinecap="round"
              className="cf-bird" style={{ animationDelay: `${i * 3}s` }} />
          ))}
        </g>
      </svg>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/70 to-transparent" />

      <style>{`
        /* ── Theme-adaptive opacities via parent class ── */
        .cf-stars { opacity: 0; }
        .cf-sun { opacity: 1; }
        .cf-mtn-far { opacity: 0.7; }
        .cf-mtn-near { opacity: 0.75; }
        .cf-foliage { opacity: 0.7; }
        .cf-foliage-top { opacity: 0.6; }
        .cf-trunk { opacity: 0.6; }
        .cf-ground { opacity: 0.85; }
        .cf-ground-deep { opacity: 0.7; }
        .cf-hiker { opacity: 0.8; }
        .cf-hiker-bg { opacity: 0.6; }
        .cf-hiker-far { opacity: 0.5; }
        .cf-tent { opacity: 0.5; }
        .cf-pack { opacity: 0.5; }
        .cf-birds { opacity: 0.25; }

        .dark .cf-stars { opacity: 1; }
        .dark .cf-sun { opacity: 0; }
        .dark .cf-mtn-far { opacity: 0.4; }
        .dark .cf-mtn-near { opacity: 0.45; }
        .dark .cf-foliage { opacity: 0.4; }
        .dark .cf-foliage-top { opacity: 0.35; }
        .dark .cf-trunk { opacity: 0.35; }
        .dark .cf-ground { opacity: 0.65; }
        .dark .cf-ground-deep { opacity: 0.55; }
        .dark .cf-hiker { opacity: 0.55; }
        .dark .cf-hiker-bg { opacity: 0.35; }
        .dark .cf-hiker-far { opacity: 0.28; }
        .dark .cf-tent { opacity: 0.22; }
        .dark .cf-pack { opacity: 0.3; }
        .dark .cf-birds { opacity: 0; }

        /* ── Animations ── */
        .cf-twinkle { animation: cf-twinkle 3s ease-in-out infinite; }
        .cf-flame1 { animation: cf-flicker 0.9s ease-in-out infinite; transform-origin: 200px 128px; }
        .cf-flame2 { animation: cf-flicker 0.7s ease-in-out 0.15s infinite; transform-origin: 196px 128px; }
        .cf-flame3 { animation: cf-flicker 0.8s ease-in-out 0.3s infinite; transform-origin: 204px 128px; }
        .cf-flame4 { animation: cf-flicker 0.6s ease-in-out 0.45s infinite; transform-origin: 200px 128px; }
        .cf-ember { animation: cf-emberRise 2.5s ease-out infinite; }
        .cf-firefly { animation: cf-glow 3s ease-in-out infinite; }
        .cf-steam { animation: cf-steamRise 3s ease-out infinite; }
        .cf-flag { animation: cf-flagWave 2s ease-in-out infinite; transform-origin: 329px 81.8px; }
        .cf-bird { animation: cf-birdFly 14s linear infinite; }

        @keyframes cf-twinkle { 0%,100% { opacity: 0.15; } 50% { opacity: 0.85; } }
        @keyframes cf-flicker { 0%,100% { transform: scaleY(1) scaleX(1); } 30% { transform: scaleY(1.15) scaleX(0.85); } 60% { transform: scaleY(0.88) scaleX(1.1); } }
        @keyframes cf-emberRise { 0% { opacity: 0.8; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-22px) translateX(5px) scale(0.15); } }
        @keyframes cf-glow { 0%,100% { opacity: 0.05; } 35% { opacity: 0.75; } 55% { opacity: 0.1; } 80% { opacity: 0.65; } }
        @keyframes cf-steamRise { 0% { opacity: 0.35; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-12px); } }
        @keyframes cf-flagWave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
        @keyframes cf-birdFly { from { transform: translateX(420px); } to { transform: translateX(-30px); } }
      `}</style>
    </div>
  );
};

export default CampfireScene;

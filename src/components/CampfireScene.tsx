/**
 * CampfireScene — Animated SVG banner for Communities page.
 * Campfire with gathered hiker silhouettes, starry sky, warm glow.
 */

const CampfireScene = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-b-2xl" style={{ height: 200 }}>
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-slate-900/30 to-background" />

      <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="cf-glow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cf-groundGlow">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cf-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,28%,16%)" />
            <stop offset="100%" stopColor="hsl(150,25%,10%)" />
          </linearGradient>
          <linearGradient id="cf-mtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,25%,22%)" />
            <stop offset="100%" stopColor="hsl(150,20%,14%)" />
          </linearGradient>
        </defs>

        {/* ── Stars ── */}
        {[
          {x:18,y:12},{x:52,y:22},{x:95,y:8},{x:135,y:28},{x:178,y:14},
          {x:225,y:24},{x:268,y:10},{x:310,y:20},{x:348,y:16},{x:380,y:28},
          {x:40,y:35},{x:155,y:38},{x:290,y:34},{x:365,y:40},{x:70,y:42},
        ].map((s,i) => (
          <circle key={i} cx={s.x} cy={s.y} r={0.6 + (i % 3) * 0.3} fill="white" opacity="0.25"
            className="cf-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}

        {/* ── Moon ── */}
        <circle cx="340" cy="24" r="10" fill="#E2E8F0" opacity="0.08" />
        <circle cx="340" cy="24" r="7" fill="#F1F5F9" opacity="0.6" />
        <circle cx="337" cy="22" r="1.2" fill="#CBD5E1" opacity="0.2" />

        {/* ── Mountains ── */}
        <path d="M0,100 L40,70 L80,85 L130,58 L175,78 L220,55 L265,72 L310,60 L350,75 L400,62 L400,100Z"
          fill="url(#cf-mtn)" opacity="0.5" />
        <path d="M220,55 L215,63 L225,63Z" fill="white" opacity="0.12" />
        <path d="M130,58 L126,65 L134,65Z" fill="white" opacity="0.1" />

        {/* ── Tree line ── */}
        {[10,35,60,85,115,145,260,285,315,345,375].map((x,i) => (
          <polygon key={i} points={`${x},105 ${x-4-(i%2)},92 ${x+4+(i%2)},92`}
            fill="hsl(150,35%,14%)" opacity={0.4 + (i%2)*0.1}
            className="cf-tree" style={{ animationDelay: `${i*0.4}s`, transformOrigin: `${x}px 105px` }} />
        ))}

        {/* ── Ground ── */}
        <path d="M0,105 Q100,98 200,105 Q300,112 400,102 L400,160 L0,160Z" fill="url(#cf-ground)" />
        <path d="M0,115 Q80,108 160,114 Q240,120 320,110 Q370,106 400,112 L400,160 L0,160Z"
          fill="hsl(150,22%,8%)" opacity="0.5" />

        {/* ── Ground glow from fire ── */}
        <ellipse cx="200" cy="130" rx="80" ry="20" fill="url(#cf-groundGlow)" />

        {/* ── Log ring around fire ── */}
        <ellipse cx="200" cy="128" rx="22" ry="4" fill="none" stroke="hsl(25,30%,18%)" strokeWidth="1.5" opacity="0.3" />
        {/* Individual logs */}
        <rect x="183" y="126" width="12" height="3" rx="1.5" fill="hsl(25,35%,20%)" opacity="0.5" transform="rotate(-15 189 127)" />
        <rect x="205" y="125" width="11" height="3" rx="1.5" fill="hsl(25,30%,22%)" opacity="0.45" transform="rotate(12 210 126)" />
        <rect x="192" y="128" width="10" height="2.5" rx="1" fill="hsl(25,25%,18%)" opacity="0.4" transform="rotate(5 197 129)" />

        {/* ── CAMPFIRE ── */}
        <circle cx="200" cy="118" r="28" fill="url(#cf-glow)" />
        {/* Flames */}
        <ellipse cx="200" cy="118" rx="5" ry="10" fill="#FBBF24" opacity="0.6" className="cf-flame1" />
        <ellipse cx="197" cy="116" rx="3" ry="8" fill="#F97316" opacity="0.5" className="cf-flame2" />
        <ellipse cx="203" cy="117" rx="2.5" ry="7" fill="#EF4444" opacity="0.35" className="cf-flame3" />
        <ellipse cx="200" cy="114" rx="2" ry="5" fill="#FDE68A" opacity="0.4" className="cf-flame4" />
        {/* Embers */}
        {[
          {x:196,y:108,d:0},{x:204,y:106,d:0.5},{x:200,y:104,d:1},{x:193,y:110,d:1.5},{x:207,y:109,d:2},
        ].map((e,i) => (
          <circle key={i} cx={e.x} cy={e.y} r="0.7" fill="#FDE68A" opacity="0.5"
            className="cf-ember" style={{ animationDelay: `${e.d}s` }} />
        ))}

        {/* ── HIKER SILHOUETTES ── */}
        {/* Person 1 — sitting left, legs stretched */}
        <g opacity="0.55">
          <circle cx="158" cy="108" r="4" fill="hsl(25,20%,15%)" />
          <rect x="155" y="112" width="6" height="10" rx="2" fill="hsl(25,20%,15%)" />
          <line x1="155" y1="122" x2="150" y2="126" stroke="hsl(25,20%,15%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="161" y1="122" x2="166" y2="126" stroke="hsl(25,20%,15%)" strokeWidth="2" strokeLinecap="round" />
          {/* Arm reaching to fire */}
          <line x1="161" y1="115" x2="170" y2="118" stroke="hsl(25,20%,15%)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="155" y1="116" x2="148" y2="120" stroke="hsl(25,20%,15%)" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Person 2 — sitting right, holding cup */}
        <g opacity="0.5">
          <circle cx="242" cy="107" r="4.2" fill="hsl(25,18%,14%)" />
          <rect x="239" y="111" width="6.5" height="11" rx="2" fill="hsl(25,18%,14%)" />
          <line x1="239" y1="122" x2="234" y2="127" stroke="hsl(25,18%,14%)" strokeWidth="2" strokeLinecap="round" />
          <line x1="245.5" y1="122" x2="250" y2="127" stroke="hsl(25,18%,14%)" strokeWidth="2" strokeLinecap="round" />
          {/* Cup */}
          <rect x="234" y="113" width="3" height="4" rx="0.8" fill="hsl(25,18%,14%)" />
          {/* Steam from cup */}
          <path d="M235,112 Q234,110 235.5,108" fill="none" stroke="hsl(45,15%,50%)" strokeWidth="0.4" opacity="0.15" className="cf-steam" />
        </g>

        {/* Person 3 — sitting behind fire, smaller (depth) */}
        <g opacity="0.35">
          <circle cx="195" cy="100" r="3" fill="hsl(25,15%,13%)" />
          <rect x="193" y="103" width="5" height="8" rx="1.5" fill="hsl(25,15%,13%)" />
        </g>

        {/* Person 4 — sitting behind fire right */}
        <g opacity="0.3">
          <circle cx="210" cy="99" r="3.2" fill="hsl(25,15%,12%)" />
          <rect x="207.5" y="102" width="5.5" height="8.5" rx="1.5" fill="hsl(25,15%,12%)" />
          {/* Guitar shape */}
          <ellipse cx="215" cy="107" rx="2.5" ry="3.5" fill="hsl(25,20%,15%)" />
          <line x1="215" y1="103.5" x2="215" y2="100" stroke="hsl(25,20%,15%)" strokeWidth="0.6" />
        </g>

        {/* Person 5 — standing far left, just arrived */}
        <g opacity="0.25">
          <circle cx="135" cy="102" r="3.5" fill="hsl(25,15%,12%)" />
          <rect x="133" y="105.5" width="5" height="14" rx="1.5" fill="hsl(25,15%,12%)" />
          <line x1="133" y1="119.5" x2="130" y2="126" stroke="hsl(25,15%,12%)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="138" y1="119.5" x2="140" y2="126" stroke="hsl(25,15%,12%)" strokeWidth="1.8" strokeLinecap="round" />
          {/* Walking stick */}
          <line x1="140" y1="108" x2="143" y2="126" stroke="hsl(25,20%,18%)" strokeWidth="0.8" />
        </g>

        {/* ── Tent silhouette far right ── */}
        <g opacity="0.2">
          <polygon points="320,108 340,108 330,92" fill="hsl(150,15%,12%)" />
          <line x1="330" y1="92" x2="330" y2="86" stroke="hsl(150,15%,12%)" strokeWidth="0.5" />
          {/* Flag on tent */}
          <polygon points="330,86 330,89 334,87.5" fill="hsl(25,60%,45%)" opacity="0.3" className="cf-flag" />
        </g>

        {/* ── Backpacks on ground ── */}
        <rect x="165" y="123" width="5" height="6" rx="1.5" fill="hsl(25,25%,18%)" opacity="0.3" />
        <rect x="250" y="124" width="4.5" height="5.5" rx="1.5" fill="hsl(150,20%,16%)" opacity="0.25" />

        {/* ── Fireflies ── */}
        {[{x:120,y:90},{x:280,y:85},{x:160,y:75},{x:250,y:80},{x:340,y:95},{x:70,y:88}].map((f,i) => (
          <circle key={i} cx={f.x} cy={f.y} r="1.2" fill="#FDE68A"
            className="cf-firefly" style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </svg>

      {/* Bottom gradient fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />

      <style>{`
        .cf-twinkle { animation: cf-twinkle 3s ease-in-out infinite; }
        .cf-flame1 { animation: cf-flicker 0.9s ease-in-out infinite; transform-origin: 200px 128px; }
        .cf-flame2 { animation: cf-flicker 0.7s ease-in-out 0.15s infinite; transform-origin: 197px 128px; }
        .cf-flame3 { animation: cf-flicker 0.8s ease-in-out 0.3s infinite; transform-origin: 203px 128px; }
        .cf-flame4 { animation: cf-flicker 0.6s ease-in-out 0.45s infinite; transform-origin: 200px 128px; }
        .cf-ember { animation: cf-emberRise 2.5s ease-out infinite; }
        .cf-tree { animation: cf-sway 5s ease-in-out infinite; }
        .cf-firefly { animation: cf-glow 3s ease-in-out infinite; }
        .cf-steam { animation: cf-steamRise 3s ease-out infinite; }
        .cf-flag { animation: cf-flagWave 2s ease-in-out infinite; transform-origin: 330px 87.5px; }

        @keyframes cf-twinkle { 0%,100% { opacity: 0.1; } 50% { opacity: 0.7; } }
        @keyframes cf-flicker { 0%,100% { transform: scaleY(1) scaleX(1); } 30% { transform: scaleY(1.12) scaleX(0.88); } 60% { transform: scaleY(0.9) scaleX(1.08); } }
        @keyframes cf-emberRise { 0% { opacity: 0.6; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-18px) translateX(4px) scale(0.3); } }
        @keyframes cf-sway { 0%,100% { transform: rotate(0deg); } 40% { transform: rotate(0.8deg); } 70% { transform: rotate(-0.5deg); } }
        @keyframes cf-glow { 0%,100% { opacity: 0.05; } 40% { opacity: 0.65; } 60% { opacity: 0.1; } 85% { opacity: 0.55; } }
        @keyframes cf-steamRise { 0% { opacity: 0.15; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-8px); } }
        @keyframes cf-flagWave { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(3deg); } }
      `}</style>
    </div>
  );
};

export default CampfireScene;

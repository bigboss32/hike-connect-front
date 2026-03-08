/**
 * RoutesHeroScene — Polished animated SVG landscape
 * "rutas" = trail with hiker, wildlife • "hospedajes" = cabin with garden, campfire, cat
 * Time-of-day sky, smooth CSS transitions between modes.
 */

type TimeSlot = "dawn" | "morning" | "afternoon" | "sunset" | "night";

const getTimeSlot = (): TimeSlot => {
  const h = new Date().getHours();
  if (h >= 5 && h < 7) return "dawn";
  if (h >= 7 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 20) return "sunset";
  return "night";
};

interface Props {
  mode?: "rutas" | "hospedajes";
  scrollY?: number;
}

const RoutesHeroScene = ({ mode = "rutas", scrollY = 0 }: Props) => {
  const time = getTimeSlot();
  const isNight = time === "night";
  const isSunset = time === "sunset";
  const isDawn = time === "dawn";
  const isHospedaje = mode === "hospedajes";
  const s = Math.min(scrollY, 300);

  const sky: Record<TimeSlot, string> = {
    dawn: "from-rose-300/30 via-amber-200/20 to-sky-200/15",
    morning: "from-amber-200/20 via-sky-300/15 to-emerald-200/10",
    afternoon: "from-orange-200/15 via-amber-100/10 to-sky-200/10",
    sunset: "from-orange-400/30 via-rose-300/25 to-purple-300/20",
    night: "from-indigo-900/30 via-slate-800/25 to-emerald-900/15",
  };

  const sunColor = isSunset ? "#FB923C" : "#FBBF24";
  const glowColor = isSunset ? "#F97316" : "#F59E0B";
  const windowGlow = isNight ? "#FDE68A" : "#FDBA74";
  const windowOp = isNight ? 0.65 : 0.35;
  const sunY = isDawn ? 55 : isSunset ? 48 : 26;

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className={`absolute inset-0 bg-gradient-to-br ${sky[time]} transition-colors duration-700`} style={{ transform: `translateY(${s * 0.05}px)` }} />

      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="rs-farMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,25%,38%)" /><stop offset="100%" stopColor="hsl(150,20%,28%)" />
          </linearGradient>
          <linearGradient id="rs-midMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,30%,32%)" /><stop offset="100%" stopColor="hsl(150,25%,22%)" />
          </linearGradient>
          <linearGradient id="rs-nearMtn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,35%,28%)" /><stop offset="100%" stopColor="hsl(150,30%,18%)" />
          </linearGradient>
          <linearGradient id="rs-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(150,28%,20%)" /><stop offset="100%" stopColor="hsl(150,25%,14%)" />
          </linearGradient>
          <radialGradient id="rs-sun">
            <stop offset="0%" stopColor={sunColor} stopOpacity="0.9" />
            <stop offset="45%" stopColor={glowColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rs-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
            <stop offset="12%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
            <stop offset="88%" stopColor="hsl(30,40%,50%)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(30,40%,50%)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rs-river" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(200,50%,55%)" stopOpacity="0" />
            <stop offset="20%" stopColor="hsl(200,50%,55%)" stopOpacity="0.3" />
            <stop offset="80%" stopColor="hsl(200,50%,55%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(200,50%,55%)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rs-campfire">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── CELESTIAL (parallax: fastest) ── */}
        <g style={{ transform: `translateY(${s * -0.12}px)` }}>
        {isNight ? (
          <g>
            <circle cx="320" cy="28" r="14" fill="#E2E8F0" opacity="0.12" />
            <circle cx="320" cy="28" r="9" fill="#F1F5F9" opacity="0.75" />
            <circle cx="316" cy="26" r="1.8" fill="#CBD5E1" opacity="0.3" />
            <circle cx="322" cy="31" r="1.2" fill="#CBD5E1" opacity="0.2" />
            {[{x:22,y:12,r:1.2},{x:65,y:22,r:0.8},{x:105,y:8,r:1.4},{x:148,y:28,r:0.9},
              {x:195,y:14,r:1.1},{x:240,y:32,r:0.7},{x:275,y:10,r:1.3},{x:355,y:18,r:1},
              {x:42,y:38,r:0.6},{x:180,y:40,r:0.9},{x:300,y:36,r:0.8},{x:370,y:42,r:1.1}
            ].map((s,i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.3" className="rs-twinkle" style={{ animationDelay: `${i * 0.35}s` }} />
            ))}
            <line x1="80" y1="18" x2="100" y2="25" stroke="white" strokeWidth="0.6" opacity="0" className="rs-shootingStar" />
          </g>
        ) : (
          <g className="rs-sunGroup">
            <circle cx="320" cy={sunY} r="24" fill="url(#rs-sun)" />
            <circle cx="320" cy={sunY} r="8" fill={sunColor} opacity="0.85" />
            {[0,60,120,180,240,300].map(a => (
              <line key={a} x1="320" y1={sunY}
                x2={320 + Math.cos(a * Math.PI/180) * 16} y2={sunY + Math.sin(a * Math.PI/180) * 16}
                stroke={sunColor} strokeWidth="0.5" opacity="0.2" className="rs-ray" />
            ))}
          </g>
        )}

        {/* ── CLOUDS ── */}
        <g opacity={isNight ? 0.12 : 0.32}>
          <g className="rs-cloud1">
            <ellipse cx="0" cy="36" rx="30" ry="8" fill="white" opacity="0.5" />
            <ellipse cx="12" cy="33" rx="16" ry="6" fill="white" opacity="0.35" />
          </g>
          <g className="rs-cloud2">
            <ellipse cx="0" cy="52" rx="24" ry="6" fill="white" opacity="0.4" />
            <ellipse cx="-8" cy="49" rx="14" ry="5" fill="white" opacity="0.3" />
          </g>
          <g className="rs-cloud3">
            <ellipse cx="0" cy="26" rx="20" ry="5" fill="white" opacity="0.25" />
          </g>
        </g>

        {/* ── FAR MOUNTAINS ── */}
        <path d="M0,120 L30,88 L70,100 L110,76 L150,95 L190,68 L230,88 L270,74 L310,82 L350,65 L380,80 L400,75 L400,120Z"
          fill="url(#rs-farMtn)" opacity="0.35" />
        <path d="M190,68 L183,78 L197,78Z" fill="white" opacity="0.25" />
        <path d="M350,65 L344,74 L356,74Z" fill="white" opacity="0.2" />
        <path d="M110,76 L105,84 L115,84Z" fill="white" opacity="0.15" />

        {/* ── MID MOUNTAINS ── */}
        <path d="M0,135 L25,105 L65,118 L100,92 L140,110 L175,85 L215,103 L255,90 L290,100 L330,82 L370,98 L400,92 L400,135Z"
          fill="url(#rs-midMtn)" opacity="0.55" />
        <path d="M175,85 L169,94 L181,94Z" fill="white" opacity="0.2" />
        <path d="M330,82 L325,90 L335,90Z" fill="white" opacity="0.15" />
        <path d="M100,92 L115,97 L130,95" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.4" opacity="0.3" />
        <path d="M255,90 L268,95 L280,93" fill="none" stroke="hsl(150,20%,25%)" strokeWidth="0.4" opacity="0.3" />

        {/* ── NEAR MOUNTAINS ── */}
        <path d="M0,155 L20,128 L58,138 L95,118 L135,132 L170,112 L210,128 L250,120 L290,135 L330,122 L370,130 L400,126 L400,155Z"
          fill="url(#rs-nearMtn)" opacity="0.7" />

        {/* ── WATERFALL ── */}
        <path d="M172,112 L172,130" fill="none" stroke="hsl(200,50%,60%)" strokeWidth="1" opacity="0.2"
          strokeDasharray="2 2" className="rs-waterfall" />
        <ellipse cx="172" cy="132" rx="3" ry="1" fill="hsl(200,50%,60%)" opacity="0.1" />

        {/* ── River ── */}
        <path d="M-5,172 Q60,165 130,170 Q200,178 270,168 Q340,160 410,170"
          fill="none" stroke="url(#rs-river)" strokeWidth="2" className="rs-riverFlow" />

        {/* ── Far tree line ── */}
        <g opacity="0.3">
          {[20,50,85,120,155,190,225,260,295,330,365].map((x, i) => (
            <g key={i}>
              <polygon points={`${x},145 ${x - 3 - (i%2)},134 ${x + 3 + (i%2)},134`} fill="hsl(150,38%,30%)" />
              {i % 3 === 0 && <polygon points={`${x},140 ${x-2},134 ${x+2},134`} fill="hsl(150,42%,34%)" opacity="0.6" />}
            </g>
          ))}
        </g>

        {/* ── Rolling ground ── */}
        <path d="M0,160 Q50,152 100,158 Q150,166 200,154 Q250,146 300,158 Q350,166 400,152 L400,200 L0,200Z"
          fill="url(#rs-ground)" opacity="0.6" />
        <path d="M0,168 Q60,160 120,166 Q180,174 240,162 Q300,154 360,166 Q380,170 400,162 L400,200 L0,200Z"
          fill="hsl(150,22%,12%)" opacity="0.45" />
        {/* Grass tufts */}
        {[30,75,130,200,265,330,375].map((x,i) => (
          <g key={i} className="rs-grass" style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${x}px 168px` }}>
            <path d={`M${x},168 Q${x-1},162 ${x-2},158`} fill="none" stroke="hsl(150,35%,28%)" strokeWidth="0.8" opacity="0.4" />
            <path d={`M${x},168 Q${x+1},163 ${x},159`} fill="none" stroke="hsl(150,38%,30%)" strokeWidth="0.7" opacity="0.35" />
            <path d={`M${x},168 Q${x+2},163 ${x+3},157`} fill="none" stroke="hsl(150,32%,26%)" strokeWidth="0.8" opacity="0.3" />
          </g>
        ))}

        {/* ── Rocks ── */}
        <ellipse cx="55" cy="172" rx="4" ry="2" fill="hsl(30,15%,30%)" opacity="0.3" />
        <ellipse cx="310" cy="168" rx="3" ry="1.5" fill="hsl(30,15%,28%)" opacity="0.25" />
        <ellipse cx="185" cy="175" rx="2.5" ry="1.2" fill="hsl(30,12%,32%)" opacity="0.2" />

        {/* ── Near trees ── */}
        {[
          { x: 18, h: 30, d: 0 }, { x: 60, h: 24, d: 0.6 }, { x: 105, h: 28, d: 1.2 },
          { x: 180, h: 26, d: 0.3 }, { x: 240, h: 32, d: 0.9 }, { x: 295, h: 22, d: 1.5 },
          { x: 340, h: 27, d: 0.4 }, { x: 385, h: 24, d: 1.1 },
        ].map((t, i) => (
          <g key={i} className="rs-tree" style={{ animationDelay: `${t.d}s`, transformOrigin: `${t.x}px 170px` }}>
            <rect x={t.x - 1.5} y={170 - t.h * 0.5} width="3" height={t.h * 0.5} rx="1" fill="hsl(25,30%,24%)" />
            <polygon points={`${t.x},${170 - t.h} ${t.x - 8},${170 - t.h * 0.38} ${t.x + 8},${170 - t.h * 0.38}`} fill="hsl(150,40%,26%)" />
            <polygon points={`${t.x},${170 - t.h * 0.82} ${t.x - 6},${170 - t.h * 0.28} ${t.x + 6},${170 - t.h * 0.28}`} fill="hsl(150,42%,30%)" opacity="0.85" />
            <polygon points={`${t.x},${170 - t.h * 0.65} ${t.x - 5},${170 - t.h * 0.2} ${t.x + 5},${170 - t.h * 0.2}`} fill="hsl(150,45%,34%)" opacity="0.7" />
          </g>
        ))}

        {/* ── Mushrooms ── */}
        <g opacity="0.35">
          <ellipse cx="25" cy="170" rx="2" ry="1" fill="hsl(0,50%,45%)" />
          <rect x="24.5" y="170" width="1" height="2" fill="hsl(30,20%,70%)" />
          <ellipse cx="350" cy="169" rx="1.5" ry="0.8" fill="hsl(35,60%,50%)" />
          <rect x="349.5" y="169" width="1" height="1.8" fill="hsl(30,20%,70%)" />
        </g>

        {/* ═══ MODE: RUTAS ═══ */}
        <g className="rs-mode-layer" style={{ opacity: isHospedaje ? 0 : 1, transform: isHospedaje ? 'translateY(6px) scale(0.97)' : 'translateY(0) scale(1)' }}>
          {/* Trail path */}
          <path d="M-10,168 Q50,158 110,165 Q170,174 230,160 Q290,150 350,165 Q380,170 410,158"
            fill="none" stroke="url(#rs-trail)" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />

          {/* Trail markers */}
          {[70, 160, 250, 340].map((x, i) => (
            <g key={i}>
              <rect x={x - 1} y="153" width="2" height="12" rx="0.5" fill="hsl(30,30%,35%)" />
              <circle cx={x} cy="151" r="3.5" fill="hsl(25,80%,55%)" opacity="0.7" />
              <circle cx={x} cy="151" r="1.8" fill="hsl(25,90%,65%)" opacity="0.9" />
            </g>
          ))}

          {/* Hiker */}
          <g className="rs-hiker" opacity="0.5">
            <line x1="199" y1="146" x2="203" y2="162" stroke="hsl(30,35%,35%)" strokeWidth="0.8" strokeLinecap="round" />
            <rect x="193" y="152" width="4" height="7" rx="1.5" fill="hsl(25,35%,30%)" />
            <circle cx="195" cy="149" r="2.8" fill="hsl(25,30%,32%)" />
            <ellipse cx="195" cy="147" rx="3.5" ry="1" fill="hsl(25,40%,28%)" />
            <rect x="193" y="145" width="4" height="2" rx="1" fill="hsl(25,40%,28%)" />
            <rect x="190" y="151" width="3" height="5" rx="1" fill="hsl(25,45%,35%)" />
            <rect x="190.5" y="150.5" width="2" height="1" rx="0.5" fill="hsl(25,40%,30%)" />
            <line x1="194" y1="159" x2="192.5" y2="163" stroke="hsl(25,30%,25%)" strokeWidth="1" strokeLinecap="round" className="rs-legL" />
            <line x1="196" y1="159" x2="197.5" y2="163" stroke="hsl(25,30%,25%)" strokeWidth="1" strokeLinecap="round" className="rs-legR" />
          </g>

          {/* Signpost */}
          <g opacity="0.45">
            <rect x="118" y="150" width="2" height="15" fill="hsl(30,30%,30%)" rx="0.5" />
            <rect x="112" y="151" width="14" height="4" rx="1" fill="hsl(30,35%,35%)" />
            <rect x="114" y="156" width="12" height="3.5" rx="1" fill="hsl(30,32%,32%)" />
            <polygon points="125,153 128,153 126.5,151.5" fill="hsl(30,35%,35%)" />
          </g>

          {/* Deer silhouette */}
          <g opacity="0.2" className="rs-deer">
            <ellipse cx="310" cy="155" rx="5" ry="3" fill="hsl(25,30%,25%)" />
            <rect x="309" y="155" width="1" height="5" fill="hsl(25,30%,25%)" />
            <rect x="311" y="155" width="1" height="5" fill="hsl(25,30%,25%)" />
            <circle cx="313" cy="153" r="1.5" fill="hsl(25,30%,25%)" />
            <path d="M313,151.5 L314,149 L315,150 M313,151.5 L312.5,149 L311.5,150" fill="none" stroke="hsl(25,30%,25%)" strokeWidth="0.5" />
          </g>
        </g>

        {/* ═══ MODE: HOSPEDAJES ═══ */}
        <g className="rs-mode-layer" style={{ opacity: isHospedaje ? 1 : 0, transform: isHospedaje ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)' }}>
          {/* Cabin body */}
          <rect x="168" y="132" width="64" height="38" rx="2" fill="hsl(25,38%,26%)" />
          {[138, 144, 150, 156, 162].map(y => (
            <line key={y} x1="170" y1={y} x2="230" y2={y} stroke="hsl(25,28%,20%)" strokeWidth="0.5" opacity="0.3" />
          ))}
          <rect x="166" y="168" width="68" height="3" rx="1" fill="hsl(25,15%,30%)" opacity="0.5" />

          {/* Roof */}
          <polygon points="158,134 200,106 242,134" fill="hsl(25,32%,20%)" />
          <polygon points="162,134 200,110 238,134" fill="hsl(25,28%,28%)" />
          <line x1="200" y1="106" x2="200" y2="110" stroke="hsl(25,22%,16%)" strokeWidth="1.5" />
          <path d="M168,130 Q175,126 182,130 Q189,126 196,130 Q203,126 210,130 Q217,126 224,130 Q231,126 236,130"
            fill="none" stroke="hsl(25,22%,22%)" strokeWidth="0.5" opacity="0.3" />

          {/* Left window */}
          <rect x="174" y="140" width="12" height="10" rx="1.5" fill="hsl(25,28%,20%)" />
          <rect x="175" y="141" width="10" height="8" rx="1" fill={windowGlow} opacity={windowOp} />
          <line x1="180" y1="141" x2="180" y2="149" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />
          <line x1="175" y1="145" x2="185" y2="145" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />
          <path d="M175,141 Q177,143 175,145" fill="none" stroke="hsl(25,35%,30%)" strokeWidth="0.4" opacity="0.3" />

          {/* Right window */}
          <rect x="214" y="140" width="12" height="10" rx="1.5" fill="hsl(25,28%,20%)" />
          <rect x="215" y="141" width="10" height="8" rx="1" fill={windowGlow} opacity={windowOp} />
          <line x1="220" y1="141" x2="220" y2="149" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />
          <line x1="215" y1="145" x2="225" y2="145" stroke="hsl(25,28%,20%)" strokeWidth="0.8" />

          {/* Door */}
          <rect x="191" y="150" width="18" height="20" rx="2" fill="hsl(25,32%,18%)" />
          <rect x="192.5" y="151.5" width="15" height="17" rx="1.5" fill="hsl(25,28%,22%)" />
          <path d="M192.5,151.5 Q200,146 207.5,151.5" fill="hsl(25,28%,22%)" stroke="hsl(25,32%,18%)" strokeWidth="0.5" />
          <circle cx="205" cy="162" r="1.3" fill="#FBBF24" opacity="0.5" />
          <rect x="189" y="169" width="22" height="2" rx="0.5" fill="hsl(25,20%,28%)" opacity="0.5" />

          {/* Chimney + smoke */}
          <rect x="218" y="112" width="8" height="18" rx="1" fill="hsl(25,26%,22%)" />
          <rect x="216" y="110" width="12" height="3" rx="1" fill="hsl(25,22%,18%)" />
          <line x1="219" y1="118" x2="225" y2="118" stroke="hsl(25,20%,18%)" strokeWidth="0.4" opacity="0.3" />
          <line x1="219" y1="124" x2="225" y2="124" stroke="hsl(25,20%,18%)" strokeWidth="0.4" opacity="0.3" />
          <circle cx="222" cy="104" r="2.5" fill="hsl(150,15%,45%)" opacity="0.08" className="rs-smoke1" />
          <circle cx="224" cy="97" r="2" fill="hsl(150,15%,45%)" opacity="0.05" className="rs-smoke2" />
          <circle cx="221" cy="91" r="3" fill="hsl(150,15%,45%)" opacity="0.03" className="rs-smoke3" />
          <circle cx="223" cy="85" r="2.2" fill="hsl(150,15%,45%)" opacity="0.02" className="rs-smoke4" />

          {/* Window flower boxes */}
          <rect x="173" y="149" width="14" height="2" rx="0.5" fill="hsl(25,30%,25%)" opacity="0.5" />
          <circle cx="176" cy="148.5" r="1.3" fill="#EF4444" opacity="0.4" />
          <circle cx="180" cy="148.5" r="1.3" fill="#F59E0B" opacity="0.4" />
          <circle cx="184" cy="148.5" r="1.3" fill="#EF4444" opacity="0.4" />
          <rect x="213" y="149" width="14" height="2" rx="0.5" fill="hsl(25,30%,25%)" opacity="0.5" />
          <circle cx="216" cy="148.5" r="1.3" fill="#A78BFA" opacity="0.4" />
          <circle cx="220" cy="148.5" r="1.3" fill="#F59E0B" opacity="0.4" />
          <circle cx="224" cy="148.5" r="1.3" fill="#A78BFA" opacity="0.4" />

          {/* Night glow */}
          {isNight && <>
            <ellipse cx="180" cy="152" rx="12" ry="5" fill="#FDE68A" opacity="0.06" />
            <ellipse cx="220" cy="152" rx="12" ry="5" fill="#FDE68A" opacity="0.06" />
            <ellipse cx="200" cy="172" rx="16" ry="6" fill="#FDE68A" opacity="0.04" />
          </>}

          {/* Garden path */}
          {[{x:196,y:172},{x:193,y:176},{x:197,y:180},{x:194,y:184}].map((s,i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx="3" ry="1.2" fill="hsl(30,15%,35%)" opacity="0.25" />
          ))}

          {/* Garden flowers */}
          {[
            {x:152,c:"#F59E0B",h:8},{x:158,c:"#EF4444",h:10},{x:163,c:"#A78BFA",h:7},
            {x:237,c:"#34D399",h:9},{x:243,c:"#F59E0B",h:8},{x:249,c:"#EF4444",h:10},
          ].map((f,i) => (
            <g key={i} className="rs-flower" style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${f.x}px 170px` }}>
              <line x1={f.x} y1="170" x2={f.x} y2={170-f.h} stroke="hsl(150,40%,30%)" strokeWidth="0.8" />
              <ellipse cx={f.x + 2} cy={170 - f.h * 0.5} rx="1.5" ry="0.8" fill="hsl(150,38%,32%)" opacity="0.5" transform={`rotate(-30 ${f.x+2} ${170 - f.h*0.5})`} />
              <circle cx={f.x} cy={170-f.h-1} r="2.5" fill={f.c} opacity="0.55" />
              <circle cx={f.x} cy={170-f.h-1} r="1" fill="white" opacity="0.35" />
            </g>
          ))}

          {/* Fence */}
          {[145,153,161,239,247,255].map(x => (
            <rect key={x} x={x} y="160" width="1.5" height="10" rx="0.5" fill="hsl(30,28%,35%)" opacity="0.3" />
          ))}
          <rect x="145" y="163" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.22" />
          <rect x="145" y="167" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.22" />
          <rect x="239" y="163" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.22" />
          <rect x="239" y="167" width="18" height="1" fill="hsl(30,28%,35%)" opacity="0.22" />

          {/* Campfire */}
          <g>
            <circle cx="143" cy="168" r="8" fill="url(#rs-campfire)" opacity={isNight ? 0.5 : 0.2} />
            <rect x="139" y="169" width="8" height="2" rx="1" fill="hsl(25,35%,22%)" opacity="0.5" transform="rotate(-10 143 170)" />
            <rect x="140" y="168" width="7" height="2" rx="1" fill="hsl(25,30%,25%)" opacity="0.45" transform="rotate(15 143 169)" />
            <ellipse cx="143" cy="166" rx="2" ry="3" fill="#FBBF24" opacity="0.5" className="rs-flame1" />
            <ellipse cx="142" cy="165" rx="1.2" ry="2.5" fill="#F97316" opacity="0.4" className="rs-flame2" />
            <ellipse cx="144" cy="164.5" rx="0.8" ry="2" fill="#EF4444" opacity="0.3" className="rs-flame3" />
            <circle cx="141" cy="162" r="0.5" fill="#FBBF24" opacity="0.4" className="rs-spark" style={{ animationDelay: '0s' }} />
            <circle cx="145" cy="160" r="0.4" fill="#FDE68A" opacity="0.3" className="rs-spark" style={{ animationDelay: '0.7s' }} />
          </g>

          {/* Sleepy cat */}
          <g opacity="0.4" className="rs-cat">
            <ellipse cx="210" cy="168" rx="3" ry="1.8" fill="hsl(25,30%,30%)" />
            <circle cx="212" cy="166.5" r="1.5" fill="hsl(25,30%,30%)" />
            <polygon points="211,165 211.5,163.5 212.5,165" fill="hsl(25,30%,30%)" />
            <polygon points="212.5,165 213,163.5 214,165" fill="hsl(25,30%,30%)" />
            <path d="M207,168 Q205,166 206,164" fill="none" stroke="hsl(25,30%,30%)" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* Hanging lantern */}
          <g opacity={isNight ? 0.6 : 0.3}>
            <line x1="160" y1="134" x2="160" y2="138" stroke="hsl(25,20%,30%)" strokeWidth="0.5" />
            <rect x="158" y="138" width="4" height="5" rx="1" fill={isNight ? "#FDE68A" : "hsl(25,30%,35%)"} opacity={isNight ? 0.6 : 0.4} />
            {isNight && <ellipse cx="160" cy="145" rx="5" ry="3" fill="#FDE68A" opacity="0.06" />}
          </g>
        </g>

        {/* ── BIRDS ── */}
        {[{y:35,d:0},{y:48,d:4},{y:28,d:7},{y:42,d:11}].map((b,i) => (
          <path key={i} d={`M0,${b.y} Q4,${b.y-4} 8,${b.y} Q12,${b.y-4} 16,${b.y}`}
            fill="none" stroke="hsl(150,15%,30%)" strokeWidth="1.2" strokeLinecap="round" opacity="0.2"
            className="rs-bird" style={{ animationDelay: `${b.d}s` }} />
        ))}

        {/* ── Butterflies (day) ── */}
        {!isNight && !isSunset && (
          <g>
            {[{x:85,y:130,c:"#F59E0B"},{x:280,y:125,c:"#A78BFA"}].map((bf,i) => (
              <g key={i} className="rs-butterfly" style={{ animationDelay: `${i * 2}s` }}>
                <ellipse cx={bf.x - 2} cy={bf.y} rx="1.5" ry="2" fill={bf.c} opacity="0.35" className="rs-wing" />
                <ellipse cx={bf.x + 2} cy={bf.y} rx="1.5" ry="2" fill={bf.c} opacity="0.35" className="rs-wing" />
              </g>
            ))}
          </g>
        )}

        {/* ── Fireflies (night/sunset) ── */}
        {(isNight || isSunset) && (
          <g>
            {[{x:45,y:125},{x:120,y:140},{x:200,y:118},{x:280,y:135},{x:350,y:122},{x:160,y:148},{x:90,y:132},{x:320,y:145}].map((f,i) => (
              <circle key={i} cx={f.x} cy={f.y} r="1.5"
                fill={isNight ? "#FDE68A" : "#FDBA74"}
                className="rs-firefly" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </g>
        )}

        {/* ── Dawn mist ── */}
        {isDawn && (
          <g>
            <ellipse cx="80" cy="155" rx="50" ry="5" fill="white" opacity="0.06" className="rs-mist" />
            <ellipse cx="250" cy="160" rx="60" ry="4" fill="white" opacity="0.05" className="rs-mist" style={{ animationDelay: '2s' }} />
            <ellipse cx="350" cy="152" rx="40" ry="4" fill="white" opacity="0.04" className="rs-mist" style={{ animationDelay: '4s' }} />
          </g>
        )}

        {/* ── Falling leaves ── */}
        {!isNight && (
          <g>
            {[{x:60,d:0},{x:170,d:3},{x:300,d:6}].map((l,i) => (
              <ellipse key={i} cx={l.x} cy="0" rx="2" ry="1" fill="hsl(35,50%,45%)" opacity="0.2" className="rs-leaf"
                style={{ animationDelay: `${l.d}s` }} />
            ))}
          </g>
        )}
      </svg>

      <style>{`
        .rs-mode-layer { transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1); pointer-events: none; }
        .rs-sunGroup { animation: rs-sunFloat 6s ease-in-out infinite; }
        .rs-ray { animation: rs-rayPulse 4s ease-in-out infinite; }
        .rs-cloud1 { animation: rs-drift 24s linear infinite; }
        .rs-cloud2 { animation: rs-drift 30s linear 8s infinite; }
        .rs-cloud3 { animation: rs-drift 20s linear 14s infinite; }
        .rs-tree { animation: rs-sway 5s ease-in-out infinite; }
        .rs-grass { animation: rs-sway 3s ease-in-out infinite; }
        .rs-flower { animation: rs-flowerSway 3.5s ease-in-out infinite; }
        .rs-bird { animation: rs-flyAcross 10s linear infinite; }
        .rs-twinkle { animation: rs-twinkle 3s ease-in-out infinite; }
        .rs-smoke1 { animation: rs-smoke 2.5s ease-out infinite; }
        .rs-smoke2 { animation: rs-smoke 3s ease-out 0.8s infinite; }
        .rs-smoke3 { animation: rs-smoke 3.5s ease-out 1.5s infinite; }
        .rs-smoke4 { animation: rs-smoke 4s ease-out 2s infinite; }
        .rs-firefly { animation: rs-glow 3s ease-in-out infinite; }
        .rs-hiker { animation: rs-walk 1.2s ease-in-out infinite; }
        .rs-legL { animation: rs-legSwing 0.6s ease-in-out infinite; transform-origin: 194px 159px; }
        .rs-legR { animation: rs-legSwing 0.6s ease-in-out 0.3s infinite; transform-origin: 196px 159px; }
        .rs-flame1 { animation: rs-flicker 0.8s ease-in-out infinite; transform-origin: 143px 168px; }
        .rs-flame2 { animation: rs-flicker 0.6s ease-in-out 0.2s infinite; transform-origin: 142px 168px; }
        .rs-flame3 { animation: rs-flicker 0.7s ease-in-out 0.4s infinite; transform-origin: 144px 168px; }
        .rs-spark { animation: rs-sparkRise 2s ease-out infinite; }
        .rs-cat { animation: rs-catBreath 3s ease-in-out infinite; transform-origin: 210px 168px; }
        .rs-deer { animation: rs-deerIdle 4s ease-in-out infinite; }
        .rs-waterfall { animation: rs-waterfallFlow 1s linear infinite; }
        .rs-riverFlow { animation: rs-riverShimmer 3s ease-in-out infinite; }
        .rs-butterfly { animation: rs-butterflyFloat 7s ease-in-out infinite; }
        .rs-wing { animation: rs-wingFlap 0.3s ease-in-out infinite; }
        .rs-mist { animation: rs-mistDrift 8s ease-in-out infinite; }
        .rs-leaf { animation: rs-leafFall 8s ease-in-out infinite; }
        .rs-shootingStar { animation: rs-shooting 6s ease-in 2s infinite; }

        @keyframes rs-sunFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes rs-rayPulse { 0%,100% { opacity: 0.2; } 50% { opacity: 0.45; } }
        @keyframes rs-drift { from { transform: translateX(420px); } to { transform: translateX(-100px); } }
        @keyframes rs-sway { 0%,100% { transform: rotate(0deg); } 30% { transform: rotate(1.2deg); } 70% { transform: rotate(-0.8deg); } }
        @keyframes rs-flowerSway { 0%,100% { transform: rotate(0deg); } 25% { transform: rotate(2.5deg); } 75% { transform: rotate(-1.5deg); } }
        @keyframes rs-flyAcross { from { transform: translateX(420px); } to { transform: translateX(-30px); } }
        @keyframes rs-twinkle { 0%,100% { opacity: 0.12; } 50% { opacity: 0.85; } }
        @keyframes rs-smoke { 0% { opacity: 0.1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(-14px) scale(1.8); } }
        @keyframes rs-glow { 0%,100% { opacity: 0.08; } 35% { opacity: 0.8; } 55% { opacity: 0.12; } 80% { opacity: 0.7; } }
        @keyframes rs-walk { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes rs-legSwing { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(8deg); } }
        @keyframes rs-flicker { 0%,100% { transform: scaleY(1) scaleX(1); } 50% { transform: scaleY(1.15) scaleX(0.9); } }
        @keyframes rs-sparkRise { 0% { opacity: 0.5; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px) translateX(3px); } }
        @keyframes rs-catBreath { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.03); } }
        @keyframes rs-deerIdle { 0%,85%,100% { transform: translateX(0); } 90% { transform: translateX(2px); } }
        @keyframes rs-waterfallFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -4; } }
        @keyframes rs-riverShimmer { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes rs-butterflyFloat { 0%,100% { transform: translate(0,0); } 25% { transform: translate(10px,-8px); } 50% { transform: translate(18px,2px); } 75% { transform: translate(8px,-5px); } }
        @keyframes rs-wingFlap { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(0.3); } }
        @keyframes rs-mistDrift { 0%,100% { transform: translateX(0); opacity: 0.06; } 50% { transform: translateX(15px); opacity: 0.03; } }
        @keyframes rs-leafFall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 0; } 10% { opacity: 0.25; } 100% { transform: translateY(180px) rotate(360deg) translateX(20px); opacity: 0; } }
        @keyframes rs-shooting { 0%,90%,100% { opacity: 0; transform: translate(0,0); } 93% { opacity: 0.5; } 96% { opacity: 0; transform: translate(30px,15px); } }
      `}</style>
    </div>
  );
};

export default RoutesHeroScene;

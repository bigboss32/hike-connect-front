/**
 * HeroScenery — Animated mini-landscape for the home hero.
 * Time-of-day + weather + walking hiker + terrain + interactive parallax.
 */
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type TimeSlot = "dawn" | "morning" | "afternoon" | "sunset" | "night";

const getTimeSlot = (): TimeSlot => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
};

/* ── All trail elements rendered in a single SVG for perfect alignment ── */

interface HeroSceneryProps {
  scrollY?: number;
}

/* Trail scene — single SVG so everything shares the same coordinate system */
const TrailScene = ({ rainy = false }: { rainy?: boolean }) => (
  <svg viewBox="0 0 400 60" preserveAspectRatio="xMidYMax slice" className="w-full h-full" fill="none">
    {/* Ground / trail path */}
    <line x1="10" y1="52" x2="390" y2="52" stroke="currentColor" className="text-primary" strokeWidth="1" opacity="0.15" />
    {/* Dashed trail */}
    <line x1="20" y1="52" x2="380" y2="52" stroke="currentColor" className="text-primary" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 3" />

    {/* Trail sign at start */}
    <g opacity="0.35">
      <rect x="18" y="30" width="1.5" height="22" rx="0.5" fill="currentColor" className="text-primary" />
      <rect x="19" y="32" width="8" height="4" rx="1" fill="currentColor" className="text-primary" />
      <polygon points="19,32 19,36 17,34" fill="currentColor" className="text-primary" />
      <rect x="11" y="38" width="8" height="3.5" rx="1" fill="currentColor" className="text-primary" opacity="0.7" />
    </g>

    {/* Small bushes / grass tufts along trail */}
    {[45, 95, 150, 210, 270, 330].map((x, i) => (
      <g key={`bush-${i}`} opacity={0.25 + (i % 2) * 0.1}>
        <ellipse cx={x} cy="50" rx={3 + (i % 2)} ry={2 + (i % 2)} fill="#22C55E" />
        <ellipse cx={x + 4} cy="49" rx={2} ry={1.5} fill="#16A34A" />
      </g>
    ))}

    {/* Flowers */}
    {[{x:60,c:"#F472B6"},{x:130,c:"#A78BFA"},{x:200,c:"#FB923C"},{x:280,c:"#34D399"},{x:340,c:"#F472B6"}].map((f,i) => (
      <g key={`flower-${i}`} opacity="0.5">
        <line x1={f.x} y1="52" x2={f.x} y2="46" stroke="#22C55E" strokeWidth="0.5" />
        <circle cx={f.x} cy="45" r="1.8" fill={f.c} opacity="0.7">
          <animate attributeName="r" values="1.8;2.2;1.8" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={f.x + 3} cy="46" r="1.3" fill={f.c} opacity="0.5" />
      </g>
    ))}

    {/* Small rocks */}
    {[80, 165, 250, 310].map((x, i) => (
      <ellipse key={`rock-${i}`} cx={x} cy="53" rx={2.5 + i % 2} ry={1.2} fill="currentColor" className="text-muted-foreground" opacity="0.12" />
    ))}

    {/* Footprints — animated with hiker */}
    <g opacity="0.08">
      <animateTransform attributeName="transform" type="translate" from="-20,0" to="320,0" dur="14s" repeatCount="indefinite" />
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx={-i * 8} cy="53" rx="1.8" ry="0.8" fill="currentColor" className="text-primary" opacity={Math.max(0, 1 - i * 0.08)} />
      ))}
    </g>

    {/* ── Companion Dog — aligned to ground at y=52 ── */}
    <g>
      <animateTransform attributeName="transform" type="translate" from="5,0" to="345,0" dur="14s" repeatCount="indefinite" />
      {/* Body */}
      <ellipse cx="12" cy="44" rx="6" ry="3.5" fill="currentColor" className="text-primary" opacity="0.6" />
      {/* Head */}
      <circle cx="19" cy="41" r="2.8" fill="currentColor" className="text-primary" opacity="0.65" />
      {/* Ear */}
      <ellipse cx="20.5" cy="39" rx="1.2" ry="1.8" fill="currentColor" className="text-primary" opacity="0.45" />
      {/* Eye */}
      <circle cx="20" cy="40.5" r="0.5" fill="hsl(var(--background))" opacity="0.7" />
      {/* Tail */}
      <path d="M6,42 Q3,38 5,36" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1.2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M6,42 Q3,38 5,36;M6,42 Q3,38 4,39;M6,42 Q3,38 5,36" dur="0.4s" repeatCount="indefinite" />
      </path>
      {/* Legs — animated */}
      <g>
        <animate attributeName="opacity" values="1" dur="1s" repeatCount="indefinite" />
        <rect x="8" y="47" width="1.2" height="5" rx="0.5" fill="currentColor" className="text-primary" opacity="0.55">
          <animate attributeName="height" values="5;4;5" dur="0.4s" repeatCount="indefinite" />
        </rect>
        <rect x="11" y="47" width="1.2" height="5" rx="0.5" fill="currentColor" className="text-primary" opacity="0.55">
          <animate attributeName="height" values="4;5;4" dur="0.4s" repeatCount="indefinite" />
        </rect>
        <rect x="14" y="47" width="1.2" height="5" rx="0.5" fill="currentColor" className="text-primary" opacity="0.55">
          <animate attributeName="height" values="5;4;5" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
        </rect>
        <rect x="17" y="47" width="1.2" height="5" rx="0.5" fill="currentColor" className="text-primary" opacity="0.55">
          <animate attributeName="height" values="4;5;4" dur="0.4s" begin="0.2s" repeatCount="indefinite" />
        </rect>
      </g>
    </g>

    {/* ── Walking Hiker — aligned to ground at y=52 ── */}
    <g>
      <animateTransform attributeName="transform" type="translate" from="-10,0" to="330,0" dur="14s" repeatCount="indefinite" />
      {/* Shadow on ground */}
      <ellipse cx="8" cy="53" rx="6" ry="1.5" fill="currentColor" className="text-primary" opacity="0.08" />
      {/* Head */}
      <circle cx="8" cy="24" r="3.5" fill="currentColor" className="text-primary" opacity="0.85" />
      {/* Hat */}
      {!rainy && <>
        <ellipse cx="8" cy="21.5" rx="5.5" ry="1.3" fill="currentColor" className="text-primary" opacity="0.65" />
        <path d="M5,21.5 Q8,18 11,21.5" fill="currentColor" className="text-primary" opacity="0.7" />
      </>}
      {/* Umbrella when rainy */}
      {rainy && <>
        <path d="M1,16 Q8,8 15,16" fill="#60A5FA" opacity="0.6" />
        <line x1="8" y1="16" x2="8" y2="24" stroke="currentColor" className="text-primary" strokeWidth="0.8" opacity="0.5" />
      </>}
      {/* Body */}
      <rect x="6" y="27.5" width="4.5" height="10" rx="1.8" fill="currentColor" className="text-primary" opacity="0.8" />
      {/* Backpack */}
      <rect x="10.5" y="28" width="4" height="8" rx="1.5" fill="currentColor" className="text-primary" opacity="0.45" />
      <ellipse cx="12.5" cy="27.5" rx="2.3" ry="1" fill="currentColor" className="text-primary" opacity="0.35" />
      {/* Arm with hiking stick */}
      {!rainy && <>
        <line x1="10.5" y1="29" x2="16" y2="52" stroke="currentColor" className="text-primary" strokeWidth="1" strokeLinecap="round" opacity="0.4">
          <animate attributeName="x2" values="16;15;16" dur="1.2s" repeatCount="indefinite" />
        </line>
        <line x1="10" y1="30" x2="13" y2="36" stroke="currentColor" className="text-primary" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <animate attributeName="x2" values="13;12;13" dur="1.2s" repeatCount="indefinite" />
        </line>
      </>}
      {/* Left arm */}
      <line x1="6" y1="30" x2="3" y2="36" stroke="currentColor" className="text-primary" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      {/* Left leg */}
      <rect x="5.5" y="37" width="2.5" height="9" rx="1" fill="currentColor" className="text-primary" opacity="0.75">
        <animate attributeName="x" values="5.5;4.5;5.5" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="7" cy="46.5" rx="2.5" ry="1" fill="currentColor" className="text-primary" opacity="0.6">
        <animate attributeName="cx" values="7;6;7" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
      {/* Right leg */}
      <rect x="8" y="37" width="2.5" height="9" rx="1" fill="currentColor" className="text-primary" opacity="0.75">
        <animate attributeName="x" values="8;9;8" dur="0.8s" repeatCount="indefinite" />
      </rect>
      <ellipse cx="9.5" cy="46.5" rx="2.5" ry="1" fill="currentColor" className="text-primary" opacity="0.6">
        <animate attributeName="cx" values="9.5;10.5;9.5" dur="0.8s" repeatCount="indefinite" />
      </ellipse>
    </g>

    {/* ── Destination: Tent + Campfire ── */}
    {/* Tent */}
    <g opacity="0.35">
      <polygon points="365,52 385,52 375,34" fill="currentColor" className="text-primary" />
      <polygon points="375,34 371,52 379,52" fill="currentColor" className="text-primary" opacity="0.7" />
      <path d="M373,52 Q375,44 377,52" fill="hsl(var(--background))" opacity="0.4" />
      <line x1="375" y1="34" x2="375" y2="30" stroke="currentColor" className="text-primary" strokeWidth="0.6" />
      <polygon points="375,30 375,33 380,31.5" fill="#F59E0B" opacity="0.6">
        <animate attributeName="points" values="375,30 375,33 380,31.5;375,30 375,33 379,32;375,30 375,33 380,31.5" dur="2s" repeatCount="indefinite" />
      </polygon>
    </g>

    {/* Campfire */}
    <g>
      {/* Logs */}
      <rect x="352" y="50" width="10" height="2" rx="1" fill="currentColor" className="text-primary" opacity="0.25" transform="rotate(-8 357 51)" />
      <rect x="354" y="49" width="8" height="1.8" rx="0.8" fill="currentColor" className="text-primary" opacity="0.2" transform="rotate(5 358 50)" />
      {/* Flames */}
      <ellipse cx="357" cy="44" rx="3.5" ry="7" fill="#FBBF24" opacity="0.8">
        <animate attributeName="ry" values="7;8;6.5;7" dur="0.6s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="355" cy="43" rx="2.5" ry="5.5" fill="#F97316" opacity="0.6">
        <animate attributeName="ry" values="5.5;6.2;5;5.5" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="359" cy="43.5" rx="2" ry="5" fill="#EF4444" opacity="0.45">
        <animate attributeName="ry" values="5;5.8;4.5;5" dur="0.7s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="357" cy="42" rx="1.5" ry="3.5" fill="#FDE68A" opacity="0.5">
        <animate attributeName="ry" values="3.5;4;3;3.5" dur="0.4s" repeatCount="indefinite" />
      </ellipse>
      {/* Sparks */}
      {[{x:355,y:35,d:"0s"},{x:359,y:33,d:"0.5s"},{x:357,y:31,d:"1s"}].map((sp,i) => (
        <circle key={i} cx={sp.x} cy={sp.y} r="0.8" fill="#FDE68A" opacity="0.6">
          <animate attributeName="cy" values={`${sp.y};${sp.y - 8}`} dur="1.5s" begin={sp.d} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="1.5s" begin={sp.d} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Smoke */}
      <circle cx="356" cy="30" r="1.5" fill="currentColor" className="text-muted-foreground" opacity="0.1">
        <animate attributeName="cy" values="30;22" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {/* Ground glow */}
      <ellipse cx="357" cy="52" rx="12" ry="3" fill="#FBBF24" opacity="0.06" />
    </g>

    {/* Small trees near destination */}
    {[{x:340,h:12},{x:395,h:10}].map((t,i) => (
      <g key={`tree-${i}`} opacity="0.2">
        <rect x={t.x - 0.5} y={52 - t.h * 0.4} width="1.2" height={t.h * 0.45} rx="0.4" fill="currentColor" className="text-primary" />
        <polygon points={`${t.x},${52 - t.h} ${t.x - 4},${52 - t.h * 0.3} ${t.x + 4},${52 - t.h * 0.3}`} fill="#22C55E" opacity="0.7" />
      </g>
    ))}
  </svg>
);



      {time === "dawn" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.1) + sc * -0.08}px)` }}>
          <div className="absolute bottom-[55%] right-[20%]" style={{ animation: "dawnRise 4s ease-out forwards" }}>
            <svg width="34" height="34" viewBox="0 0 30 30">
              <defs><radialGradient id="dawnSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="15" cy="15" r="15" fill="url(#dawnSun)" /><circle cx="15" cy="15" r="7" fill="#FBBF24" />
              {/* Sun rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line key={angle} x1="15" y1="15" x2={15 + Math.cos(angle * Math.PI / 180) * 14} y2={15 + Math.sin(angle * Math.PI / 180) * 14}
                  stroke="#FBBF24" strokeWidth="0.5" opacity="0.4" style={{ animation: `sunRayPulse 3s ease-in-out ${angle / 360}s infinite` }} />
              ))}
            </svg>
          </div>
          {/* Morning mist wisps */}
          {[{ x: "10%", y: "75%", w: 80 }, { x: "40%", y: "80%", w: 60 }, { x: "70%", y: "72%", w: 90 }].map((m, i) => (
            <div key={i} className="absolute" style={{ left: m.x, top: m.y, animation: `mistDrift ${6 + i * 2}s ease-in-out ${i}s infinite` }}>
              <svg width={m.w} height="8" viewBox={`0 0 ${m.w} 8`} opacity="0.15">
                <ellipse cx={m.w / 2} cy="4" rx={m.w / 2} ry="3" fill="white" />
              </svg>
            </div>
          ))}
          {[{ x: "15%", y: "85%", d: "0s" }, { x: "35%", y: "88%", d: "0.8s" }, { x: "55%", y: "83%", d: "0.4s" }, { x: "75%", y: "87%", d: "1.2s" }].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-white/80" style={{ left: d.x, top: d.y, animation: `dewSparkle 3s ease-in-out ${d.d} infinite` }} />
          ))}
        </div>
      )}

      {/* === MORNING === */}
      {time === "morning" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "10%", right: "12%", transform: `translate(${px(0.12)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="40" height="40" viewBox="0 0 36 36">
              <defs><radialGradient id="mornSun"><stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" /><stop offset="60%" stopColor="#F59E0B" stopOpacity="0.5" /><stop offset="100%" stopColor="#F59E0B" stopOpacity="0" /></radialGradient></defs>
              <circle cx="18" cy="18" r="18" fill="url(#mornSun)" /><circle cx="18" cy="18" r="8" fill="#FBBF24" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <line key={a} x1="18" y1="18" x2={18 + Math.cos(a * Math.PI / 180) * 16} y2={18 + Math.sin(a * Math.PI / 180) * 16}
                  stroke="#FBBF24" strokeWidth="0.6" opacity="0.3" style={{ animation: `sunRayPulse 4s ease-in-out ${a / 360}s infinite` }} />
              ))}
            </svg>
          </div>
          {/* Birds */}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ y: "18%", dur: "7s", delay: "0s", size: 10 }, { y: "28%", dur: "9s", delay: "3s", size: 8 }, { y: "14%", dur: "11s", delay: "5s", size: 7 }].map((b, i) => (
              <div key={i} className="absolute" style={{ top: b.y, animation: `heroBirdFly ${b.dur} linear ${b.delay} infinite` }}>
                <svg width={b.size} height={b.size * 0.5} viewBox="0 0 20 10" className="text-foreground/30">
                  <path d="M0,6 Q5,0 10,5 Q15,0 20,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <animate attributeName="d" values="M0,6 Q5,0 10,5 Q15,0 20,6;M0,4 Q5,7 10,5 Q15,7 20,4;M0,6 Q5,0 10,5 Q15,0 20,6" dur="0.6s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>
            ))}
          </div>
          {/* Butterflies */}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.3)}px, ${py(0.2)}px)` }}>
            {[{ x: "20%", y: "35%", color: "#F59E0B", dur: "6s" }, { x: "65%", y: "30%", color: "#A78BFA", dur: "7s" }, { x: "45%", y: "42%", color: "#34D399", dur: "8s" }].map((bf, i) => (
              <div key={i} className="absolute" style={{ left: bf.x, top: bf.y, animation: `butterflyFloat ${bf.dur} ease-in-out ${i}s infinite` }}>
                <svg width="10" height="7" viewBox="0 0 14 10" opacity="0.6">
                  <ellipse cx="4" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="10" cy="5" rx="3" ry="3.5" fill={bf.color}><animate attributeName="rx" values="3;1;3" dur="0.35s" repeatCount="indefinite" /></ellipse>
                </svg>
              </div>
            ))}
          </div>
          {/* Floating leaves */}
          {[{ x: "30%", dur: "8s", delay: "0s" }, { x: "60%", dur: "10s", delay: "3s" }, { x: "80%", dur: "7s", delay: "1s" }].map((l, i) => (
            <div key={i} className="absolute" style={{ left: l.x, animation: `leafFall ${l.dur} ease-in-out ${l.delay} infinite` }}>
              <svg width="8" height="6" viewBox="0 0 10 8" opacity="0.3">
                <ellipse cx="5" cy="4" rx="4" ry="2" fill="#22C55E" transform="rotate(-30 5 4)" />
                <line x1="2" y1="5" x2="8" y2="3" stroke="#16A34A" strokeWidth="0.5" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* === AFTERNOON === */}
      {time === "afternoon" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "6%", right: "18%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 6s ease-in-out infinite" }}>
            <svg width="36" height="36" viewBox="0 0 32 32">
              <defs><radialGradient id="aftSun"><stop offset="0%" stopColor="#FDBA74" stopOpacity="0.8" /><stop offset="60%" stopColor="#F97316" stopOpacity="0.4" /><stop offset="100%" stopColor="#F97316" stopOpacity="0" /></radialGradient></defs>
              <circle cx="16" cy="16" r="16" fill="url(#aftSun)" /><circle cx="16" cy="16" r="7" fill="#FB923C" />
            </svg>
          </div>
          {/* Heat shimmer lines */}
          {[{ y: "65%", delay: "0s" }, { y: "70%", delay: "1s" }, { y: "75%", delay: "2s" }].map((h, i) => (
            <div key={i} className="absolute left-[10%] right-[10%]" style={{ top: h.y, animation: `heatShimmer 3s ease-in-out ${h.delay} infinite` }}>
              <svg width="100%" height="3" viewBox="0 0 300 3" preserveAspectRatio="none" opacity="0.08">
                <path d="M0,1.5 Q50,0 100,1.5 Q150,3 200,1.5 Q250,0 300,1.5" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </svg>
            </div>
          ))}
          {/* Dragonflies */}
          <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.25)}px, ${py(0.15)}px)` }}>
            {[{ x: "18%", y: "25%", dur: "5s", delay: "0s" }, { x: "60%", y: "20%", dur: "6s", delay: "2s" }, { x: "40%", y: "35%", dur: "7s", delay: "1s" }].map((df, i) => (
              <div key={i} className="absolute" style={{ left: df.x, top: df.y, animation: `dragonflyDart ${df.dur} ease-in-out ${df.delay} infinite` }}>
                <svg width="12" height="8" viewBox="0 0 16 10" opacity="0.5">
                  <line x1="3" y1="5" x2="13" y2="5" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
                  <ellipse cx="5" cy="3" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5"><animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" /></ellipse>
                  <ellipse cx="5" cy="7" rx="4" ry="1.5" fill="#93C5FD" opacity="0.5"><animate attributeName="ry" values="1.5;0.5;1.5" dur="0.3s" repeatCount="indefinite" /></ellipse>
                  <circle cx="14" cy="5" r="1.5" fill="#3B82F6" />
                </svg>
              </div>
            ))}
          </div>
          {/* Dust motes */}
          {[{ x: "15%", y: "50%", dur: "5s" }, { x: "50%", y: "45%", dur: "7s" }, { x: "78%", y: "55%", dur: "6s" }].map((d, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-amber-300/30" style={{ left: d.x, top: d.y, animation: `dustFloat ${d.dur} ease-in-out ${i}s infinite` }} />
          ))}
        </>
      )}

      {/* === SUNSET === */}
      {time === "sunset" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ bottom: "55%", left: "15%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunsetSink 10s ease-in forwards" }}>
            <svg width="48" height="48" viewBox="0 0 42 42">
              <defs>
                <radialGradient id="setSun"><stop offset="0%" stopColor="#FBBF24" stopOpacity="0.9" /><stop offset="40%" stopColor="#F97316" stopOpacity="0.6" /><stop offset="100%" stopColor="#DC2626" stopOpacity="0" /></radialGradient>
              </defs>
              <circle cx="21" cy="21" r="21" fill="url(#setSun)" /><circle cx="21" cy="21" r="10" fill="#FB923C" />
            </svg>
          </div>
          {/* Horizon glow */}
          <div className="absolute bottom-[15%] left-0 right-0 h-20 bg-gradient-to-t from-orange-400/20 via-rose-400/10 to-transparent dark:from-orange-800/15 dark:via-rose-800/8" />
          {/* Bird flock */}
          <div className="absolute transition-transform duration-200 ease-out" style={{ top: "18%", transform: `translate(${px(0.2)}px, ${py(0.1)}px)`, animation: "heroBirdFly 12s linear 1s infinite reverse" }}>
            <svg width="30" height="12" viewBox="0 0 50 18" className="text-foreground/30">
              <path d="M0,10 Q6,3 12,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10,12 Q16,5 22,10" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M20,8 Q26,1 32,6" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M28,14 Q34,7 40,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M36,10 Q42,3 48,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
          {/* Second bird group */}
          <div className="absolute" style={{ top: "25%", animation: "heroBirdFly 16s linear 4s infinite reverse" }}>
            <svg width="20" height="8" viewBox="0 0 30 12" className="text-foreground/20">
              <path d="M0,7 Q4,2 8,6" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M6,8 Q10,3 14,7" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M12,6 Q16,1 20,5" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          {/* Floating embers */}
          {[{ x: "20%", dur: "4s" }, { x: "45%", dur: "5s" }, { x: "70%", dur: "3.5s" }, { x: "85%", dur: "6s" }].map((e, i) => (
            <div key={i} className="absolute w-1 h-1 rounded-full bg-orange-400/40" style={{ left: e.x, animation: `emberRise ${e.dur} ease-out ${i * 0.8}s infinite` }} />
          ))}
        </>
      )}

      {/* === NIGHT === */}
      {time === "night" && (
        <>
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "8%", right: "14%", transform: `translate(${px(0.1)}px, ${py(0.08)}px)`, animation: "sunFloat 8s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 28 28">
              <defs><radialGradient id="heroMoon"><stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.5" /><stop offset="100%" stopColor="#E0E7FF" stopOpacity="0" /></radialGradient></defs>
              <circle cx="14" cy="14" r="14" fill="url(#heroMoon)" /><circle cx="14" cy="14" r="9" fill="#E0E7FF" /><circle cx="17" cy="12" r="7" fill="hsl(var(--background))" opacity="0.7" />
            </svg>
          </div>
          {/* Stars — more and with shooting star */}
          {[
            { x: "8%", y: "8%", s: 2, d: "0s" }, { x: "22%", y: "15%", s: 1.5, d: "0.5s" },
            { x: "35%", y: "6%", s: 2.5, d: "1s" }, { x: "55%", y: "12%", s: 2, d: "1.5s" },
            { x: "75%", y: "5%", s: 2, d: "0.3s" }, { x: "88%", y: "18%", s: 1.5, d: "0.8s" },
            { x: "15%", y: "25%", s: 1, d: "2s" }, { x: "45%", y: "22%", s: 1.5, d: "0.2s" },
            { x: "65%", y: "28%", s: 1, d: "1.2s" }, { x: "92%", y: "10%", s: 2, d: "0.6s" },
          ].map((st, i) => (
            <div key={i} className="absolute rounded-full bg-white" style={{ left: st.x, top: st.y, width: st.s, height: st.s, animation: `twinkle 2.5s ease-in-out ${st.d} infinite` }} />
          ))}
          {/* Shooting star */}
          <div className="absolute" style={{ animation: "shootingStar 8s ease-in 2s infinite" }}>
            <svg width="20" height="2" viewBox="0 0 20 2">
              <line x1="0" y1="1" x2="20" y2="1" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <circle cx="20" cy="1" r="1.5" fill="white" opacity="0.9" />
            </svg>
          </div>
          {/* Fireflies */}
          <div className="absolute inset-0 transition-transform duration-150 ease-out" style={{ transform: `translate(${px(0.35)}px, ${py(0.25)}px)` }}>
            {[
              { x: "15%", y: "55%", dur: "4s", delay: "0s" }, { x: "45%", y: "50%", dur: "5s", delay: "1s" },
              { x: "75%", y: "58%", dur: "4.5s", delay: "2s" }, { x: "60%", y: "45%", dur: "5.5s", delay: "1.5s" },
              { x: "30%", y: "62%", dur: "3.5s", delay: "0.5s" }, { x: "85%", y: "42%", dur: "6s", delay: "2.5s" },
            ].map((f, i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full" style={{ left: f.x, top: f.y, background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)", animation: `fireflyFloat ${f.dur} ease-in-out ${f.delay} infinite, fireflyGlow 2s ease-in-out ${f.delay} infinite` }} />
            ))}
          </div>
          {/* Owl */}
          <div className="absolute transition-transform duration-300 ease-out" style={{ top: "38%", left: "82%", transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            <svg width="10" height="12" viewBox="0 0 14 18" className="text-foreground/15">
              <ellipse cx="7" cy="7" rx="6" ry="7" fill="currentColor" /><ellipse cx="7" cy="14" rx="5" ry="4" fill="currentColor" />
              <circle cx="5" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
              <circle cx="9" cy="6" r="1.5" fill="#FBBF24" opacity="0.6"><animate attributeName="opacity" values="0.6;0;0.6" dur="4s" repeatCount="indefinite" /></circle>
            </svg>
          </div>
          {/* Northern lights subtle */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[40%] opacity-[0.06]" style={{ animation: "auroraShift 12s ease-in-out infinite" }}>
            <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22C55E" /><stop offset="50%" stopColor="#818CF8" /><stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q75,20 150,60 Q225,100 300,40" fill="none" stroke="url(#aurora)" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}

      {/* === WEATHER: Clouds === */}
      {weather === "cloudy" && time !== "night" && (
        <div className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: `translate(${px(0.15)}px, ${py(0.08)}px)` }}>
          {[
            { top: "12%", opacity: 0.4, dur: "18s", delay: "0s", w: 60 },
            { top: "28%", opacity: 0.25, dur: "25s", delay: "6s", w: 45 },
            { top: "20%", opacity: 0.15, dur: "22s", delay: "10s", w: 35 },
          ].map((c, i) => (
            <div key={i} className="absolute" style={{ top: c.top, opacity: c.opacity, animation: `heroCloudDrift ${c.dur} linear ${c.delay} infinite` }}>
              <svg width={c.w} height={c.w * 0.35} viewBox={`0 0 ${c.w} ${c.w * 0.35}`} className="text-white dark:text-white/30">
                <ellipse cx={c.w / 2} cy={c.w * 0.25} rx={c.w * 0.47} ry={c.w * 0.12} fill="currentColor" />
                <ellipse cx={c.w * 0.33} cy={c.w * 0.17} rx={c.w * 0.23} ry={c.w * 0.15} fill="currentColor" />
                <ellipse cx={c.w * 0.63} cy={c.w * 0.15} rx={c.w * 0.2} ry={c.w * 0.13} fill="currentColor" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === WEATHER: Wind === */}
      {weather === "windy" && (
        <div className="absolute inset-0">
          {[{ y: "30%", dur: "3s", delay: "0s" }, { y: "45%", dur: "4s", delay: "1.5s" }, { y: "60%", dur: "3.5s", delay: "0.8s" }].map((w, i) => (
            <div key={i} className="absolute" style={{ top: w.y, animation: `windStreak ${w.dur} linear ${w.delay} infinite` }}>
              <svg width="40" height="3" viewBox="0 0 40 3" className="text-foreground/10">
                <path d="M0,1.5 Q10,0 20,1.5 Q30,3 40,1.5" fill="none" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>
          ))}
          {/* Leaves blowing in wind */}
          {[{ y: "35%", dur: "4s", delay: "0s" }, { y: "50%", dur: "3s", delay: "2s" }].map((l, i) => (
            <div key={i} className="absolute" style={{ top: l.y, animation: `windStreak ${l.dur} linear ${l.delay} infinite` }}>
              <svg width="6" height="4" viewBox="0 0 8 6" opacity="0.3">
                <ellipse cx="4" cy="3" rx="3" ry="1.5" fill="#22C55E" style={{ animation: `leafSpin 0.5s linear infinite` }} />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* === WEATHER: Rain === */}
      {weather === "rainy" && (
        <>
          {/* Rain clouds */}
          <div className="absolute inset-0" style={{ transform: `translate(${px(0.1)}px, ${py(0.05)}px)` }}>
            {[
              { top: "5%", opacity: 0.35, dur: "20s", delay: "0s", w: 70 },
              { top: "8%", opacity: 0.25, dur: "28s", delay: "8s", w: 55 },
              { top: "3%", opacity: 0.2, dur: "24s", delay: "4s", w: 50 },
            ].map((c, i) => (
              <div key={i} className="absolute" style={{ top: c.top, opacity: c.opacity, animation: `heroCloudDrift ${c.dur} linear ${c.delay} infinite` }}>
                <svg width={c.w} height={c.w * 0.35} viewBox={`0 0 ${c.w} ${c.w * 0.35}`} className="text-slate-400 dark:text-slate-500/40">
                  <ellipse cx={c.w / 2} cy={c.w * 0.25} rx={c.w * 0.47} ry={c.w * 0.12} fill="currentColor" />
                  <ellipse cx={c.w * 0.33} cy={c.w * 0.17} rx={c.w * 0.23} ry={c.w * 0.15} fill="currentColor" />
                  <ellipse cx={c.w * 0.63} cy={c.w * 0.15} rx={c.w * 0.2} ry={c.w * 0.13} fill="currentColor" />
                </svg>
              </div>
            ))}
          </div>
          {/* Raindrops */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const x = `${(i * 3.3 + Math.random() * 2) % 100}%`;
              const dur = 0.6 + Math.random() * 0.4;
              const delay = Math.random() * 2;
              return (
                <div
                  key={i}
                  className="absolute w-[1px] h-3 bg-gradient-to-b from-transparent via-sky-300/40 to-sky-400/20 dark:via-sky-400/25 dark:to-sky-500/15"
                  style={{
                    left: x,
                    animation: `rainFall ${dur}s linear ${delay}s infinite`,
                  }}
                />
              );
            })}
          </div>
          {/* Puddle ripples at bottom */}
          {[{ x: "15%", delay: "0s" }, { x: "45%", delay: "0.8s" }, { x: "72%", delay: "1.5s" }].map((r, i) => (
            <div key={i} className="absolute bottom-[4%]" style={{ left: r.x }}>
              <svg width="12" height="4" viewBox="0 0 16 6" opacity="0.2">
                <ellipse cx="8" cy="3" rx="7" ry="2.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-sky-300 dark:text-sky-400">
                  <animate attributeName="rx" values="2;7;2" dur="2s" begin={r.delay} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin={r.delay} repeatCount="indefinite" />
                </ellipse>
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Floating particles — drift downward */}
      <div className="absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: `translate(${px(0.2)}px, ${py(0.15)}px)` }}>
        {[
          { x: "10%", dur: "6s", delay: "0s", size: 3 },
          { x: "25%", dur: "8s", delay: "1s", size: 2 },
          { x: "42%", dur: "7s", delay: "2.5s", size: 2.5 },
          { x: "58%", dur: "9s", delay: "0.5s", size: 2 },
          { x: "72%", dur: "6.5s", delay: "3s", size: 3 },
          { x: "88%", dur: "7.5s", delay: "1.5s", size: 2 },
          { x: "5%", dur: "10s", delay: "4s", size: 1.5 },
          { x: "95%", dur: "8.5s", delay: "2s", size: 2 },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              time === "night" ? "bg-indigo-300/30" :
              time === "sunset" ? "bg-orange-300/25" :
              time === "dawn" ? "bg-rose-300/25" :
              "bg-primary/15"
            }`}
            style={{
              left: p.x,
              width: p.size,
              height: p.size,
              animation: `particleDrift ${p.dur} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Soft bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />

      {/* Keyframes */}
      <style>{`
        @keyframes sunFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes fireflyFloat { 0% { transform: translate(0, 0); } 25% { transform: translate(8px, -6px); } 50% { transform: translate(-4px, -10px); } 75% { transform: translate(6px, -3px); } 100% { transform: translate(0, 0); } }
        @keyframes fireflyGlow { 0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #FBBF24; } 50% { opacity: 1; box-shadow: 0 0 10px 3px #FBBF24; } }
        @keyframes heroCloudDrift { 0% { transform: translateX(-80px); } 100% { transform: translateX(calc(100vw + 80px)); } }
        @keyframes heroBirdFly { 0% { left: -5%; } 100% { left: 105%; } }
        @keyframes butterflyFloat { 0% { transform: translate(0,0); } 25% { transform: translate(10px,-12px) rotate(6deg); } 50% { transform: translate(-6px,-20px) rotate(-4deg); } 75% { transform: translate(12px,-8px) rotate(8deg); } 100% { transform: translate(0,0); } }
        @keyframes dragonflyDart { 0%,100% { transform: translate(0,0); } 20% { transform: translate(15px,-8px); } 40% { transform: translate(-10px,5px); } 60% { transform: translate(20px,-3px); } 80% { transform: translate(-5px,8px); } }
        @keyframes dawnRise { 0% { transform: translateY(20px); opacity: 0.3; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes dewSparkle { 0%,100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.5); } }
        @keyframes sunsetSink { 0% { transform: translateY(0); } 100% { transform: translateY(8px); opacity: 0.7; } }
        @keyframes windStreak { 0% { left: -10%; opacity: 0; } 20% { opacity: 0.4; } 80% { opacity: 0.4; } 100% { left: 110%; opacity: 0; } }
        @keyframes particleDrift { 0% { top: 15%; opacity: 0; } 15% { opacity: 0.6; } 85% { opacity: 0.4; } 100% { top: 95%; opacity: 0; } }
        @keyframes hikerWalk { 0% { left: -5%; } 100% { left: 82%; } }
        @keyframes dogWalk { 0% { left: 0%; } 100% { left: 87%; } }
        @keyframes tailWag { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
        @keyframes flagWave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
        @keyframes legSwing { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
        @keyframes stickSwing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes fireFlicker { 0% { transform: scaleY(1) scaleX(1); } 100% { transform: scaleY(1.15) scaleX(0.9); } }
        @keyframes smokeRise { 0% { transform: translateY(0); opacity: 0.15; } 100% { transform: translateY(-8px); opacity: 0; } }
        @keyframes treeBreeze { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(2deg); } }
        @keyframes sunRayPulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes mistDrift { 0%, 100% { transform: translateX(0); opacity: 0.15; } 50% { transform: translateX(15px); opacity: 0.25; } }
        @keyframes leafFall { 0% { top: 10%; opacity: 0; transform: rotate(0deg); } 20% { opacity: 0.4; } 80% { opacity: 0.3; } 100% { top: 90%; opacity: 0; transform: rotate(360deg); } }
        @keyframes heatShimmer { 0%, 100% { transform: scaleX(1); opacity: 0.08; } 50% { transform: scaleX(1.02); opacity: 0.15; } }
        @keyframes dustFloat { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 0.4; } 50% { transform: translate(10px, -15px); opacity: 0.3; } 100% { transform: translate(-5px, -30px); opacity: 0; } }
        @keyframes emberRise { 0% { bottom: 5%; opacity: 0; } 20% { opacity: 0.6; } 100% { bottom: 60%; opacity: 0; transform: translateX(10px); } }
        @keyframes shootingStar { 0% { top: 5%; left: 80%; opacity: 0; } 2% { opacity: 0.9; } 5% { top: 20%; left: 40%; opacity: 0; } 100% { top: 20%; left: 40%; opacity: 0; } }
        @keyframes auroraShift { 0%, 100% { transform: translateX(0); opacity: 0.06; } 50% { transform: translateX(20px); opacity: 0.1; } }
        @keyframes leafSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes rainFall { 0% { top: -3%; opacity: 0; } 10% { opacity: 0.7; } 90% { opacity: 0.5; } 100% { top: 100%; opacity: 0; } }
      `}</style>
    </div>
  );
};

export default HeroScenery;

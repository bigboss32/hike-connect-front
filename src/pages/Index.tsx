import { useState, useCallback } from "react";
import Navigation from "@/components/Navigation";
import HeroScenery from "@/components/HeroScenery";
import FeaturedRoutesCarousel from "@/components/FeaturedRoutesCarousel";
import UserStatsCards from "@/components/UserStatsCards";
import NearbyRoutesMap from "@/components/NearbyRoutesMap";
import MyBookingsSection from "@/components/MyBookingsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, CloudSun, Loader2 } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: "Buenas noches", icon: Moon, emoji: "🌙" };
  if (hour < 12) return { text: "Buenos días", icon: Sun, emoji: "☀️" };
  if (hour < 18) return { text: "Buenas tardes", icon: CloudSun, emoji: "🌤️" };
  return { text: "Buenas noches", icon: Moon, emoji: "🌙" };
};

const Index = () => {
  const { user, fetchProfile } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Aventurero';
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(async () => {
    await fetchProfile();
    setRefreshKey(k => k + 1);
  }, [fetchProfile]);

  const { pullDistance, refreshing } = usePullToRefresh(handleRefresh);

  return (
    <div className="min-h-screen bg-background pb-28">

      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || refreshing) && (
        <div
          className="flex items-center justify-center transition-all duration-200"
          style={{ height: pullDistance > 0 ? pullDistance : 48 }}
        >
          <Loader2 className={`w-6 h-6 text-primary ${refreshing ? "animate-spin" : ""}`}
            style={{ opacity: Math.min(pullDistance / 60, 1) }}
          />
        </div>
      )}

      {/* Extended hero zone — scenery covers greeting + bookings */}
      <div className="relative bg-gradient-to-br from-primary/15 via-background to-accent/10 overflow-hidden">
        <HeroScenery />

        {/* Greeting text */}
        <div className="relative z-10 pt-8 pb-4 px-4">
          <div className="max-w-lg mx-auto">
            <p className="text-sm text-muted-foreground mb-1 animate-fade-in flex items-center gap-1.5">
              <span>{greeting.emoji}</span>
              {greeting.text}
            </p>
            <h1 className="text-2xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '50ms' }}>
              {firstName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              ¿Listo para tu próxima aventura?
            </p>
          </div>
        </div>

        {/* Bookings inside the hero zone */}
        <div className="relative z-10 px-4 pb-6">
          <div className="max-w-lg mx-auto">
            <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
              <MyBookingsSection key={refreshKey} />
            </section>
          </div>
        </div>

        {/* Hiker trail card — dedicated visible strip */}
        <div className="relative z-10 px-4 pb-6">
          <div className="max-w-lg mx-auto">
            <div className="relative h-16 rounded-2xl overflow-hidden backdrop-blur-sm bg-foreground/[0.06] border border-foreground/[0.08]">
              {/* Terrain inside the card */}
              <svg className="absolute bottom-0 left-0 right-0 w-full h-6 text-primary/10" viewBox="0 0 400 24" preserveAspectRatio="none" fill="currentColor">
                <path d="M0,18 Q50,8 100,16 Q150,22 200,12 Q250,6 300,16 Q350,22 400,10 L400,24 L0,24Z" opacity="0.8" />
                <path d="M0,20 Q60,14 120,19 Q180,24 240,15 Q300,8 360,18 Q380,22 400,14 L400,24 L0,24Z" opacity="0.5" />
              </svg>

              {/* Trail line */}
              <div className="absolute bottom-3 left-[5%] right-[5%] h-[1.5px] bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

              {/* Trees along the path */}
              {[
                { x: "12%", h: 16 }, { x: "28%", h: 12 }, { x: "52%", h: 18 }, { x: "78%", h: 14 },
              ].map((tree, i) => (
                <div key={i} className="absolute bottom-3" style={{ left: tree.x }}>
                  <svg width="8" height={tree.h} viewBox={`0 0 10 ${tree.h}`} className="text-primary" opacity="0.25">
                    <rect x="4" y={tree.h * 0.55} width="2" height={tree.h * 0.45} fill="currentColor" rx="1" />
                    <path d={`M5,0 L0,${tree.h * 0.6} L10,${tree.h * 0.6}Z`} fill="currentColor" />
                  </svg>
                </div>
              ))}

              {/* Footprints */}
              <div className="absolute bottom-[11px] left-0 right-0 flex gap-3 opacity-15" style={{ animation: "hikerWalk 12s linear infinite" }}>
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="w-1 h-0.5 rounded-full bg-primary shrink-0" style={{ opacity: 1 - i * 0.04 }} />
                ))}
              </div>

              {/* Walking Hiker */}
              <div className="absolute bottom-[8px]" style={{ animation: "hikerWalk 12s linear infinite" }}>
                <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="text-primary">
                  <circle cx="10" cy="4.5" r="3" fill="currentColor" opacity="0.9" />
                  <ellipse cx="10" cy="2.8" rx="4.5" ry="1" fill="currentColor" opacity="0.7" />
                  <path d="M7 2.8 Q10 -0.5 13 2.8" fill="currentColor" opacity="0.8" />
                  <rect x="8.5" y="7.5" width="3" height="8" rx="1.5" fill="currentColor" opacity="0.85" />
                  <rect x="5.5" y="7.5" width="3.5" height="6" rx="1.5" fill="currentColor" opacity="0.45" />
                  <g style={{ transformOrigin: "13px 8px", animation: "stickSwing 1.2s ease-in-out infinite" }}>
                    <line x1="13" y1="8" x2="17" y2="22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                    <line x1="11.5" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
                  </g>
                  <g style={{ transformOrigin: "9.5px 15px", animation: "legSwing 0.8s ease-in-out infinite" }}>
                    <rect x="8" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
                    <ellipse cx="9.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
                  </g>
                  <g style={{ transformOrigin: "11px 15px", animation: "legSwing 0.8s ease-in-out 0.4s infinite" }}>
                    <rect x="10" y="15" width="2.2" height="7" rx="1.1" fill="currentColor" opacity="0.8" />
                    <ellipse cx="11.5" cy="22.5" rx="2.2" ry="1" fill="currentColor" opacity="0.7" />
                  </g>
                </svg>
              </div>

              {/* Campfire at destination */}
              <div className="absolute bottom-[8px] right-[8%]">
                <svg width="14" height="18" viewBox="0 0 16 20" fill="none">
                  <rect x="3" y="16" width="10" height="2" rx="1" fill="currentColor" className="text-primary" opacity="0.3" />
                  <path d="M8 5 Q10 8 9 11 Q8.5 13 8 14 Q7.5 13 7 11 Q6 8 8 5Z" fill="#F59E0B" opacity="0.85" style={{ animation: "fireFlicker 0.6s ease-in-out infinite alternate" }} />
                  <path d="M8 7 Q9 9.5 8.5 12 Q8.2 13 8 13.2 Q7.8 13 7.5 12 Q7 9.5 8 7Z" fill="#EF4444" opacity="0.55" style={{ animation: "fireFlicker 0.6s ease-in-out 0.15s infinite alternate" }} />
                  <circle cx="7.5" cy="3.5" r="1" fill="currentColor" className="text-muted-foreground" opacity="0.15" style={{ animation: "smokeRise 2s ease-out infinite" }} />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Smooth gradient transition from hero to content */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background via-background/50 to-transparent z-[5]" />
      </div>

      <main className="max-w-lg mx-auto px-4 -mt-8 relative z-10 space-y-5">

        {/* User Stats */}
        <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <UserStatsCards hideGreeting />
        </section>

        {/* Featured Routes Carousel */}
        <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Rutas Destacadas</h2>
            <Link to="/routes">
              <Button variant="ghost" size="sm" className="text-xs text-primary">Ver todas</Button>
            </Link>
          </div>
          <FeaturedRoutesCarousel />
        </section>

        {/* Nearby Routes Map */}
        <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <NearbyRoutesMap />
        </section>

      </main>

      <Navigation />
    </div>
  );
};

export default Index;

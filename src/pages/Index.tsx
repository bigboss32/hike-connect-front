import Navigation from "@/components/Navigation";
import FeaturedRoutesCarousel from "@/components/FeaturedRoutesCarousel";
import UserStatsCards from "@/components/UserStatsCards";
import NearbyRoutesMap from "@/components/NearbyRoutesMap";
import { Button } from "@/components/ui/button";
import { Mountain, Users, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 pt-6">

      <main className="max-w-lg mx-auto px-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Link to="/routes" className="bg-card rounded-xl p-3 shadow-elevated text-center hover-scale">
            <Mountain className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Rutas</p>
          </Link>
          <Link to="/communities" className="bg-card rounded-xl p-3 shadow-elevated text-center hover-scale">
            <Users className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Grupos</p>
          </Link>
          <Link to="/events" className="bg-card rounded-xl p-3 shadow-elevated text-center hover-scale">
            <Calendar className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Eventos</p>
          </Link>
          <Link to="/profile" className="bg-card rounded-xl p-3 shadow-elevated text-center hover-scale">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xs font-medium text-foreground">Logros</p>
          </Link>
        </div>

        {/* User Stats */}
        <UserStatsCards />

        {/* Featured Routes Carousel */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Rutas Destacadas</h2>
            <Link to="/routes">
              <Button variant="ghost" size="sm" className="text-xs">Ver todas</Button>
            </Link>
          </div>
          <FeaturedRoutesCarousel />
        </section>

        {/* Nearby Routes Map */}
        <section>
          <NearbyRoutesMap />
        </section>

        {/* CTA Section */}
        <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-xl p-5 text-center shadow-elevated">
            <h3 className="text-lg font-bold text-white mb-1">
              ¿Listo para tu aventura?
            </h3>
            <p className="text-white/90 text-sm mb-3">
              Únete a la comunidad y encuentra compañeros de ruta
            </p>
            <Link to="/communities">
              <Button variant="secondary" size="default">
                Explorar comunidades
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
};

export default Index;

import Navigation from "@/components/Navigation";
import FeaturedRoutesCarousel from "@/components/FeaturedRoutesCarousel";
import UserStatsCards from "@/components/UserStatsCards";
import NearbyRoutesMap from "@/components/NearbyRoutesMap";
import MyBookingsSection from "@/components/MyBookingsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sun, Moon, CloudSun } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: "Buenas noches", icon: Moon, emoji: "🌙" };
  if (hour < 12) return { text: "Buenos días", icon: Sun, emoji: "☀️" };
  if (hour < 18) return { text: "Buenas tardes", icon: CloudSun, emoji: "🌤️" };
  return { text: "Buenas noches", icon: Moon, emoji: "🌙" };
};

const Index = () => {
  const { user } = useAuth();
  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] || 'Aventurero';

  return (
    <div className="min-h-screen bg-background pb-28">

      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-primary/15 via-background to-accent/10 pt-8 pb-6 px-4">
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

      <main className="max-w-lg mx-auto px-4 -mt-2 space-y-5">

        {/* User Stats */}
        <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <UserStatsCards hideGreeting />
        </section>

        {/* Featured Routes Carousel */}
        <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-foreground">Rutas Destacadas</h2>
            <Link to="/routes">
              <Button variant="ghost" size="sm" className="text-xs text-primary">Ver todas</Button>
            </Link>
          </div>
          <FeaturedRoutesCarousel />
        </section>

        {/* Mis Reservas */}
        <section className="animate-fade-in" style={{ animationDelay: '350ms' }}>
          <MyBookingsSection />
        </section>

        {/* Nearby Routes Map */}
        <section className="animate-fade-in" style={{ animationDelay: '450ms' }}>
          <NearbyRoutesMap />
        </section>

      </main>

      <Navigation />
    </div>
  );
};

export default Index;

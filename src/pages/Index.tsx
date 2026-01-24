import Navigation from "@/components/Navigation";
import FeaturedRoutesCarousel from "@/components/FeaturedRoutesCarousel";
import UserStatsCards from "@/components/UserStatsCards";
import NearbyRoutesMap from "@/components/NearbyRoutesMap";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 pt-6">

      <main className="max-w-lg mx-auto px-4 space-y-6">
        {/* User Stats */}

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

      </main>

      <Navigation />
    </div>
  );
};

export default Index;

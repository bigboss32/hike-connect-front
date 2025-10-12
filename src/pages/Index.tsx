import Navigation from "@/components/Navigation";
import RouteCard from "@/components/RouteCard";
import { Button } from "@/components/ui/button";
import { Mountain, Users, Calendar, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-hiking.jpg";
import routeForest from "@/assets/route-forest.jpg";
import routeCoast from "@/assets/route-coast.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-64 overflow-hidden hero-safe">
        <img
          src={heroImage}
          alt="Hiking trail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Descubre tu próxima aventura
          </h1>
          <p className="text-white/90 text-sm drop-shadow">
            Conecta con senderistas y explora rutas increíbles
          </p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4">
        <div className="grid grid-cols-4 gap-3 -mt-8 mb-8">
          <div className="bg-card rounded-xl p-4 shadow-elevated text-center">
            <Mountain className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground">Rutas</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-elevated text-center">
            <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground">Grupos</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-elevated text-center">
            <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground">Eventos</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-elevated text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground">Logros</p>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Rutas Populares</h2>
            <Button variant="ghost" size="sm">Ver todas</Button>
          </div>
          <div className="grid gap-4">
            <RouteCard
              title="Sendero del Bosque Encantado"
              location="Sierra de Madrid"
              distance="8.5 km"
              duration="3h 30min"
              difficulty="Medio"
              image={routeForest}
              type="pública"
            />
            <RouteCard
              title="Ruta Premium Picos de Europa"
              location="Picos de Europa"
              distance="15 km"
              duration="5h"
              difficulty="Difícil"
              image={routeCoast}
              type="privada"
              company="Montaña Aventura Pro"
            />
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-primary to-primary-glow rounded-xl p-6 text-center shadow-elevated">
            <h3 className="text-xl font-bold text-white mb-2">
              ¿Listo para tu aventura?
            </h3>
            <p className="text-white/90 text-sm mb-4">
              Únete a la comunidad y encuentra compañeros de ruta
            </p>
            <Button variant="secondary" size="lg">
              Explorar ahora
            </Button>
          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
};

export default Index;

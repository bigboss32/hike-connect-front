import Navigation from "@/components/Navigation";
import RouteCard from "@/components/RouteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import routeForest from "@/assets/route-forest.jpg";
import routeCoast from "@/assets/route-coast.jpg";

const Routes = () => {
  const routes = [
    {
      title: "Sendero del Bosque Encantado",
      location: "Sierra de Madrid",
      distance: "8.5 km",
      duration: "3h 30min",
      difficulty: "Medio" as const,
      image: routeForest,
    },
    {
      title: "Ruta Costera del Atlántico",
      location: "Costa de Galicia",
      distance: "12 km",
      duration: "4h 15min",
      difficulty: "Difícil" as const,
      image: routeCoast,
    },
    {
      title: "Camino del Valle Verde",
      location: "Pirineo Aragonés",
      distance: "5.2 km",
      duration: "2h",
      difficulty: "Fácil" as const,
      image: routeForest,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-soft">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Explorar Rutas</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar rutas..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid gap-4">
          {routes.map((route, index) => (
            <RouteCard key={index} {...route} />
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Routes;

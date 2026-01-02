import Navigation from "@/components/Navigation";
import RouteCard from "@/components/RouteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { allRoutes } from "@/data/routes";

const Routes = () => {
  const [categoryFilter, setCategoryFilter] = useState<"todas" | "senderismo" | "agroturismo">("todas");
  const [typeFilter, setTypeFilter] = useState<"todas" | "públicas" | "premium">("todas");

  const routes = allRoutes.filter(route => {
    const matchesCategory = categoryFilter === "todas" || route.category === categoryFilter;
    const matchesType = 
      typeFilter === "todas" || 
      (typeFilter === "públicas" && route.type === "pública") ||
      (typeFilter === "premium" && (route.type === "privada" || route.type === "agroturismo"));
    return matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-soft safe-top">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Explorar Rutas</h1>
          <div className="flex gap-2 mb-4">
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
          <Tabs defaultValue="todas" className="w-full mb-3" onValueChange={(value) => setCategoryFilter(value as any)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="senderismo">Senderismo</TabsTrigger>
              <TabsTrigger value="agroturismo">Agroturismo</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs defaultValue="todas" className="w-full" onValueChange={(value) => setTypeFilter(value as any)}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="públicas">Públicas</TabsTrigger>
              <TabsTrigger value="premium">Premium/Fincas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid gap-4">
          {routes.map((route) => (
            <RouteCard key={route.id} {...route} />
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Routes;

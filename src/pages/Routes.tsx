import Navigation from "@/components/Navigation";
import RouteCard from "@/components/RouteCard";
import RouteFiltersDialog from "@/components/RouteFiltersDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { Skeleton } from "@/components/ui/skeleton";

const Routes = () => {
  const [filters, setFilters] = useState({
    category: "todas",
    type: "todas",
    maxDistance: 50,
    difficulty: "todas",
    maxDuration: 12,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useRoutes(filters.category, filters.type, debouncedSearch);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Filter routes by distance, duration, and difficulty on client side
  const allRoutes = (data?.pages.flatMap((page) => page.results) ?? []).filter((route) => {
    // Distance filter (parse from string like "3 km")
    if (filters.maxDistance < 50) {
      const distanceNum = parseFloat(route.distance?.replace(/[^\d.]/g, "") || "0");
      if (distanceNum > filters.maxDistance) return false;
    }
    
    // Duration filter (parse from string like "2 h")
    if (filters.maxDuration < 12) {
      const durationNum = parseFloat(route.duration?.replace(/[^\d.]/g, "") || "0");
      if (durationNum > filters.maxDuration) return false;
    }
    
    // Difficulty filter
    if (filters.difficulty !== "todas" && route.difficulty !== filters.difficulty) {
      return false;
    }
    
    return true;
  });

  // Check if any filter is active
  const hasActiveFilters = 
    filters.category !== "todas" || 
    filters.type !== "todas" || 
    filters.maxDistance < 50 || 
    filters.difficulty !== "todas" ||
    filters.maxDuration < 12;

  // Get active filter labels for display
  const getActiveFilterLabels = () => {
    const labels = [];
    if (filters.category !== "todas") labels.push(filters.category);
    if (filters.type !== "todas") labels.push(filters.type === "premium" ? "Premium" : filters.type);
    if (filters.difficulty !== "todas") labels.push(filters.difficulty);
    if (filters.maxDistance < 50) labels.push(`≤${filters.maxDistance}km`);
    if (filters.maxDuration < 12) labels.push(`≤${filters.maxDuration}h`);
    return labels;
  };

  const activeLabels = getActiveFilterLabels();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-soft safe-top">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Explorar Rutas</h1>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar rutas..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant={hasActiveFilters ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowFiltersModal(true)}
              className="relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center border-2 border-background">
                  {activeLabels.length}
                </span>
              )}
            </Button>
          </div>
          
          {/* Active filters chips */}
          {activeLabels.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
              {activeLabels.map((label, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {label}
                </Badge>
              ))}
              <Badge 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                onClick={() => setFilters({
                  category: "todas",
                  type: "todas",
                  maxDistance: 50,
                  difficulty: "todas",
                  maxDuration: 12,
                })}
              >
                <X className="w-3 h-3 mr-1" />
                Limpiar
              </Badge>
            </div>
          )}
        </div>
      </header>

      <RouteFiltersDialog
        open={showFiltersModal}
        onOpenChange={setShowFiltersModal}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <main className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-2">Error al cargar las rutas</p>
            <p className="text-muted-foreground text-sm">{(error as Error)?.message}</p>
          </div>
        ) : allRoutes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron rutas</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {allRoutes.map((route) => (
              <RouteCard
                key={route.id}
                id={route.id}
                title={route.title}
                location={route.location}
                distance={route.distance}
                duration={route.duration}
                difficulty={route.difficulty}
                image={route.image}
                type={route.type}
                company={route.company}
                category={route.category}
                rating_avg={route.rating_avg}
                rating_count={route.rating_count}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Cargando más rutas...</span>
            </div>
          )}
          {!hasNextPage && allRoutes.length > 0 && (
            <p className="text-muted-foreground text-sm">No hay más rutas</p>
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Routes;

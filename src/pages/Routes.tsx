import Navigation from "@/components/Navigation";
import RouteCard from "@/components/RouteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { Skeleton } from "@/components/ui/skeleton";

const Routes = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");
  const [typeFilter, setTypeFilter] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  
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
  } = useRoutes(categoryFilter, typeFilter, debouncedSearch);

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

  const allRoutes = data?.pages.flatMap((page) => page.results) ?? [];

  // Check if any filter is active
  const hasActiveFilters = categoryFilter !== "todas" || typeFilter !== "todas";

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant={showFilters || hasActiveFilters ? "default" : "outline"} 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && !showFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </div>
          
          {showFilters && (
            <div className="space-y-3 animate-fade-in">
              <Tabs defaultValue={categoryFilter} className="w-full" onValueChange={setCategoryFilter}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="senderismo">Senderismo</TabsTrigger>
                  <TabsTrigger value="agroturismo">Agroturismo</TabsTrigger>
                </TabsList>
              </Tabs>
              <Tabs defaultValue={typeFilter} className="w-full" onValueChange={setTypeFilter}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="públicas">Públicas</TabsTrigger>
                  <TabsTrigger value="premium">Premium/Fincas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
      </header>

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

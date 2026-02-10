import { useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import EventCard from "@/components/EventCard";
import CreateEventDialog from "@/components/CreateEventDialog";
import { useEvents } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const EventCardSkeleton = () => (
  <div className="bg-card rounded-lg p-4 shadow-soft">
    <Skeleton className="h-6 w-3/4 mb-3" />
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-36" />
    </div>
    <Skeleton className="h-10 w-full" />
  </div>
);

const Events = () => {
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useEvents();
  
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allEvents = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border" style={{position: 'static'}}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Eventos</h1>
            <CreateEventDialog />
          </div>
          <p className="text-muted-foreground text-sm">
            Próximas salidas de senderismo
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid gap-4">
          {isLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : allEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay eventos disponibles</p>
            </div>
          ) : (
            allEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="py-4 flex justify-center">
          {isFetchingNextPage && (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          )}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Events;

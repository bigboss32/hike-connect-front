import Navigation from "@/components/Navigation";
import CampfireScene from "@/components/CampfireScene";
import CommunityCard from "@/components/CommunityCard";
import CreateCommunityDialog from "@/components/CreateCommunityDialog";
import { useCommunities } from "@/hooks/useCommunities";
import { Skeleton } from "@/components/ui/skeleton";

const Communities = () => {
  const { data, isLoading, error } = useCommunities();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Campfire hero banner */}
      <div className="relative">
        <CampfireScene />
        <div className="absolute bottom-6 left-0 right-0 z-10 px-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-foreground">Comunidades</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Únete a grupos de senderismo en tu zona
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            Error al cargar las comunidades
          </div>
        ) : data?.results.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay comunidades disponibles
          </div>
        ) : (
          <div className="grid gap-4">
            {data?.results.map((community) => (
              <CommunityCard key={community.id} {...community} />
            ))}
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Communities;

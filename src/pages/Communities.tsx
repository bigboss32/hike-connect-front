import Navigation from "@/components/Navigation";
import CommunityCard from "@/components/CommunityCard";
import CreateCommunityDialog from "@/components/CreateCommunityDialog";
import communityImg from "@/assets/community.jpg";

const Communities = () => {
  const communities = [
    {
      name: "Montañeros Madrid",
      members: 1247,
      description: "Comunidad de amantes del senderismo en la Sierra de Madrid. Salidas cada fin de semana.",
      image: communityImg,
    },
    {
      name: "Senderismo Costa",
      members: 856,
      description: "Exploramos las mejores rutas costeras del norte de España.",
      image: communityImg,
    },
    {
      name: "Aventureros Novatos",
      members: 432,
      description: "Grupo para principiantes que quieren empezar en el mundo del senderismo.",
      image: communityImg,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Comunidades</h1>
            <CreateCommunityDialog />
          </div>
          <p className="text-muted-foreground text-sm">
            Únete a grupos de senderismo en tu zona
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="grid gap-4">
          {communities.map((community, index) => (
            <CommunityCard key={index} {...community} />
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Communities;

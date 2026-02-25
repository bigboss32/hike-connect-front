import { useEffect, useState } from "react";
import ScrollHeader from "@/components/ScrollHeader";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, MapPin, Calendar, ChevronRight, Trophy, Route, Crown } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
import RouteHistoryDialog from "@/components/RouteHistoryDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background pb-20">
    <header className="bg-card border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-lg mx-auto px-4 py-6">
      <Card className="mb-6 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-soft">
            <CardContent className="p-4 text-center space-y-2">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-4">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>

    <Navigation />
  </div>
);

const Profile = () => {
  const { user, fetchProfile } = useAuth();
  const { toast } = useToast();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      await fetchProfile();
      setIsLoadingProfile(false);
    };
    loadProfile();
  }, []);

  if (isLoadingProfile) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <ScrollHeader className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
          </div>
        </div>
      </ScrollHeader>

      <main className="max-w-lg mx-auto px-4 py-6 stagger-fade-up">
        <Card className="mb-6 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-20 h-20 animate-avatar-entrance">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground text-sm mb-2">{user.email}</p>
                <Badge variant="secondary">
                  <Award className="w-3 h-3 mr-1" />
                  Explorador
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {user.bio || "Amante de la naturaleza y el senderismo. Siempre buscando nuevas rutas por descubrir."}
            </p>
            <EditProfileDialog initialData={{ bio: user.bio || "" }}>
              <Button className="w-full" variant="outline">
                Editar Perfil
              </Button>
            </EditProfileDialog>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <RouteHistoryDialog>
            <Card className="shadow-soft cursor-pointer hover:shadow-md transition-shadow group">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">24</p>
                <p className="text-xs text-muted-foreground">Rutas</p>
              </CardContent>
            </Card>
          </RouteHistoryDialog>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-secondary">156</p>
              <p className="text-xs text-muted-foreground">km</p>
            </CardContent>
          </Card>
          <Link to="/achievements">
            <Card className="shadow-soft cursor-pointer hover:shadow-md transition-shadow group">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform">8</p>
                <p className="text-xs text-muted-foreground">Logros</p>
              </CardContent>
            </Card>
          </Link>
        </div>
        <Link to="/achievements" className="block group">
          <Card className="shadow-soft hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">Logros</h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Ver todos</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Primera Ruta</p>
                    <p className="text-xs text-muted-foreground">Completaste tu primer sendero</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Organizador</p>
                    <p className="text-xs text-muted-foreground">Creaste tu primer evento</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Salón de las Leyendas */}
        <Link to="/legends" className="block group mt-6">
          <Card className="shadow-soft hover:shadow-md transition-shadow border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Salón de las Leyendas</h3>
                    <p className="text-xs text-muted-foreground">Quienes hicieron esto posible</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;

import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Settings, Award, MapPin, Calendar } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Card className="mb-6 shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=hiking" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-foreground">Juan Pérez</h2>
                <p className="text-muted-foreground text-sm mb-2">@juanperez</p>
                <Badge variant="secondary">
                  <Award className="w-3 h-3 mr-1" />
                  Explorador
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Amante de la naturaleza y el senderismo. Siempre buscando nuevas rutas por descubrir.
            </p>
            <Button className="w-full" variant="outline">
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-xs text-muted-foreground">Rutas</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-secondary">156</p>
              <p className="text-xs text-muted-foreground">km</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">8</p>
              <p className="text-xs text-muted-foreground">Eventos</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg text-foreground mb-4">Logros</h3>
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
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;

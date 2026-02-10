import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface MyCommunity {
  id: string;
  name: string;
  image: string;
  members: number;
  location: string;
  role: "admin" | "miembro";
  lastActivity: string;
}

const mockCommunities: MyCommunity[] = [
  {
    id: "1",
    name: "Senderistas del Guaviare",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop",
    members: 128,
    location: "San José del Guaviare",
    role: "admin",
    lastActivity: "Hace 2 horas",
  },
  {
    id: "2",
    name: "Aventureros de la Selva",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=200&fit=crop",
    members: 85,
    location: "Calamar",
    role: "miembro",
    lastActivity: "Hace 1 día",
  },
  {
    id: "3",
    name: "Ecoturismo Colombia",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&h=200&fit=crop",
    members: 342,
    location: "Nacional",
    role: "miembro",
    lastActivity: "Hace 3 días",
  },
  {
    id: "4",
    name: "Fotógrafos de Naturaleza",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200&h=200&fit=crop",
    members: 56,
    location: "Guaviare",
    role: "miembro",
    lastActivity: "Hace 1 semana",
  },
];

const MyCommunityDialog = ({ children }: { children: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Mis Comunidades
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="space-y-3 py-2 pr-1">
            {mockCommunities.map((community) => (
              <Link
                key={community.id}
                to={`/communities/${community.id}`}
                className="block"
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group">
                  <Avatar className="w-14 h-14 rounded-xl">
                    <AvatarImage src={community.image} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg">
                      {community.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-foreground truncate text-sm">
                        {community.name}
                      </h3>
                      {community.role === "admin" && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {community.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {community.members}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {community.lastActivity}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>

        <Link to="/communities" className="block">
          <div className="w-full py-2.5 text-center text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">
            Explorar más comunidades
          </div>
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default MyCommunityDialog;
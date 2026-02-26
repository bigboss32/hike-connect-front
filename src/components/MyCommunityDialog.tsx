import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyCommunities } from "@/hooks/useCommunities";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import communityImg from "@/assets/community.jpg";

const roleLabels: Record<string, string> = {
  owner: "Dueño",
  admin: "Admin",
  member: "Miembro",
};

const MyCommunityDialog = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useMyCommunities();

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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !data?.results.length ? (
            <p className="text-center text-muted-foreground py-8 text-sm">
              Aún no te has unido a ninguna comunidad
            </p>
          ) : (
            <div className="space-y-3 py-2 pr-1">
              {data.results.map((community) => (
                <Link
                  key={community.community_id}
                  to={`/communities/${community.community_id}`}
                  className="block"
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group">
                    <Avatar className="w-14 h-14 rounded-xl">
                      <AvatarImage src={community.image || communityImg} className="object-cover" />
                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg">
                        {community.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-foreground truncate text-sm">
                          {community.name}
                        </h3>
                        {community.role !== "member" && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                            {roleLabels[community.role] || community.role}
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
                          {community.member_count}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 mt-1">
                        Desde {formatDistanceToNow(new Date(community.joined_at), { locale: es, addSuffix: false })}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
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

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Hash, Plus, Settings, Lock } from "lucide-react";
import CreateChannelDialog from "@/components/CreateChannelDialog";
import communityImg from "@/assets/community.jpg";

// Mock data for layout
const mockCommunity = {
  id: "1",
  name: "Montañeros Madrid",
  description: "Comunidad de amantes del senderismo en la Sierra de Madrid. Salidas cada fin de semana a diferentes rutas.",
  image: communityImg,
  location: "Madrid, España",
  member_count: 1247,
  is_public: true,
  user_is_member: true,
};

const mockChannels = [
  { id: "1", name: "general", description: "Conversaciones generales", is_public: true, post_count: 156 },
  { id: "2", name: "rutas", description: "Comparte y descubre nuevas rutas", is_public: true, post_count: 89 },
  { id: "3", name: "eventos", description: "Organización de eventos y quedadas", is_public: true, post_count: 45 },
  { id: "4", name: "fotos", description: "Comparte fotos de tus aventuras", is_public: true, post_count: 234 },
  { id: "5", name: "admin", description: "Canal privado de administración", is_public: false, post_count: 12 },
];

const mockMembers = [
  { id: "1", name: "Carlos López", avatar: null, role: "admin" },
  { id: "2", name: "María García", avatar: null, role: "moderator" },
  { id: "3", name: "Pedro Martínez", avatar: null, role: "member" },
  { id: "4", name: "Ana Rodríguez", avatar: null, role: "member" },
  { id: "5", name: "Luis Fernández", avatar: null, role: "member" },
];

const CommunityDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("channels");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with cover image */}
      <div className="relative">
        <div className="h-40 overflow-hidden">
          <img
            src={mockCommunity.image}
            alt={mockCommunity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link to="/communities">
            <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="secondary" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Community info */}
      <div className="max-w-lg mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">{mockCommunity.name}</h1>
                <p className="text-sm text-muted-foreground">{mockCommunity.location}</p>
              </div>
              {!mockCommunity.is_public && (
                <div className="bg-muted rounded-full p-1.5">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{mockCommunity.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{mockCommunity.member_count} miembros</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>{mockChannels.length} canales</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="channels" className="flex-1">
              <Hash className="w-4 h-4 mr-1" />
              Canales
            </TabsTrigger>
            <TabsTrigger value="members" className="flex-1">
              <Users className="w-4 h-4 mr-1" />
              Miembros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-foreground">Canales</h2>
              <CreateChannelDialog />
            </div>
            <div className="space-y-2">
              {mockChannels.map((channel) => (
                <Link key={channel.id} to={`/communities/${id}/channels/${channel.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          {channel.is_public ? (
                            <Hash className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{channel.name}</h3>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{channel.post_count} posts</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <h2 className="font-semibold text-foreground mb-4">Miembros ({mockMembers.length})</h2>
            <div className="space-y-2">
              {mockMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-foreground">{member.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                    {member.role === "admin" && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Admin</span>
                    )}
                    {member.role === "moderator" && (
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Mod</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default CommunityDetail;

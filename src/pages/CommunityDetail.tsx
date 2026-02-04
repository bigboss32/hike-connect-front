import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users, Hash, Settings, Lock, Info } from "lucide-react";
import CreateChannelDialog from "@/components/CreateChannelDialog";
import { useCommunityById } from "@/hooks/useCommunities";
import { useChannels } from "@/hooks/useChannels";
import { useCommunityMembers } from "@/hooks/useCommunityMembers";
import communityImg from "@/assets/community.jpg";

const CommunityDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("channels");
  
  const { data: community, isLoading: communityLoading } = useCommunityById(id);
  const { data: channels, isLoading: channelsLoading } = useChannels(id);
  const { data: membersData, isLoading: membersLoading } = useCommunityMembers(id);

  if (communityLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="h-40 bg-muted animate-pulse" />
        <div className="max-w-lg mx-auto px-4 -mt-8">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with cover image */}
      <div className="relative">
        <div className="h-40 overflow-hidden">
          <img
            src={community?.image || communityImg}
            alt={community?.name}
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
                <h1 className="text-xl font-bold text-foreground">{community?.name}</h1>
                <p className="text-sm text-muted-foreground">{community?.location}</p>
              </div>
              {!community?.is_public && (
                <div className="bg-muted rounded-full p-1.5">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{community?.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{community?.member_count} miembros</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Hash className="w-4 h-4" />
                <span>{channels?.length || 0} canales</span>
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
            {channelsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : channels && channels.length > 0 ? (
              <div className="space-y-2">
                {channels.map((channel) => (
                  <Link key={channel.id} to={`/communities/${id}/channels/${channel.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            {channel.is_info ? (
                              <Info className="w-5 h-5 text-muted-foreground" />
                            ) : channel.is_read_only ? (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <Hash className="w-5 h-5 text-primary" />
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
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay canales en esta comunidad</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <h2 className="font-semibold text-foreground mb-4">
              Miembros ({membersData?.count || 0})
            </h2>
            {membersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : membersData && membersData.results.length > 0 ? (
              <div className="space-y-2">
                {membersData.results.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.user_image || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.user_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-foreground">{member.user_name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.role === "owner" && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Owner</span>
                      )}
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
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No hay miembros en esta comunidad</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Navigation />
    </div>
  );
};

export default CommunityDetail;

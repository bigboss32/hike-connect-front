import { useState, useRef, useEffect } from "react";
import ScrollHeader from "@/components/ScrollHeader";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Hash, Send, MoreVertical, Image, Wifi, WifiOff } from "lucide-react";
import { usePosts, useCreatePost } from "@/hooks/usePosts";
import { useChannels } from "@/hooks/useChannels";
import { useChannelWebSocket } from "@/hooks/useChannelWebSocket";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const ChannelDetail = () => {
  const { communityId, channelId } = useParams();
  const [newPost, setNewPost] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: channels } = useChannels(communityId);
  const { data: postsData, isLoading: postsLoading } = usePosts({ canalId: channelId });
  const createPost = useCreatePost();
  
  const { isConnected, canWrite, typingUsers, sendTyping } = useChannelWebSocket({
    channelId,
    enabled: !!channelId,
  });
  
  const currentChannel = channels?.find(c => c.id === channelId);

  // Auto-scroll to bottom when new posts arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [postsData?.results?.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost(e.target.value);
    if (e.target.value.trim()) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }
  };

  const handleSubmitPost = () => {
    if (newPost.trim() && communityId && channelId) {
      createPost.mutate({
        comunidad_id: communityId,
        canal_id: channelId,
        content: newPost.trim(),
      });
      setNewPost("");
      sendTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitPost();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-44">
      {/* Header */}
      <ScrollHeader className="bg-card border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/communities/${communityId}`}>
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Hash className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-foreground truncate">{currentChannel?.name || "Canal"}</h1>
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-primary shrink-0" />
                ) : (
                  <WifiOff className="w-3 h-3 text-destructive shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {typingUsers.length > 0
                  ? typingUsers.length === 1
                    ? `${typingUsers[0]} está escribiendo...`
                    : `${typingUsers.join(", ")} están escribiendo...`
                  : currentChannel?.description}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </ScrollHeader>

      {/* Posts */}
      <main className="max-w-lg mx-auto px-4 py-4">
        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : postsData?.results && postsData.results.length > 0 ? (
          <div className="space-y-4">
            {postsData.results.map((post) => (
              <Card key={post.id} className="shadow-soft">
                <CardContent className="p-4">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author_image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {post.author_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground text-sm">{post.author_name}</h3>
                      <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <p className="text-foreground text-sm">{post.content}</p>
                </CardContent>
              </Card>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No hay mensajes aún</p>
              <p className="text-sm text-muted-foreground mt-1">¡Sé el primero en publicar!</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Create post input */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 bg-card border-t border-border p-3 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder={canWrite ? "Escribe un mensaje..." : "Solo lectura"}
            value={newPost}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={!canWrite}
          />
          <Button 
            size="icon" 
            onClick={handleSubmitPost}
            disabled={!newPost.trim() || createPost.isPending || !canWrite}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default ChannelDetail;

import { useState, useRef, useEffect } from "react";
import ScrollHeader from "@/components/ScrollHeader";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Hash, Send, MoreVertical, Image, Wifi, WifiOff } from "lucide-react";
import { usePosts, useCreatePost } from "@/hooks/usePosts";
import { useChannels } from "@/hooks/useChannels";
import { useChannelWebSocket } from "@/hooks/useChannelWebSocket";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const ChannelDetail = () => {
  const { communityId, channelId } = useParams();
  const [newPost, setNewPost] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { data: channels } = useChannels(communityId);
  const { data: postsData, isLoading: postsLoading } = usePosts({ canalId: channelId });
  const createPost = useCreatePost();
  
  const { isConnected, canWrite, typingUsers, sendTyping } = useChannelWebSocket({
    channelId,
    enabled: !!channelId,
  });
  
  const currentChannel = channels?.find(c => c.id === channelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [postsData?.results?.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost(e.target.value);
    sendTyping(!!e.target.value.trim());
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

  const isOwnMessage = (authorName: string) => {
    if (!user) return false;
    return user.name === authorName || 
           `${user.first_name} ${user.last_name}`.trim() === authorName;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      {/* Messages area - flex-1 to fill space between header and input */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-lg mx-auto px-4 py-4">
          {postsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-12 w-48 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : postsData?.results && postsData.results.length > 0 ? (
            <div className="space-y-3">
              {postsData.results.map((post) => {
                const own = isOwnMessage(post.author_name);
                return (
                  <div
                    key={post.id}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      own ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {/* Avatar - only for others */}
                    {!own && (
                      <Avatar className="w-8 h-8 shrink-0 mt-1">
                        <AvatarImage src={post.author_image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {post.author_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("min-w-0", own ? "items-end" : "items-start")}>
                      {/* Name + time */}
                      <div className={cn(
                        "flex items-center gap-2 mb-0.5 px-1",
                        own ? "justify-end" : "justify-start"
                      )}>
                        {!own && (
                          <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                            {post.author_name}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      {/* Bubble */}
                      <div
                        className={cn(
                          "px-3 py-2 rounded-2xl text-sm leading-relaxed break-words",
                          own
                            ? "bg-primary text-primary-foreground rounded-tr-md"
                            : "bg-muted text-foreground rounded-tl-md"
                        )}
                      >
                        {post.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Hash className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No hay mensajes aún</p>
              <p className="text-sm text-muted-foreground mt-1">¡Sé el primero en publicar!</p>
            </div>
          )}
        </div>
      </main>

      {/* Input bar */}
      <div className="fixed bottom-[4rem] left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-3 py-2.5 z-40">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9">
            <Image className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder={canWrite ? "Escribe un mensaje..." : "Solo lectura"}
            value={newPost}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-full bg-muted border-0 h-9 text-sm"
            disabled={!canWrite}
          />
          <Button 
            size="icon" 
            className="shrink-0 h-9 w-9 rounded-full"
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

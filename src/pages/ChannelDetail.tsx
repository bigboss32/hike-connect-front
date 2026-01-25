import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Hash, Heart, MessageCircle, Send, MoreVertical, Image } from "lucide-react";

// Mock data for layout
const mockChannel = {
  id: "1",
  name: "general",
  description: "Conversaciones generales",
  community_name: "Montañeros Madrid",
};

const mockPosts = [
  {
    id: "1",
    author: { name: "Carlos López", avatar: null },
    content: "¡Buenos días a todos! ¿Alguien se apunta a la ruta del domingo? Estamos pensando en ir a La Pedriza.",
    image: null,
    likes: 12,
    comments: 5,
    created_at: "Hace 2 horas",
    user_liked: false,
  },
  {
    id: "2",
    author: { name: "María García", avatar: null },
    content: "Acabo de volver de la Ruta del Agua en Cercedilla. ¡Espectacular! Os dejo unas fotos 📸",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
    likes: 34,
    comments: 8,
    created_at: "Hace 5 horas",
    user_liked: true,
  },
  {
    id: "3",
    author: { name: "Pedro Martínez", avatar: null },
    content: "¿Conocéis alguna ruta fácil para principiantes cerca de Navacerrada? Es para llevar a mi familia.",
    image: null,
    likes: 6,
    comments: 12,
    created_at: "Ayer",
    user_liked: false,
  },
  {
    id: "4",
    author: { name: "Ana Rodríguez", avatar: null },
    content: "Recordad llevar agua suficiente este fin de semana, se esperan temperaturas altas. ¡Cuidaos! 💧",
    image: null,
    likes: 28,
    comments: 3,
    created_at: "Hace 2 días",
    user_liked: true,
  },
];

const ChannelDetail = () => {
  const { communityId, channelId } = useParams();
  const [newPost, setNewPost] = useState("");

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      // Mock: would call API here
      setNewPost("");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
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
              <h1 className="font-bold text-foreground truncate">{mockChannel.name}</h1>
              <p className="text-xs text-muted-foreground truncate">{mockChannel.community_name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Posts */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id} className="shadow-soft">
              <CardContent className="p-4">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{post.author.name}</h3>
                    <p className="text-xs text-muted-foreground">{post.created_at}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <p className="text-foreground text-sm mb-3">{post.content}</p>

                {/* Image */}
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img src={post.image} alt="Post" className="w-full h-48 object-cover" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <button className={`flex items-center gap-1.5 text-sm ${post.user_liked ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500 transition-colors`}>
                    <Heart className={`w-4 h-4 ${post.user_liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Create post input */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4 safe-bottom">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder="Escribe un mensaje..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSubmitPost}
            disabled={!newPost.trim()}
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

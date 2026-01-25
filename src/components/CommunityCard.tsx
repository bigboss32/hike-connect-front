import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Check, MapPin, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import communityImg from "@/assets/community.jpg";

interface CommunityCardProps {
  id: string;
  name: string;
  member_count: number;
  description: string;
  image: string | null;
  location: string;
  is_public: boolean;
  user_is_member: boolean;
}

const CommunityCard = ({ 
  name, 
  member_count, 
  description, 
  image, 
  location,
  is_public,
  user_is_member 
}: CommunityCardProps) => {
  const [joined, setJoined] = useState(user_is_member);
  const [currentMembers, setCurrentMembers] = useState(member_count);

  const handleJoin = () => {
    if (joined) {
      setJoined(false);
      setCurrentMembers(prev => prev - 1);
      toast({
        title: "Has salido de la comunidad",
        description: `Ya no eres miembro de "${name}"`,
      });
    } else {
      setJoined(true);
      setCurrentMembers(prev => prev + 1);
      toast({
        title: "¡Te has unido!",
        description: `Ahora eres miembro de "${name}"`,
      });
    }
  };

  return (
    <Card className="overflow-hidden shadow-soft">
      <div className="relative h-32">
        <img
          src={image || communityImg}
          alt={name}
          className="w-full h-full object-cover"
        />
        {!is_public && (
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-1">{name}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{currentMembers} miembros</span>
          </div>
          <Button 
            variant={joined ? "secondary" : "outline"} 
            size="sm"
            onClick={handleJoin}
          >
            {joined ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                Miembro
              </>
            ) : (
              "Unirse"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;

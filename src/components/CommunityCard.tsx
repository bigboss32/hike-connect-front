import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommunityCardProps {
  name: string;
  members: number;
  description: string;
  image: string;
}

const CommunityCard = ({ name, members, description, image }: CommunityCardProps) => {
  const [joined, setJoined] = useState(false);
  const [currentMembers, setCurrentMembers] = useState(members);

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
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-foreground mb-2">{name}</h3>
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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface CommunityCardProps {
  name: string;
  members: number;
  description: string;
  image: string;
}

const CommunityCard = ({ name, members, description, image }: CommunityCardProps) => {
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
            <span>{members} miembros</span>
          </div>
          <Button variant="outline" size="sm">
            Unirse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityCard;

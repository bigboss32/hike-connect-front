import { useState } from "react";
import { Star } from "lucide-react";
import WalkingLoader from "@/components/WalkingLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RouteRating, useRateRoute } from "@/hooks/useRoutes";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: RouteRating | undefined;
  routeId: string;
  routeTitle: string;
  isLoading?: boolean;
}

const RatingModal = ({ open, onOpenChange, rating, routeId, routeTitle, isLoading }: RatingModalProps) => {
  const avgRating = rating?.rating_avg ?? 0;
  const userScore = rating?.score ?? 0;
  const ratingCount = rating?.rating_count ?? 0;
  
  const [hoverScore, setHoverScore] = useState(0);
  const [selectedScore, setSelectedScore] = useState(userScore);
  
  const { mutate: rateRoute, isPending } = useRateRoute();

  // Reset selected score when modal opens with existing rating
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setSelectedScore(userScore);
    }
    onOpenChange(newOpen);
  };

  const handleRate = () => {
    if (selectedScore > 0) {
      rateRoute({ routeId, score: selectedScore });
    }
  };

  const displayScore = hoverScore || selectedScore;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Calificar ruta</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Promedio general */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Promedio general</p>
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                {ratingCount} {ratingCount === 1 ? "calificación" : "calificaciones"}
              </p>
            </div>

            {/* Tu calificación interactiva */}
            <div className="border-t pt-6 text-center space-y-4">
              <p className="text-sm font-medium">
                {userScore > 0 ? "Actualiza tu calificación" : "¿Qué te pareció esta ruta?"}
              </p>
              <div 
                className="flex justify-center items-center gap-2"
                onMouseLeave={() => setHoverScore(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    onMouseEnter={() => setHoverScore(star)}
                    onClick={() => setSelectedScore(star)}
                    disabled={isPending}
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= displayScore
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedScore > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedScore === 1 && "Muy mala"}
                  {selectedScore === 2 && "Mala"}
                  {selectedScore === 3 && "Regular"}
                  {selectedScore === 4 && "Buena"}
                  {selectedScore === 5 && "Excelente"}
                </p>
              )}
              <Button 
                onClick={handleRate} 
                disabled={selectedScore === 0 || isPending}
                className="w-full"
              >
                {isPending ? (
                  <>
                    <WalkingLoader />
                    <span>Calificando...</span>
                  </>
                ) : (
                  userScore > 0 ? "Actualizar calificación" : "Calificar"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;

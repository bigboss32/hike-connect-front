import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RouteRating } from "@/hooks/useRoutes";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rating: RouteRating | undefined;
  routeTitle: string;
  isLoading?: boolean;
}

const RatingModal = ({ open, onOpenChange, rating, routeTitle, isLoading }: RatingModalProps) => {
  const avgRating = rating?.rating_avg ?? 0;
  const userScore = rating?.score ?? 0;
  const ratingCount = rating?.rating_count ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Calificación</DialogTitle>
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
                    className={`w-8 h-8 ${
                      star <= Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                {ratingCount} {ratingCount === 1 ? "calificación" : "calificaciones"}
              </p>
            </div>

            {/* Tu calificación */}
            <div className="border-t pt-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Tu calificación</p>
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= userScore
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {userScore === 0 && (
                <p className="text-xs text-muted-foreground">
                  Aún no has calificado esta ruta
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;

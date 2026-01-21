import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, TrendingUp, Phone, Mail, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouteById, useRouteRating } from "@/hooks/useRoutes";
import RouteMap from "@/components/RouteMap";
import { Skeleton } from "@/components/ui/skeleton";

const RouteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: route, isLoading, error } = useRouteById(id);
  const { data: rating } = useRouteRating(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <Skeleton className="h-56 w-full" />
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ruta no encontrada</h1>
          <Button onClick={() => navigate('/routes')}>Volver a rutas</Button>
        </div>
      </div>
    );
  }

  const difficultyColor = {
    Fácil: "bg-primary text-primary-foreground",
    Medio: "bg-secondary text-secondary-foreground",
    Difícil: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header Image */}
      <div className="relative h-56">
        <img
          src={route.image}
          alt={route.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2 mb-2">
            <Badge className={difficultyColor[route.difficulty]}>
              {route.difficulty}
            </Badge>
            {route.category === "agroturismo" && (
              <Badge variant="outline" className="border-white text-white">
                Finca
              </Badge>
            )}
            {route.type === "privada" && (
              <Badge variant="secondary">Premium</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">{route.title}</h1>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Info básica */}
        <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{route.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span>{route.distance}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{route.duration}</span>
          </div>
          {rating && rating.rating_avg !== null && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{rating.rating_avg.toFixed(1)}</span>
              <span className="text-sm">({rating.rating_count})</span>
            </div>
          )}
        </div>

        {/* Tu calificación */}
        {rating && rating.score !== null && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Tu calificación:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= rating.score! 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {route.company && (
          <p className="text-sm text-muted-foreground">
            Ofrecido por <span className="font-medium text-foreground">{route.company}</span>
          </p>
        )}

        {/* Descripción */}
        <section>
          <h2 className="text-lg font-bold mb-3">Descripción</h2>
          <p className="text-muted-foreground leading-relaxed">
            {route.description}
          </p>
        </section>

        {/* Mapa */}
        <section>
          <h2 className="text-lg font-bold mb-3">Ubicación</h2>
          <RouteMap coordinates={route.coordinates} title={route.title} />
        </section>

        {/* Contacto */}
        {(route.phone || route.email || route.whatsapp) && (
          <section>
            <h2 className="text-lg font-bold mb-3">Contactar</h2>
            <Card>
              <CardContent className="p-4 space-y-3">
                {route.phone && (
                  <a
                    href={`tel:${route.phone}`}
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{route.phone}</span>
                  </a>
                )}
                {route.email && (
                  <a
                    href={`mailto:${route.email}`}
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{route.email}</span>
                  </a>
                )}
                {route.whatsapp && (
                  <a
                    href={`https://wa.me/${route.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Botón de acción */}
        {(route.type === "privada" || route.type === "agroturismo") && route.whatsapp && (
          <Button 
            className="w-full" 
            size="lg"
            asChild
          >
            <a
              href={`https://wa.me/${route.whatsapp}?text=Hola, me interesa la ruta "${route.title}"`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Reservar por WhatsApp
            </a>
          </Button>
        )}
      </main>
    </div>
  );
};

export default RouteDetail;

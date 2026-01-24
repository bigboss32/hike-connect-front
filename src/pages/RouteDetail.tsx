import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, TrendingUp, Phone, Mail, MessageCircle, Star, Info, Image, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouteById, useRouteRating } from "@/hooks/useRoutes";
import RouteMap from "@/components/RouteMap";
import { Skeleton } from "@/components/ui/skeleton";
import RatingModal from "@/components/RatingModal";
import Navigation from "@/components/Navigation";

const RouteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  
  const { data: route, isLoading, error } = useRouteById(id);
  const { data: rating, isLoading: isRatingLoading } = useRouteRating(id);

  // Mock data for photos and comments
  const mockPhotos = [
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop",
  ];

  const mockComments = [
    {
      id: 1,
      user: "María García",
      avatar: "",
      date: "Hace 2 días",
      comment: "¡Increíble ruta! Las vistas son espectaculares, especialmente al amanecer. Muy recomendada para quienes buscan un desafío moderado.",
      rating: 5,
    },
    {
      id: 2,
      user: "Carlos López",
      avatar: "",
      date: "Hace 1 semana",
      comment: "Buena señalización en todo el camino. Llevad suficiente agua porque no hay fuentes en el recorrido.",
      rating: 4,
    },
    {
      id: 3,
      user: "Ana Martínez",
      avatar: "",
      date: "Hace 2 semanas",
      comment: "Perfecta para ir en familia. Los niños disfrutaron mucho del paisaje y los animales que vimos en el camino.",
      rating: 5,
    },
  ];

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
    <div className="min-h-screen bg-background pb-20">
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
        </div>

        {/* Botón de calificación prominente */}
        <button 
          onClick={() => setRatingModalOpen(true)}
          className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors w-full"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(rating?.rating_avg ?? 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <div className="flex-1 text-left">
            <span className="font-semibold text-foreground">{(rating?.rating_avg ?? 0).toFixed(1)}</span>
            <span className="text-sm text-muted-foreground ml-2">
              ({rating?.rating_count ?? 0} {(rating?.rating_count ?? 0) === 1 ? "calificación" : "calificaciones"})
            </span>
          </div>
          <span className="text-sm text-primary font-medium">
            {(rating?.score ?? 0) > 0 ? "Cambiar" : "Calificar"}
          </span>
        </button>

        {/* Tu calificación - solo mostrar si hay score */}
        {rating && rating.score !== null && rating.score > 0 && (
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

        {/* Tabs de más información */}
        <Tabs defaultValue="detalles" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="detalles" className="flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Detalles</span>
            </TabsTrigger>
            <TabsTrigger value="fotos" className="flex items-center gap-1.5">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Fotos</span>
            </TabsTrigger>
            <TabsTrigger value="comentarios" className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Comentarios</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Detalles */}
          <TabsContent value="detalles" className="mt-4 space-y-6">
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
          </TabsContent>

          {/* Tab Fotos */}
          <TabsContent value="fotos" className="mt-4">
            <div className="grid grid-cols-3 gap-2">
              {mockPhotos.map((photo, index) => (
                <div 
                  key={index} 
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              6 fotos de la comunidad
            </p>
          </TabsContent>

          {/* Tab Comentarios */}
          <TabsContent value="comentarios" className="mt-4 space-y-4">
            {mockComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {comment.user.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-foreground">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= comment.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Escribir comentario
            </Button>
          </TabsContent>
        </Tabs>
      </main>

      {/* Rating Modal */}
      <RatingModal
        open={ratingModalOpen}
        onOpenChange={setRatingModalOpen}
        rating={rating}
        routeId={id!}
        routeTitle={route.title}
        isLoading={isRatingLoading}
      />

      <Navigation />
    </div>
  );
};

export default RouteDetail;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Clock, Mountain, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBannerRoutes, BannerRoute } from "@/hooks/useRoutes";

const FeaturedRoutesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const { data: bannerRoutes, isLoading, error } = useBannerRoutes();

  useEffect(() => {
    if (!isAutoPlaying || !bannerRoutes?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerRoutes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerRoutes?.length]);

  const goToPrevious = () => {
    if (!bannerRoutes?.length) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + bannerRoutes.length) % bannerRoutes.length);
  };

  const goToNext = () => {
    if (!bannerRoutes?.length) return;
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % bannerRoutes.length);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-500/90";
      case "Medio": return "bg-yellow-500/90";
      case "Difícil": return "bg-red-500/90";
      default: return "bg-primary/90";
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl shadow-elevated">
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (error || !bannerRoutes?.length) {
    return null;
  }

  const currentRoute = bannerRoutes[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-elevated">
      {/* Main Carousel */}
      <div className="relative h-56">
        {bannerRoutes.map((route: BannerRoute, index: number) => (
          <Link
            key={route.id}
            to={`/routes/${route.id}`}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              index === currentIndex 
                ? "opacity-100 scale-100 z-10" 
                : "opacity-0 scale-95 z-0"
            }`}
          >
            <img
              src={route.image}
              alt={route.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Content */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 delay-100 ${
              index === currentIndex ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getDifficultyColor(route.difficulty)} text-white text-xs`}>
                  {route.difficulty}
                </Badge>
                <Badge variant="outline" className="border-white/50 text-white text-xs">
                  {route.category}
                </Badge>
                {route.rating_avg !== null && (
                  <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-white text-xs font-medium">
                      {route.rating_avg.toFixed(1)}
                    </span>
                    <span className="text-white/70 text-xs">
                      ({route.rating_count})
                    </span>
                  </div>
                )}
              </div>
              
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">
                {route.title}
              </h3>
              
              <div className="flex items-center gap-3 text-white/80 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {route.location}
                </span>
                <span className="flex items-center gap-1">
                  <Mountain className="w-3 h-3" />
                  {route.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {route.duration}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {bannerRoutes.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8"
            onClick={(e) => { e.preventDefault(); goToPrevious(); }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8"
            onClick={(e) => { e.preventDefault(); goToNext(); }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {bannerRoutes.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {bannerRoutes.map((_: BannerRoute, index: number) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedRoutesCarousel;

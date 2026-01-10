import { useState } from "react";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { allRoutes } from "@/data/routes";
import { Link } from "react-router-dom";

const NearbyRoutesMap = () => {
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem("mapbox_token") || "");
  const [showTokenInput, setShowTokenInput] = useState(!localStorage.getItem("mapbox_token"));
  
  const handleSaveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem("mapbox_token", mapboxToken);
      setShowTokenInput(false);
      // Force reload to apply token
      window.location.reload();
    }
  };

  // Show nearby routes preview (without full map if no token)
  const nearbyRoutes = allRoutes.slice(0, 4);

  if (showTokenInput) {
    return (
      <div className="bg-card rounded-xl p-4 shadow-elevated">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Rutas Cercanas</h3>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>Para ver el mapa interactivo, ingresa tu token de Mapbox. Puedes obtenerlo gratis en <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></p>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="text-sm"
            />
            <Button size="sm" onClick={handleSaveToken}>
              Guardar
            </Button>
          </div>
        </div>

        {/* Fallback: List of nearby routes */}
        <div className="space-y-2">
          {nearbyRoutes.map((route) => (
            <Link
              key={route.id}
              to={`/routes/${route.id}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <img src={route.image} alt={route.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{route.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {route.location}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{route.distance}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Full map component when token is available
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-elevated">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Rutas Cercanas</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={() => {
            localStorage.removeItem("mapbox_token");
            setShowTokenInput(true);
          }}
        >
          Cambiar token
        </Button>
      </div>
      
      {/* Map placeholder - would be replaced with actual Mapbox map */}
      <div className="relative h-48 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-8 h-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
        
        {/* Route markers preview */}
        <div className="absolute inset-0 pointer-events-none">
          {nearbyRoutes.map((route, index) => (
            <div
              key={route.id}
              className="absolute w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-fade-in"
              style={{
                top: `${20 + index * 15}%`,
                left: `${15 + index * 20}%`,
                animationDelay: `${index * 150}ms`
              }}
            >
              <MapPin className="w-3 h-3 text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* Routes list */}
      <div className="p-3 space-y-2 max-h-40 overflow-y-auto">
        {nearbyRoutes.map((route) => (
          <Link
            key={route.id}
            to={`/routes/${route.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{route.title}</p>
              <p className="text-xs text-muted-foreground">{route.distance} • {route.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NearbyRoutesMap;

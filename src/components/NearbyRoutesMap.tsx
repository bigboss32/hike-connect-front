import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import { MAPBOX_TOKEN } from "@/lib/mapbox";
import { useRoutes } from "@/hooks/useRoutes";

const NearbyRoutesMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const { data, isLoading } = useRoutes("todos", "todas", "");
  const nearbyRoutes = data?.pages[0]?.results.slice(0, 4) || [];

  useEffect(() => {
    if (!mapContainer.current || nearbyRoutes.length === 0) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 8,
      center: [nearbyRoutes[0].coordinates.lng, nearbyRoutes[0].coordinates.lat],
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add markers for each route
    nearbyRoutes.forEach((route) => {
      new mapboxgl.Marker({ color: '#16a34a' })
        .setLngLat([route.coordinates.lng, route.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h3 class="font-bold">${route.title}</h3>
            <p class="text-sm">${route.location}</p>
          `)
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [nearbyRoutes]);

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-elevated">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Rutas Cercanas</h3>
        </div>
      </div>
      
      {/* Interactive Map */}
      <div className="relative h-48">
        <div ref={mapContainer} className="absolute inset-0" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        )}
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

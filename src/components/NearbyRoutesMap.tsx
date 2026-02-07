import { useEffect, useRef } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Link } from "react-router-dom";
import { MAPBOX_TOKEN } from "@/lib/mapbox";
import { useRoutes } from "@/hooks/useRoutes";
import useGeolocation from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";

const NearbyRoutesMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  const { latitude, longitude, loading: geoLoading, error: geoError, refresh: refreshGeo } = useGeolocation({ watch: true });
  const { data, isLoading } = useRoutes("todos", "todas", "");
  const nearbyRoutes = data?.pages[0]?.results.slice(0, 4) || [];

  useEffect(() => {
    if (!mapContainer.current || nearbyRoutes.length === 0) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Center on user position if available, otherwise first route
    const center: [number, number] = latitude && longitude
      ? [longitude, latitude]
      : [nearbyRoutes[0].coordinates.lng, nearbyRoutes[0].coordinates.lat];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: latitude ? 11 : 8,
      center,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // User location marker (blue pulsing dot)
    if (latitude && longitude) {
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 2px 8px rgba(0,0,0,0.2);"></div>
      `;
      userMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold text-sm">📍 Tu ubicación</p>'))
        .addTo(map.current);
    }

    // Route markers
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
  }, [nearbyRoutes, latitude, longitude]);

  // Update user marker position in real time
  useEffect(() => {
    if (userMarker.current && latitude && longitude) {
      userMarker.current.setLngLat([longitude, latitude]);
    }
  }, [latitude, longitude]);

  const centerOnUser = () => {
    if (map.current && latitude && longitude) {
      map.current.flyTo({ center: [longitude, latitude], zoom: 13, duration: 1000 });
    } else {
      refreshGeo();
    }
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-elevated">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Rutas Cercanas</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={centerOnUser} className="gap-1.5 text-xs">
          {geoLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          Mi ubicación
        </Button>
      </div>

      {/* GPS status */}
      {geoError && (
        <div className="px-4 py-2 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5" />
          {geoError}
        </div>
      )}

      {/* Interactive Map */}
      <div className="relative h-48">
        <div ref={mapContainer} className="absolute inset-0" />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        )}
      </div>

      {/* Location info */}
      {latitude && longitude && (
        <div className="px-4 py-2 border-b border-border bg-muted/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
            GPS activo — {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
        </div>
      )}

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

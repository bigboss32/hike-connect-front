import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface RouteMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
}

const RouteMap = ({ coordinates, title }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => 
    localStorage.getItem('mapbox_token') || ''
  );
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);
  const [tempToken, setTempToken] = useState('');

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      zoom: 12,
      center: [coordinates.lng, coordinates.lat],
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    new mapboxgl.Marker({ color: '#16a34a' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3 class="font-bold">${title}</h3>`))
      .addTo(map.current);
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, coordinates]);

  const handleSaveToken = () => {
    if (tempToken) {
      localStorage.setItem('mapbox_token', tempToken);
      setMapboxToken(tempToken);
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="w-full h-64 bg-muted rounded-xl flex flex-col items-center justify-center p-6 gap-4">
        <MapPin className="w-12 h-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">
          Para ver el mapa, ingresa tu token público de Mapbox.
          <br />
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Obtener token en mapbox.com
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-sm">
          <Input
            placeholder="pk.eyJ1..."
            value={tempToken}
            onChange={(e) => setTempToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSaveToken} size="sm">
            Guardar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default RouteMap;

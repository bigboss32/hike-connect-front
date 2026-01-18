import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '@/lib/mapbox';

interface RouteMapProps {
  coordinates: { lat: number; lng: number };
  title: string;
}

const RouteMap = ({ coordinates, title }: RouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
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

    return () => {
      map.current?.remove();
    };
  }, [coordinates, title]);

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default RouteMap;

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 60000,
    watch = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  });

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      loading: false,
      error: null,
    });
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    let message = "Error desconocido al obtener ubicación";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Permiso de ubicación denegado";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Ubicación no disponible";
        break;
      case error.TIMEOUT:
        message = "Tiempo de espera agotado";
        break;
    }
    setState((prev) => ({ ...prev, loading: false, error: message }));
  }, []);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocalización no soportada en este dispositivo",
      }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }, [enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocalización no soportada en este dispositivo",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });

    if (watch) {
      const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy,
        timeout,
        maximumAge,
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, onSuccess, onError]);

  return { ...state, refresh };
};

export default useGeolocation;

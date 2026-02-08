import { useState, useEffect, useCallback } from "react";
import { Geolocation } from "@capacitor/geolocation";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  watch?: boolean;
}

const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    watch = false,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  });

  const requestAndGetLocation = useCallback(async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      // 🔥 pedir permisos
      const perm = await Geolocation.requestPermissions();

      if (perm.location !== "granted") {
        setState((s) => ({
          ...s,
          loading: false,
          error: "Permiso de ubicación denegado",
        }));
        return;
      }

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy,
      });

      setState({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        loading: false,
        error: null,
      });

    } catch (err: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message || "Error obteniendo ubicación",
      }));
    }
  }, [enableHighAccuracy]);

  useEffect(() => {
    let watchId: string | null = null;

    const init = async () => {
      await requestAndGetLocation();

      if (watch) {
        watchId = await Geolocation.watchPosition(
          { enableHighAccuracy },
          (position, err) => {
            if (position) {
              setState((s) => ({
                ...s,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              }));
            }

            if (err) {
              setState((s) => ({
                ...s,
                error: err.message,
              }));
            }
          }
        );
      }
    };

    init();

    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watch, enableHighAccuracy, requestAndGetLocation]);

  return {
    ...state,
    refresh: requestAndGetLocation,
  };
};

export default useGeolocation;

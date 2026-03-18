import { useEffect, useState, useCallback } from "react";

interface GeoPosition {
  lat: number;
  lng: number;
}

interface UseGeolocationResult {
  position: GeoPosition | null;
  positions: GeoPosition[];
  error: string | null;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
}

const DEFAULT_POSITION: GeoPosition = { lat: 40.7128, lng: -74.006 }; // NYC fallback

export const useGeolocation = (track = false): UseGeolocationResult => {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [positions, setPositions] = useState<GeoPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Get initial position
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setPosition(DEFAULT_POSITION);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(p);
        setError(null);
      },
      () => {
        setError("Location access denied");
        setPosition(DEFAULT_POSITION);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsTracking(true);
    setPositions([]);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(p);
        setPositions((prev) => [...prev, p]);
        setError(null);
      },
      () => setError("Tracking error"),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
    setWatchId(id);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  }, [watchId]);

  useEffect(() => {
    if (track) startTracking();
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [track]);

  return { position, positions, error, isTracking, startTracking, stopTracking };
};

export { DEFAULT_POSITION };
export type { GeoPosition };

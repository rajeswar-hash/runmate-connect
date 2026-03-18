import { useEffect, useRef, memo } from "react";
import L from "leaflet";
import type { GeoPosition } from "@/hooks/useGeolocation";

const DARK_TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const VOLT = "#DFFF00";
const BLUE = "#0066FF";

interface RunMapProps {
  center: GeoPosition;
  zoom?: number;
  routePositions?: GeoPosition[];
  markers?: Array<{
    id: string | number;
    position: GeoPosition;
    color?: string;
    pulse?: boolean;
    onClick?: () => void;
  }>;
  showUserMarker?: boolean;
  className?: string;
  followUser?: boolean;
}

const RunMap = memo(({
  center,
  zoom = 15,
  routePositions = [],
  markers = [],
  showUserMarker = true,
  className = "",
  followUser = false,
}: RunMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const pulseRef = useRef<L.CircleMarker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const otherMarkersRef = useRef<L.CircleMarker[]>([]);

  // Init map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(DARK_TILE, { maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
      pulseRef.current = null;
      polylineRef.current = null;
      otherMarkersRef.current = [];
    };
  }, []);

  // Follow user
  useEffect(() => {
    if (!mapRef.current || !followUser) return;
    mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom(), { animate: true });
  }, [center.lat, center.lng, followUser]);

  // User marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !showUserMarker) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([center.lat, center.lng]);
      pulseRef.current?.setLatLng([center.lat, center.lng]);
    } else {
      userMarkerRef.current = L.circleMarker([center.lat, center.lng], {
        radius: 8, fillColor: BLUE, fillOpacity: 1, color: "#fff", weight: 3,
      }).addTo(map);
      pulseRef.current = L.circleMarker([center.lat, center.lng], {
        radius: 20, fillColor: BLUE, fillOpacity: 0.15, color: BLUE, weight: 1, opacity: 0.3,
      }).addTo(map);
    }
  }, [center.lat, center.lng, showUserMarker]);

  // Route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    if (routePositions.length > 1) {
      polylineRef.current = L.polyline(
        routePositions.map((p): L.LatLngTuple => [p.lat, p.lng]),
        { color: VOLT, weight: 4, opacity: 0.9, smoothFactor: 1 }
      ).addTo(map);
    }
  }, [routePositions]);

  // Other markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    otherMarkersRef.current.forEach((m) => map.removeLayer(m));
    otherMarkersRef.current = [];

    markers.forEach((m) => {
      const marker = L.circleMarker([m.position.lat, m.position.lng], {
        radius: 6, fillColor: m.color || VOLT, fillOpacity: 1,
        color: m.color || VOLT, weight: 2, opacity: 0.5,
      }).addTo(map);
      if (m.onClick) marker.on("click", m.onClick);
      otherMarkersRef.current.push(marker);

      if (m.pulse) {
        const p = L.circleMarker([m.position.lat, m.position.lng], {
          radius: 14, fillColor: m.color || VOLT, fillOpacity: 0.1,
          color: m.color || VOLT, weight: 1, opacity: 0.2,
        }).addTo(map);
        otherMarkersRef.current.push(p);
      }
    });
  }, [markers]);

  return <div ref={containerRef} className={`w-full h-full ${className}`} style={{ minHeight: 200 }} />;
});

RunMap.displayName = "RunMap";

export default RunMap;

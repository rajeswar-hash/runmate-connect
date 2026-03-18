import { useEffect, useRef, memo, useState } from "react";
import L from "leaflet";
import type { GeoPosition } from "@/hooks/useGeolocation";
import { Layers } from "lucide-react";

const DARK_TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const SATELLITE_TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const VOLT = "#DFFF00";
const BLUE = "#0066FF";

type MapMode = "dark" | "satellite";

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
  showModeToggle?: boolean;
}

const RunMap = memo(({
  center,
  zoom = 15,
  routePositions = [],
  markers = [],
  showUserMarker = true,
  className = "",
  followUser = false,
  showModeToggle = true,
}: RunMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const pulseRef = useRef<L.CircleMarker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const otherMarkersRef = useRef<L.CircleMarker[]>([]);
  const [mode, setMode] = useState<MapMode>("dark");

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

    tileLayerRef.current = L.tileLayer(DARK_TILE, { maxZoom: 19 }).addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      userMarkerRef.current = null;
      pulseRef.current = null;
      polylineRef.current = null;
      otherMarkersRef.current = [];
    };
  }, []);

  // Switch tile layer on mode change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);
    const url = mode === "satellite" ? SATELLITE_TILE : DARK_TILE;
    tileLayerRef.current = L.tileLayer(url, { maxZoom: 19 }).addTo(map);
  }, [mode]);

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

  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: 200 }}>
      <div ref={containerRef} className="w-full h-full" />
      {showModeToggle && (
        <button
          onClick={() => setMode((m) => (m === "dark" ? "satellite" : "dark"))}
          className="absolute bottom-4 left-4 z-[1000] glass-card rounded-full w-10 h-10 flex items-center justify-center btn-press"
          title={mode === "dark" ? "Satellite view" : "Dark view"}
        >
          <Layers size={18} className="text-foreground" />
        </button>
      )}
    </div>
  );
});

RunMap.displayName = "RunMap";

export default RunMap;

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPosition } from "@/hooks/useGeolocation";

// Dark map tile
const DARK_TILE = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

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

const VOLT = "#DFFF00";
const BLUE = "#0066FF";

const RunMap = ({
  center,
  zoom = 15,
  routePositions = [],
  markers = [],
  showUserMarker = true,
  className = "",
  followUser = false,
}: RunMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const pulseRef = useRef<L.CircleMarker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markerRefs = useRef<L.CircleMarker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(DARK_TILE, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

    mapInstance.current = map;

    // Force resize after render
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (!mapInstance.current) return;
    if (followUser) {
      mapInstance.current.setView([center.lat, center.lng], mapInstance.current.getZoom(), { animate: true });
    }
  }, [center, followUser]);

  // User marker
  useEffect(() => {
    if (!mapInstance.current || !showUserMarker) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([center.lat, center.lng]);
    } else {
      userMarkerRef.current = L.circleMarker([center.lat, center.lng], {
        radius: 8,
        fillColor: BLUE,
        fillOpacity: 1,
        color: "#fff",
        weight: 3,
      }).addTo(mapInstance.current);
    }

    if (pulseRef.current) {
      pulseRef.current.setLatLng([center.lat, center.lng]);
    } else {
      pulseRef.current = L.circleMarker([center.lat, center.lng], {
        radius: 20,
        fillColor: BLUE,
        fillOpacity: 0.15,
        color: BLUE,
        weight: 1,
        opacity: 0.3,
      }).addTo(mapInstance.current);
    }
  }, [center, showUserMarker]);

  // Route polyline
  useEffect(() => {
    if (!mapInstance.current) return;
    if (polylineRef.current) {
      mapInstance.current.removeLayer(polylineRef.current);
    }
    if (routePositions.length > 1) {
      polylineRef.current = L.polyline(
        routePositions.map((p) => [p.lat, p.lng]),
        { color: VOLT, weight: 4, opacity: 0.9, smoothFactor: 1 }
      ).addTo(mapInstance.current);
    }
  }, [routePositions]);

  // Other markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear old markers
    markerRefs.current.forEach((m) => mapInstance.current!.removeLayer(m));
    markerRefs.current = [];

    markers.forEach((m) => {
      const marker = L.circleMarker([m.position.lat, m.position.lng], {
        radius: 6,
        fillColor: m.color || VOLT,
        fillOpacity: 1,
        color: m.color || VOLT,
        weight: 2,
        opacity: 0.5,
      }).addTo(mapInstance.current!);

      if (m.onClick) {
        marker.on("click", m.onClick);
      }

      markerRefs.current.push(marker);

      // Pulse ring
      if (m.pulse) {
        const pulseMarker = L.circleMarker([m.position.lat, m.position.lng], {
          radius: 14,
          fillColor: m.color || VOLT,
          fillOpacity: 0.1,
          color: m.color || VOLT,
          weight: 1,
          opacity: 0.2,
        }).addTo(mapInstance.current!);
        markerRefs.current.push(pulseMarker);
      }
    });
  }, [markers]);

  return (
    <div ref={mapRef} className={`w-full h-full ${className}`} style={{ minHeight: 200 }} />
  );
};

export default RunMap;

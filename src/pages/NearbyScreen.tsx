import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import RunMap from "@/components/RunMap";
import { useGeolocation, type GeoPosition } from "@/hooks/useGeolocation";

const NearbyScreen = () => {
  const { position } = useGeolocation();
  const [selectedRunner, setSelectedRunner] = useState<(typeof mockRunners)[0] | null>(null);

  // Generate mock runners near user's actual position
  const mockRunners = useMemo(() => {
    if (!position) return [];
    const base = position;
    return [
      { id: 1, name: "Alex K.", distance: "0.8 km", pace: "4'52\"/km", initials: "AK", position: { lat: base.lat + 0.005, lng: base.lng + 0.003 } },
      { id: 2, name: "Sarah M.", distance: "1.2 km", pace: "5'15\"/km", initials: "SM", position: { lat: base.lat - 0.004, lng: base.lng + 0.006 } },
      { id: 3, name: "James L.", distance: "2.1 km", pace: "6'02\"/km", initials: "JL", position: { lat: base.lat + 0.008, lng: base.lng - 0.005 } },
      { id: 4, name: "Nina R.", distance: "0.4 km", pace: "4'30\"/km", initials: "NR", position: { lat: base.lat - 0.002, lng: base.lng - 0.004 } },
      { id: 5, name: "Tom W.", distance: "3.5 km", pace: "5'45\"/km", initials: "TW", position: { lat: base.lat + 0.012, lng: base.lng + 0.01 } },
    ];
  }, [position]);

  const mapMarkers = useMemo(
    () =>
      mockRunners.map((r) => ({
        id: r.id,
        position: r.position as GeoPosition,
        color: "#DFFF00",
        pulse: true,
        onClick: () => setSelectedRunner(r),
      })),
    [mockRunners]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 relative z-[1000]">
        <h1 className="text-2xl font-bold text-foreground">Nearby Runners</h1>
        <p className="text-sm text-muted-foreground mt-1">{mockRunners.length} runners within 10 km</p>
      </div>

      {/* Map */}
      <div className="flex-1 mx-5 rounded-lg overflow-hidden min-h-[55vh] relative">
        {position ? (
          <RunMap center={position} zoom={14} showUserMarker markers={mapMarkers} />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
          </div>
        )}
      </div>

      {/* Runner Bottom Sheet */}
      {selectedRunner && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mx-5 mt-4 glass-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
                <span className="font-mono-stats text-xs text-primary">{selectedRunner.initials}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{selectedRunner.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRunner.distance} away</p>
              </div>
            </div>
            <span className="font-mono-stats text-primary text-lg">{selectedRunner.pace}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground font-semibold btn-press flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Request Chat
            </button>
            <button onClick={() => setSelectedRunner(null)} className="h-12 px-4 rounded-lg bg-secondary text-secondary-foreground font-medium btn-press">
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NearbyScreen;

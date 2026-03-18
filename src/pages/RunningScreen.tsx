import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Square, Play } from "lucide-react";
import RunMap from "@/components/RunMap";
import { useGeolocation, type GeoPosition } from "@/hooks/useGeolocation";

const RunningScreen = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);
  const [distance, setDistance] = useState(0);
  const [routePositions, setRoutePositions] = useState<GeoPosition[]>([]);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [stopProgress, setStopProgress] = useState(0);
  const prevPosition = useRef<GeoPosition | null>(null);

  const { position, startTracking, stopTracking } = useGeolocation();

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    } else if (countdown === 0 && showCountdown) {
      setShowCountdown(false);
      setIsRunning(true);
      startTracking();
    }
  }, [countdown, showCountdown]);

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Track positions and calculate distance
  useEffect(() => {
    if (!isRunning || !position) return;

    setRoutePositions((prev) => [...prev, position]);

    if (prevPosition.current) {
      const d = haversine(prevPosition.current, position);
      if (d > 0.002) { // filter GPS noise (>2m)
        setDistance((prev) => prev + d);
      }
    }
    prevPosition.current = position;
  }, [position, isRunning]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pace = seconds > 0 && distance > 0 ? Math.floor((seconds / 60) / distance) : 0;
  const paceSeconds = seconds > 0 && distance > 0 ? Math.floor(((seconds / 60) / distance - pace) * 60) : 0;

  const handleStopStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      stopTracking();
      navigate("/");
    }, 1500);

    const progressInterval = setInterval(() => {
      setStopProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + (100 / 15);
      });
    }, 100);

    const cleanup = () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      clearInterval(progressInterval);
      setStopProgress(0);
      window.removeEventListener("mouseup", cleanup);
      window.removeEventListener("touchend", cleanup);
    };
    window.addEventListener("mouseup", cleanup);
    window.addEventListener("touchend", cleanup);
  }, [stopTracking, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Countdown */}
      <AnimatePresence>
        {showCountdown && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background">
            <motion.span key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="font-mono-stats text-8xl text-primary">
              {countdown === 0 ? "GO" : countdown}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="px-5 pt-14 pb-4 space-y-4">
        <div className="text-center">
          <span className="font-label text-muted-foreground block mb-1">Duration</span>
          <span className="font-mono-stats text-6xl text-foreground">{formatTime(seconds)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-lg p-4 text-center">
            <span className="font-label text-muted-foreground block mb-1">Distance</span>
            <span className="font-mono-stats text-3xl text-foreground">{distance.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground ml-1">km</span>
          </div>
          <div className="glass-card rounded-lg p-4 text-center">
            <span className="font-label text-muted-foreground block mb-1">Pace</span>
            <span className="font-mono-stats text-3xl text-foreground">
              {pace}'{paceSeconds.toString().padStart(2, "0")}"
            </span>
            <span className="text-sm text-muted-foreground ml-1">/km</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-5 rounded-lg overflow-hidden relative mb-4 min-h-[200px]">
        {position ? (
          <RunMap center={position} zoom={16} showUserMarker followUser routePositions={routePositions} />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Acquiring GPS...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-5 pb-10 flex items-center justify-center gap-6">
        <motion.button whileTap={{ scale: 0.96 }} onClick={() => setIsRunning(!isRunning)} className="w-16 h-16 rounded-full glass-card flex items-center justify-center btn-press">
          {isRunning ? <Pause size={28} className="text-foreground" /> : <Play size={28} className="text-foreground" />}
        </motion.button>
        <div className="relative">
          <motion.button onMouseDown={handleStopStart} onTouchStart={handleStopStart} whileTap={{ scale: 0.96 }} className="w-20 h-20 rounded-full bg-destructive flex items-center justify-center btn-press relative overflow-hidden">
            {stopProgress > 0 && (
              <div className="absolute inset-0 bg-foreground/20 rounded-full" style={{ clipPath: `polygon(50% 50%, 50% 0%, ${stopProgress > 25 ? '100% 0%' : `${50 + stopProgress * 2}% 0%`}, ${stopProgress > 50 ? '100% 100%' : stopProgress > 25 ? `100% ${(stopProgress - 25) * 4}%` : '50% 0%'}, ${stopProgress > 75 ? '0% 100%' : stopProgress > 50 ? `${100 - (stopProgress - 50) * 4}% 100%` : '50% 0%'}, ${stopProgress > 75 ? `0% ${100 - (stopProgress - 75) * 4}%` : '50% 0%'}, 50% 0%)` }} />
            )}
            <Square size={28} className="text-foreground relative z-10" />
          </motion.button>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">Hold to stop</span>
        </div>
      </div>
    </div>
  );
};

// Haversine distance in km
function haversine(a: GeoPosition, b: GeoPosition): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default RunningScreen;

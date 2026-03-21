import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Square, Play, Flame, Zap, TrendingUp, Lock } from "lucide-react";
import RunMap from "@/components/RunMap";
import { useGeolocation, type GeoPosition } from "@/hooks/useGeolocation";
import { useRunHistory } from "@/hooks/useRunHistory";

const WEIGHT_KG = 70;
const MET_RUNNING = 9.8;

const RunningScreen = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(true);
  const [distance, setDistance] = useState(0);
  const [routePositions, setRoutePositions] = useState<GeoPosition[]>([]);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [stopProgress, setStopProgress] = useState(0);
  const prevPosition = useRef<GeoPosition | null>(null);
  const [steps, setSteps] = useState(0);
  const [splitTimes, setSplitTimes] = useState<number[]>([]);
  const lastKm = useRef(0);
  const { saveRun } = useRunHistory();

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
  }, [countdown, showCountdown, startTracking]);

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
      if (d > 0.002) {
        setDistance((prev) => {
          const newDist = prev + d;
          // Track km splits
          if (Math.floor(newDist) > lastKm.current) {
            lastKm.current = Math.floor(newDist);
            setSplitTimes((prev) => [...prev, seconds]);
          }
          return newDist;
        });
        setSteps((prev) => prev + Math.round(d * 1300));
      }
    }
    prevPosition.current = position;
  }, [position, isRunning]);

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pace = seconds > 0 && distance > 0 ? Math.floor((seconds / 60) / distance) : 0;
  const paceSeconds = seconds > 0 && distance > 0 ? Math.floor(((seconds / 60) / distance - pace) * 60) : 0;
  const calories = Math.round(MET_RUNNING * WEIGHT_KG * (seconds / 3600));
  const cadence = seconds > 0 ? Math.round((steps / seconds) * 60) : 0;
  const speedKmh = seconds > 0 && distance > 0 ? ((distance / seconds) * 3600) : 0;

  const handleFinishRun = useCallback(async () => {
    stopTracking();
    const avgPace = distance > 0 ? (seconds / 60) / distance : 0;
    await saveRun({
      distance_km: Math.round(distance * 1000) / 1000,
      duration_seconds: seconds,
      calories,
      steps,
      avg_pace_min_per_km: Math.round(avgPace * 100) / 100,
      avg_speed_kmh: Math.round(speedKmh * 100) / 100,
      route: routePositions,
    });
    navigate("/run-summary", {
      state: { distance, seconds, calories, steps, pace, paceSeconds, speedKmh, routePositions },
    });
  }, [stopTracking, navigate, distance, seconds, calories, steps, pace, paceSeconds, speedKmh, routePositions, saveRun]);

  const handleStopDown = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      handleFinishRun();
    }, 1500);
    progressInterval.current = setInterval(() => {
      setStopProgress((p) => {
        if (p >= 100) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          return 100;
        }
        return p + (100 / 15);
      });
    }, 100);
  }, [handleFinishRun]);

  const handleStopUp = useCallback(() => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setStopProgress(0);
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col bg-background relative overflow-hidden">
      {/* Countdown */}
      <AnimatePresence>
        {showCountdown && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-background">
            <motion.div className="flex flex-col items-center gap-4">
              <motion.span key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="font-mono-stats text-8xl text-primary">
                {countdown === 0 ? "GO" : countdown}
              </motion.span>
              <span className="text-sm text-muted-foreground">Get ready...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="px-4 pt-[env(safe-area-inset-top,12px)] pb-2 space-y-2 shrink-0">
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Live tracking</span>
        </div>

        <div className="text-center">
          <span className="font-label text-muted-foreground block mb-0.5">Duration</span>
          <span className="font-mono-stats text-5xl sm:text-6xl text-foreground">{formatTime(seconds)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="glass-card rounded-xl p-2.5 text-center">
            <span className="font-label text-muted-foreground block mb-0.5">Distance</span>
            <span className="font-mono-stats text-2xl text-foreground">{distance.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground ml-1">km</span>
          </div>
          <div className="glass-card rounded-xl p-2.5 text-center">
            <span className="font-label text-muted-foreground block mb-0.5">Pace</span>
            <span className="font-mono-stats text-2xl text-foreground">
              {pace}'{paceSeconds.toString().padStart(2, "0")}"
            </span>
            <span className="text-xs text-muted-foreground ml-1">/km</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="glass-card rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Flame size={12} className="text-destructive" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cal</span>
            </div>
            <span className="font-mono-stats text-lg text-foreground">{calories}</span>
          </div>
          <div className="glass-card rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Zap size={12} className="text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Cadence</span>
            </div>
            <span className="font-mono-stats text-lg text-foreground">{cadence}</span>
          </div>
          <div className="glass-card rounded-xl p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp size={12} className="text-accent" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">km/h</span>
            </div>
            <span className="font-mono-stats text-lg text-foreground">{speedKmh.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-4 rounded-xl overflow-hidden relative min-h-0">
        {position ? (
          <RunMap center={position} zoom={16} showUserMarker followUser routePositions={routePositions} />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Acquiring GPS...</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-4 flex items-center justify-center gap-6 shrink-0 pb-[max(env(safe-area-inset-bottom,16px),16px)]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsRunning(!isRunning)}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full glass-card flex items-center justify-center btn-press"
        >
          {isRunning ? <Pause size={24} className="text-foreground" /> : <Play size={24} className="text-foreground" />}
        </motion.button>
        <div className="relative">
          <motion.button
            onMouseDown={handleStopDown}
            onMouseUp={handleStopUp}
            onMouseLeave={handleStopUp}
            onTouchStart={handleStopDown}
            onTouchEnd={handleStopUp}
            whileTap={{ scale: 0.96 }}
            className="w-[72px] h-[72px] rounded-full bg-destructive flex items-center justify-center btn-press relative overflow-hidden"
          >
            {stopProgress > 0 && (
              <div
                className="absolute inset-1 rounded-full border-4 border-foreground/40"
                style={{
                  background: `conic-gradient(hsl(var(--foreground) / 0.3) ${stopProgress * 3.6}deg, transparent 0deg)`,
                }}
              />
            )}
            <Square size={24} className="text-foreground relative z-10" />
          </motion.button>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Lock size={8} /> Hold to stop
          </span>
        </div>
      </div>
    </div>
  );
};

function haversine(a: GeoPosition, b: GeoPosition): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default RunningScreen;

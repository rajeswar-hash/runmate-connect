import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Flame, Footprints, Zap, TrendingUp, Trophy, Share2, X } from "lucide-react";
import RunMap from "@/components/RunMap";
import type { GeoPosition } from "@/hooks/useGeolocation";

interface RunSummaryData {
  distance: number;
  seconds: number;
  calories: number;
  steps: number;
  pace: number;
  paceSeconds: number;
  speedKmh: number;
  routePositions: GeoPosition[];
}

const RunSummaryScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as RunSummaryData | null;

  if (!data) {
    navigate("/");
    return null;
  }

  const { distance, seconds, calories, steps, pace, paceSeconds, speedKmh, routePositions } = data;

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const center = routePositions.length > 0
    ? routePositions[Math.floor(routePositions.length / 2)]
    : { lat: 0, lng: 0 };

  const statItems = [
    { icon: <Clock size={16} className="text-accent" />, label: "Duration", value: formatTime(seconds) },
    { icon: <TrendingUp size={16} className="text-primary" />, label: "Avg Pace", value: `${pace}'${paceSeconds.toString().padStart(2, "0")}" /km` },
    { icon: <Zap size={16} className="text-primary" />, label: "Avg Speed", value: `${speedKmh.toFixed(1)} km/h` },
    { icon: <Flame size={16} className="text-destructive" />, label: "Calories", value: `${calories} kcal` },
    { icon: <Footprints size={16} className="text-accent" />, label: "Steps", value: steps.toLocaleString() },
  ];

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-2 flex items-center justify-between shrink-0">
        <button onClick={() => navigate("/")} className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
          <X size={18} className="text-foreground" />
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-foreground"
        >
          Run Complete 🎉
        </motion.h1>
        <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
          <Share2 size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Hero distance */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-center py-6 shrink-0"
      >
        <span className="text-muted-foreground text-xs uppercase tracking-widest block mb-1">Total Distance</span>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-mono-stats text-7xl text-primary">{distance.toFixed(2)}</span>
          <span className="text-xl text-muted-foreground font-medium">km</span>
        </div>
      </motion.div>

      {/* Map */}
      {routePositions.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 h-48 rounded-xl overflow-hidden mb-4 shrink-0"
        >
          <RunMap
            center={center}
            zoom={14}
            routePositions={routePositions}
            showUserMarker={false}
            followUser={false}
            showModeToggle={false}
          />
        </motion.div>
      )}

      {/* Stats grid */}
      <div className="px-4 mb-6 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          {statItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="glass-card rounded-xl p-3.5"
            >
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
              </div>
              <span className="font-mono-stats text-lg text-foreground">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement unlocked animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="mx-4 mb-6 shrink-0"
      >
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl shrink-0">
            <Trophy className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Great effort!</p>
            <p className="text-xs text-muted-foreground">
              {distance >= 5 ? "You crushed a 5K! 🏅" :
               distance >= 1 ? "Solid run! Keep pushing! 💪" :
               "Every step counts! 🔥"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Done button */}
      <div className="px-4 pb-[max(env(safe-area-inset-bottom,16px),16px)] mt-auto shrink-0">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center active-pulse btn-press"
        >
          Done
        </motion.button>
      </div>
    </div>
  );
};

export default RunSummaryScreen;

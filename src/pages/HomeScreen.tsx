import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Target, Play, Zap, Trophy } from "lucide-react";
import StatCard from "@/components/StatCard";
import RunMap from "@/components/RunMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { useRunHistory } from "@/hooks/useRunHistory";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const { user } = useAuth();
  const { stats, runs } = useRunHistory();

  const firstName = (user?.user_metadata?.full_name || "Runner").split(" ")[0];
  const lastRun = runs.length > 0 ? runs[0] : null;

  return (
    <div className="h-[100dvh] flex flex-col bg-background pb-16">
      {/* Map */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {position ? (
          <RunMap center={position} zoom={15} showUserMarker followUser />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
          </div>
        )}

        {/* Greeting overlay */}
        <div className="absolute top-[max(env(safe-area-inset-top,12px),12px)] left-4 z-[1000]">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl px-4 py-2.5"
          >
            <p className="text-xs text-muted-foreground">Good {getGreeting()}</p>
            <p className="text-sm font-bold text-foreground">{firstName} 👋</p>
          </motion.div>
        </div>

        {/* Daily goal + streak */}
        <div className="absolute top-[max(env(safe-area-inset-top,12px),12px)] right-4 z-[1000] flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-xl px-3 py-2 flex items-center gap-2"
          >
            <Target size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Daily Goal</p>
              <p className="font-mono-stats text-xs text-foreground">
                {Math.min(stats.thisMonthDistance / (new Date().getDate()), 5).toFixed(1)}/5 km
              </p>
            </div>
          </motion.div>
          {stats.currentStreak > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <Zap size={14} className="text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground">Streak</p>
                <p className="font-mono-stats text-xs text-foreground">{stats.currentStreak} days 🔥</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Last run badge */}
        {lastRun && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-4 left-4 right-4 z-[1000] glass-card rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Run</p>
              <p className="text-sm font-bold text-foreground">
                {lastRun.distance_km.toFixed(2)} km · {Math.floor(lastRun.duration_seconds / 60)} min
              </p>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {new Date(lastRun.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-4 pt-3 pb-2 space-y-3 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="This Week" value={stats.weeklyDistance.reduce((a, b) => a + b, 0).toFixed(1)} unit="km" icon={<TrendingUp size={14} className="text-primary" />} />
          <StatCard label="Runs" value={stats.totalRuns.toString()} icon={<Target size={14} className="text-primary" />} />
          <StatCard label="Calories" value={stats.totalCalories.toString()} unit="kcal" icon={<Flame size={14} className="text-destructive" />} />
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/running")}
          className="w-full h-14 sm:h-16 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl flex items-center justify-center active-pulse btn-press gap-2"
        >
          <Play size={22} />
          Start Run
        </motion.button>
      </div>
    </div>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default HomeScreen;

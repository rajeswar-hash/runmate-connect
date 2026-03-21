import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { TrendingUp, Flame, Clock, Footprints, MapPin, ChevronRight } from "lucide-react";
import { useRunHistory } from "@/hooks/useRunHistory";
import { useNavigate } from "react-router-dom";

const ActivityScreen = () => {
  const { runs, stats, loading } = useRunHistory();
  const navigate = useNavigate();

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maxWeekly = Math.max(...stats.weeklyDistance, 1);

  return (
    <div className="h-[100dvh] overflow-y-auto bg-background pb-20">
      <div className="px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground pt-2">Activity</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Your running journal</p>
      </div>

      {/* Month stats */}
      <div className="px-4 grid grid-cols-2 gap-2 mb-4">
        <StatCard label="This Month" value={stats.thisMonthDistance.toFixed(1)} unit="km" icon={<TrendingUp size={14} className="text-primary" />} />
        <StatCard label="Calories" value={stats.thisMonthCalories.toString()} unit="kcal" icon={<Flame size={14} className="text-destructive" />} />
      </div>

      {/* Weekly chart */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-label text-muted-foreground">Weekly Distance</span>
            <span className="font-mono-stats text-xs text-primary">
              {stats.weeklyDistance.reduce((a, b) => a + b, 0).toFixed(1)} km
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-24">
            {stats.weeklyDistance.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="font-mono-stats text-[9px] text-muted-foreground">
                  {val > 0 ? val.toFixed(1) : ""}
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: val > 0 ? `${(val / maxWeekly) * 100}%` : 4 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className={`w-full rounded-md ${val > 0 ? "bg-gradient-to-t from-primary/60 to-primary" : "bg-secondary"}`}
                  style={{ minHeight: 4 }}
                />
                <span className="text-[10px] text-muted-foreground font-medium">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal bests */}
      {stats.totalRuns > 0 && (
        <div className="px-4 mb-4">
          <div className="glass-card rounded-xl p-4">
            <span className="font-label text-muted-foreground block mb-3">Personal Bests</span>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground uppercase block mb-1">Longest Run</span>
                <span className="font-mono-stats text-lg text-foreground">{stats.longestRun.toFixed(2)}</span>
                <span className="text-[10px] text-muted-foreground ml-0.5">km</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground uppercase block mb-1">Fastest Pace</span>
                <span className="font-mono-stats text-lg text-foreground">
                  {stats.fastestPace > 0 ? `${Math.floor(stats.fastestPace)}'${Math.floor((stats.fastestPace % 1) * 60).toString().padStart(2, "0")}"` : "--"}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground uppercase block mb-1">Total Steps</span>
                <span className="font-mono-stats text-lg text-foreground">{stats.totalSteps.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run list */}
      <div className="px-4">
        <h3 className="font-label text-muted-foreground mb-2">All Runs</h3>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : runs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl mb-3">👟</div>
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs mt-1">Complete your first run to see stats here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {runs.map((run, i) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-3.5 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      {run.distance_km.toFixed(2)} km
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(run.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={10} /> {formatDuration(run.duration_seconds)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Flame size={10} /> {run.calories} kcal
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Footprints size={10} /> {run.steps.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityScreen;

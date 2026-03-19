import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { TrendingUp, Flame } from "lucide-react";

const ActivityScreen = () => {
  return (
    <div className="h-[100dvh] overflow-y-auto bg-background pb-20">
      <div className="px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground pt-2">Activity</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Your running journal</p>
      </div>

      <div className="px-4 grid grid-cols-2 gap-2 mb-4">
        <StatCard label="This Month" value="0" unit="km" icon={<TrendingUp size={14} className="text-primary" />} />
        <StatCard label="Calories" value="0" unit="kcal" icon={<Flame size={14} className="text-destructive" />} />
      </div>

      <div className="px-4 mb-4">
        <div className="glass-card rounded-lg p-3">
          <span className="font-label text-muted-foreground block mb-3">Weekly Distance</span>
          <div className="flex items-end justify-between gap-1.5 h-20">
            {[0, 0, 0, 0, 0, 0, 0].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: val > 0 ? `${(val / 10) * 100}%` : "2px" }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`w-full rounded-sm ${val > 0 ? "bg-primary/80" : "bg-secondary"}`}
                  style={{ minHeight: 2 }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="font-label text-muted-foreground mb-2">All Runs</h3>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl mb-3">📊</div>
          <p className="text-sm font-medium">No activity yet</p>
          <p className="text-xs mt-1">Complete your first run to see stats here</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityScreen;

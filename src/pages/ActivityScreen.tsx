import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { ChevronRight } from "lucide-react";

const runs = [
  { id: 1, date: "Today, 7:15 AM", distance: "5.23", time: "27:14", pace: "5'12\"", calories: "412" },
  { id: 2, date: "Yesterday, 6:30 AM", distance: "3.81", time: "20:45", pace: "5'27\"", calories: "298" },
  { id: 3, date: "Mar 15, 8:00 AM", distance: "8.42", time: "43:18", pace: "5'08\"", calories: "658" },
  { id: 4, date: "Mar 13, 7:45 AM", distance: "4.10", time: "22:30", pace: "5'29\"", calories: "321" },
  { id: 5, date: "Mar 11, 6:00 AM", distance: "6.75", time: "35:10", pace: "5'13\"", calories: "528" },
];

const ActivityScreen = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">March 2026</p>
      </div>

      {/* Summary */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-6">
        <StatCard label="This Month" value="28.3" unit="km" />
        <StatCard label="Runs" value="5" />
      </div>

      {/* Weekly bar chart mockup */}
      <div className="px-5 mb-6">
        <div className="glass-card rounded-lg p-4">
          <span className="font-label text-muted-foreground block mb-4">Weekly Distance</span>
          <div className="flex items-end justify-between gap-2 h-24">
            {[3.2, 5.1, 0, 8.4, 4.1, 6.7, 5.2].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / 8.4) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className={`w-full rounded-sm ${val > 0 ? "bg-primary/80" : "bg-secondary"}`}
                  style={{ minHeight: val > 0 ? 4 : 2 }}
                />
                <span className="text-[9px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Run List */}
      <div className="px-5">
        <h3 className="font-label text-muted-foreground mb-3">All Runs</h3>
        <div className="space-y-2">
          {runs.map((run, i) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg p-4 btn-press cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">{run.date}</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="font-mono-stats text-xl text-foreground">{run.distance}<span className="text-xs text-muted-foreground ml-1">km</span></span>
                    <span className="font-mono-stats text-sm text-muted-foreground">{run.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono-stats text-sm text-primary">{run.pace}</span>
                    <span className="block text-[10px] text-muted-foreground">{run.calories} kcal</span>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityScreen;

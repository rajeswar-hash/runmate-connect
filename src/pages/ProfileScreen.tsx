import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { Settings, Shield, ChevronRight } from "lucide-react";
import { useState } from "react";

const recentRuns = [
  { id: 1, date: "Today", distance: "5.23", time: "27:14", pace: "5'12\"" },
  { id: 2, date: "Yesterday", distance: "3.81", time: "20:45", pace: "5'27\"" },
  { id: 3, date: "Mar 15", distance: "8.42", time: "43:18", pace: "5'08\"" },
  { id: 4, date: "Mar 13", distance: "4.10", time: "22:30", pace: "5'29\"" },
];

const privacyOptions = ["Public", "Friends", "Private"] as const;

const ProfileScreen = () => {
  const [privacy, setPrivacy] = useState<typeof privacyOptions[number]>("Public");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="font-mono-stats text-xl text-primary">JD</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">John Doe</h2>
            <p className="text-sm text-muted-foreground">Running since Jan 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Dist" value="142" unit="km" />
        <StatCard label="Total Runs" value="28" />
        <StatCard label="Avg Pace" value={"5'18\""} unit="/km" />
      </div>

      {/* Privacy */}
      <div className="px-5 mb-6">
        <div className="glass-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} className="text-primary" />
            <span className="font-label text-muted-foreground">Privacy</span>
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {privacyOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setPrivacy(opt)}
                className={`flex-1 h-10 rounded-md text-sm font-medium transition-all btn-press ${
                  privacy === opt
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Runs */}
      <div className="px-5">
        <h3 className="font-label text-muted-foreground mb-3">Recent Runs</h3>
        <div className="space-y-2">
          {recentRuns.map((run, i) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg p-4 flex items-center justify-between btn-press cursor-pointer"
            >
              <div>
                <span className="text-sm text-muted-foreground">{run.date}</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono-stats text-lg text-foreground">{run.distance}</span>
                  <span className="text-xs text-muted-foreground">km</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-mono-stats text-sm text-foreground">{run.time}</span>
                  <span className="block text-xs text-muted-foreground">{run.pace}/km</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

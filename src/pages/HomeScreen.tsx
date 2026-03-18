import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Shield } from "lucide-react";
import StatCard from "@/components/StatCard";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Map Placeholder */}
      <div className="relative flex-1 min-h-[55vh] bg-secondary overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center mx-auto mb-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
            </div>
            <p className="text-muted-foreground text-sm">Map loads here</p>
            <p className="text-muted-foreground/50 text-xs mt-1">GPS ready</p>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="absolute top-5 right-5 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Shield size={14} className="text-primary" />
          <span className="text-xs text-foreground font-medium">Public</span>
        </div>

        {/* Location indicator */}
        <div className="absolute top-5 left-5 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <MapPin size={14} className="text-accent" />
          <span className="text-xs text-foreground font-medium">Downtown</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-5 pt-6 space-y-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="This Week" value="12.4" unit="km" />
          <StatCard label="Runs" value="3" />
          <StatCard label="Avg Pace" value="5'24\"" unit="/km" />
        </div>

        {/* Start Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/running")}
          className="w-full h-16 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center gap-2 active-pulse btn-press"
        >
          Start Run
        </motion.button>
      </div>
    </div>
  );
};

export default HomeScreen;

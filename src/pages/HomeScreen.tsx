import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import StatCard from "@/components/StatCard";
import RunMap from "@/components/RunMap";
import { useGeolocation } from "@/hooks/useGeolocation";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { position } = useGeolocation();

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

        {/* Privacy badge */}
        <div className="absolute top-[max(env(safe-area-inset-top,12px),12px)] right-4 z-[1000] glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Shield size={14} className="text-primary" />
          <span className="text-xs text-foreground font-medium">Public</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pt-4 pb-2 space-y-4 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="This Week" value="12.4" unit="km" />
          <StatCard label="Runs" value="3" />
          <StatCard label="Avg Pace" value={"5'24\""} unit="/km" />
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/running")}
          className="w-full h-14 sm:h-16 rounded-full bg-primary text-primary-foreground font-bold text-lg sm:text-xl flex items-center justify-center active-pulse btn-press"
        >
          Start Run
        </motion.button>
      </div>
    </div>
  );
};

export default HomeScreen;

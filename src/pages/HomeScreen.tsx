import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, TrendingUp, Target, Play } from "lucide-react";
import StatCard from "@/components/StatCard";
import RunMap from "@/components/RunMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { position } = useGeolocation();
  const { user } = useAuth();

  const firstName = (user?.user_metadata?.full_name || "Runner").split(" ")[0];

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
          <div className="glass-card rounded-xl px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Good {getGreeting()}</p>
            <p className="text-sm font-bold text-foreground">{firstName} 👋</p>
          </div>
        </div>

        {/* Daily goal */}
        <div className="absolute top-[max(env(safe-area-inset-top,12px),12px)] right-4 z-[1000]">
          <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2">
            <Target size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Daily Goal</p>
              <p className="font-mono-stats text-xs text-foreground">0/5 km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pt-3 pb-2 space-y-3 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="This Week" value="0" unit="km" icon={<TrendingUp size={14} className="text-primary" />} />
          <StatCard label="Runs" value="0" icon={<Target size={14} className="text-primary" />} />
          <StatCard label="Calories" value="0" unit="kcal" icon={<Flame size={14} className="text-destructive" />} />
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

// Need to import Play
import { Play } from "lucide-react";

export default HomeScreen;

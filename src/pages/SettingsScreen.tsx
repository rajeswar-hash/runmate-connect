import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bell, Moon, Ruler, Weight, Target,
  MapPin, Volume2, Vibrate, ChevronRight, Heart
} from "lucide-react";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}

const SettingRow = ({ icon, label, value, toggle, checked, onToggle, onClick }: SettingRowProps) => (
  <button
    onClick={toggle ? onToggle : onClick}
    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors btn-press"
  >
    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="text-sm text-foreground flex-1 text-left">{label}</span>
    {toggle ? (
      <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-muted"}`}>
        <motion.div
          className="w-5 h-5 rounded-full bg-foreground"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    ) : (
      <div className="flex items-center gap-1">
        {value && <span className="text-xs text-muted-foreground">{value}</span>}
        <ChevronRight size={14} className="text-muted-foreground" />
      </div>
    )}
  </button>
);

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoPause, setAutoPause] = useState(true);
  const [darkMode] = useState(true);
  const [units, setUnits] = useState<"km" | "mi">("km");
  const [heartRateMonitor, setHeartRateMonitor] = useState(false);

  return (
    <div className="h-[100dvh] overflow-y-auto bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-2">
        <div className="flex items-center gap-3 pt-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Notifications */}
        <div>
          <span className="font-label text-muted-foreground block mb-2 px-1">Notifications</span>
          <div className="glass-card rounded-lg p-1">
            <SettingRow
              icon={<Bell size={16} className="text-primary" />}
              label="Push Notifications"
              toggle checked={notifications}
              onToggle={() => setNotifications(!notifications)}
            />
          </div>
        </div>

        {/* Running */}
        <div>
          <span className="font-label text-muted-foreground block mb-2 px-1">Running</span>
          <div className="glass-card rounded-lg p-1 space-y-0.5">
            <SettingRow
              icon={<Volume2 size={16} className="text-accent" />}
              label="Audio Feedback"
              toggle checked={audioFeedback}
              onToggle={() => setAudioFeedback(!audioFeedback)}
            />
            <SettingRow
              icon={<Vibrate size={16} className="text-accent" />}
              label="Haptic Feedback"
              toggle checked={hapticFeedback}
              onToggle={() => setHapticFeedback(!hapticFeedback)}
            />
            <SettingRow
              icon={<MapPin size={16} className="text-accent" />}
              label="Auto Pause"
              toggle checked={autoPause}
              onToggle={() => setAutoPause(!autoPause)}
            />
            <SettingRow
              icon={<Heart size={16} className="text-destructive" />}
              label="Heart Rate Monitor"
              toggle checked={heartRateMonitor}
              onToggle={() => setHeartRateMonitor(!heartRateMonitor)}
            />
          </div>
        </div>

        {/* Units & Preferences */}
        <div>
          <span className="font-label text-muted-foreground block mb-2 px-1">Preferences</span>
          <div className="glass-card rounded-lg p-1 space-y-0.5">
            <SettingRow
              icon={<Ruler size={16} className="text-primary" />}
              label="Distance Unit"
              value={units.toUpperCase()}
              onClick={() => setUnits(units === "km" ? "mi" : "km")}
            />
            <SettingRow
              icon={<Weight size={16} className="text-primary" />}
              label="Weight"
              value="70 kg"
            />
            <SettingRow
              icon={<Target size={16} className="text-primary" />}
              label="Daily Goal"
              value="5 km"
            />
            <SettingRow
              icon={<Moon size={16} className="text-primary" />}
              label="Dark Mode"
              toggle checked={darkMode}
              onToggle={() => {}}
            />
          </div>
        </div>

        {/* App info */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-muted-foreground">RunMate v1.0.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">Made with ❤️ for runners</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

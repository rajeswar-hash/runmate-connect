import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import { Settings, Shield, ChevronRight, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";


const privacyOptions = ["Public", "Friends", "Private"] as const;

const ProfileScreen = () => {
  const [privacy, setPrivacy] = useState<typeof privacyOptions[number]>("Public");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; bio: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, bio, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "Runner";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="h-[100dvh] overflow-y-auto bg-background pb-20">
      {/* Header */}
      <div className="px-4 pt-[max(env(safe-area-inset-top,12px),12px)] pb-4">
        <div className="flex items-center justify-between mb-5 pt-2">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Profile</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press"
            >
              <LogOut size={18} className="text-destructive" />
            </button>
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press">
              <Settings size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
            <span className="font-mono-stats text-lg text-primary">{initials}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        <StatCard label="Total Dist" value="0" unit="km" />
        <StatCard label="Total Runs" value="0" />
        <StatCard label="Avg Pace" value="--" unit="/km" />
      </div>

      <div className="px-4 mb-4">
        <div className="glass-card rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-primary" />
            <span className="font-label text-muted-foreground">Privacy</span>
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {privacyOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setPrivacy(opt)}
                className={`flex-1 h-9 rounded-md text-xs sm:text-sm font-medium transition-all btn-press ${
                  privacy === opt ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="font-label text-muted-foreground mb-2">Recent Runs</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <p className="text-sm">No runs yet. Get out there! 🏃</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

import { motion } from "framer-motion";
import StatCard from "@/components/StatCard";
import AvatarPicker from "@/components/AvatarPicker";
import { Settings, Shield, LogOut, Camera, Edit3, Trophy, Flame, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const privacyOptions = ["Public", "Friends", "Private"] as const;

const ProfileScreen = () => {
  const [privacy, setPrivacy] = useState<typeof privacyOptions[number]>("Public");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; bio: string | null; avatar_url: string | null } | null>(null);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarEmoji, setAvatarEmoji] = useState("🏃");
  const [avatarColor, setAvatarColor] = useState("72 100% 50%");
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameText, setNameText] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, bio, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setBioText(data.bio || "");
          setNameText(data.full_name || "");
          // Parse avatar_url for emoji/color
          if (data.avatar_url?.startsWith("emoji:")) {
            const parts = data.avatar_url.split("|");
            setAvatarEmoji(parts[0].replace("emoji:", ""));
            if (parts[1]) setAvatarColor(parts[1]);
          }
        }
      });
  }, [user]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "Runner";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleAvatarSelect = async (emoji: string, color: string) => {
    setAvatarEmoji(emoji);
    setAvatarColor(color);
    if (!user) return;
    const avatarVal = `emoji:${emoji}|${color}`;
    await supabase.from("profiles").update({ avatar_url: avatarVal }).eq("user_id", user.id);
    toast.success("Avatar updated!");
  };

  const handleSaveBio = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ bio: bioText }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, bio: bioText } : p);
    setEditingBio(false);
    toast.success("Bio updated!");
  };

  const handleSaveName = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ full_name: nameText }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, full_name: nameText } : p);
    setEditingName(false);
    toast.success("Name updated!");
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
            <button
              onClick={() => navigate("/settings")}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center btn-press"
            >
              <Settings size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAvatarPickerOpen(true)}
            className="relative shrink-0 btn-press group"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-colors"
              style={{
                backgroundColor: `hsl(${avatarColor} / 0.2)`,
                borderColor: `hsl(${avatarColor})`,
              }}
            >
              {avatarEmoji}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Camera size={11} className="text-primary-foreground" />
            </div>
          </button>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex gap-2">
                <input
                  value={nameText}
                  onChange={(e) => setNameText(e.target.value)}
                  className="flex-1 bg-secondary rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <button onClick={handleSaveName} className="text-primary text-xs font-bold">Save</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground truncate">{displayName}</h2>
                <button onClick={() => { setNameText(displayName); setEditingName(true); }} className="btn-press">
                  <Edit3 size={13} className="text-muted-foreground" />
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-3">
          {editingBio ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                placeholder="Tell us about your running journey..."
                className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                rows={2}
                maxLength={150}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{bioText.length}/150</span>
                <div className="flex gap-2">
                  <button onClick={() => setEditingBio(false)} className="text-xs text-muted-foreground">Cancel</button>
                  <button onClick={handleSaveBio} className="text-xs text-primary font-bold">Save</button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditingBio(true)} className="text-left btn-press w-full">
              <p className="text-sm text-muted-foreground">
                {profile?.bio || "Tap to add a bio..."}
              </p>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        <StatCard label="Total Dist" value="0" unit="km" icon={<TrendingUp size={14} className="text-primary" />} />
        <StatCard label="Total Runs" value="0" icon={<Trophy size={14} className="text-primary" />} />
        <StatCard label="Calories" value="0" unit="kcal" icon={<Flame size={14} className="text-destructive" />} />
      </div>

      {/* Achievements preview */}
      <div className="px-4 mb-4">
        <div className="glass-card rounded-lg p-3">
          <span className="font-label text-muted-foreground block mb-3">Achievements</span>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              { emoji: "👟", label: "First Run", locked: false },
              { emoji: "🔥", label: "5 Day Streak", locked: true },
              { emoji: "🏅", label: "10km Club", locked: true },
              { emoji: "⚡", label: "Speed Demon", locked: true },
              { emoji: "🏔️", label: "Marathon", locked: true },
            ].map((a) => (
              <div
                key={a.label}
                className={`flex flex-col items-center gap-1 min-w-[56px] ${a.locked ? "opacity-30" : ""}`}
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {a.emoji}
                </div>
                <span className="text-[9px] text-muted-foreground text-center">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy */}
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

      {/* Recent Runs */}
      <div className="px-4">
        <h3 className="font-label text-muted-foreground mb-2">Recent Runs</h3>
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl mb-3">👟</div>
          <p className="text-sm font-medium">No runs yet</p>
          <p className="text-xs mt-1">Start your first run to see it here!</p>
        </div>
      </div>

      <AvatarPicker
        open={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        onSelect={handleAvatarSelect}
        currentEmoji={avatarEmoji}
        currentColor={avatarColor}
      />
    </div>
  );
};

export default ProfileScreen;

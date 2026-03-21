import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Run {
  id: string;
  distance_km: number;
  duration_seconds: number;
  calories: number;
  steps: number;
  avg_pace_min_per_km: number;
  avg_speed_kmh: number;
  route: Array<{ lat: number; lng: number }>;
  created_at: string;
}

export interface RunStats {
  totalDistance: number;
  totalRuns: number;
  totalCalories: number;
  totalSteps: number;
  avgPace: number;
  weeklyDistance: number[];
  thisMonthDistance: number;
  thisMonthCalories: number;
  currentStreak: number;
  longestRun: number;
  fastestPace: number;
}

function getWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff));
}

export function useRunHistory() {
  const { user } = useAuth();
  const [runs, setRuns] = useState<Run[]>([]);
  const [stats, setStats] = useState<RunStats>({
    totalDistance: 0, totalRuns: 0, totalCalories: 0, totalSteps: 0,
    avgPace: 0, weeklyDistance: [0, 0, 0, 0, 0, 0, 0],
    thisMonthDistance: 0, thisMonthCalories: 0, currentStreak: 0,
    longestRun: 0, fastestPace: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchRuns = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("runs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      const typedRuns = data.map((r: any) => ({
        ...r,
        distance_km: Number(r.distance_km),
        avg_pace_min_per_km: Number(r.avg_pace_min_per_km),
        avg_speed_kmh: Number(r.avg_speed_kmh),
        route: Array.isArray(r.route) ? r.route : [],
      })) as Run[];
      setRuns(typedRuns);
      computeStats(typedRuns);
    }
    setLoading(false);
  }, [user]);

  const computeStats = (runs: Run[]) => {
    const totalDistance = runs.reduce((s, r) => s + r.distance_km, 0);
    const totalCalories = runs.reduce((s, r) => s + r.calories, 0);
    const totalSteps = runs.reduce((s, r) => s + r.steps, 0);
    const paces = runs.filter(r => r.avg_pace_min_per_km > 0).map(r => r.avg_pace_min_per_km);
    const avgPace = paces.length > 0 ? paces.reduce((s, p) => s + p, 0) / paces.length : 0;
    const longestRun = runs.length > 0 ? Math.max(...runs.map(r => r.distance_km)) : 0;
    const fastestPace = paces.length > 0 ? Math.min(...paces) : 0;

    // Weekly distance
    const weekStart = getWeekStart();
    weekStart.setHours(0, 0, 0, 0);
    const weekly = [0, 0, 0, 0, 0, 0, 0];
    runs.forEach(r => {
      const d = new Date(r.created_at);
      if (d >= weekStart) {
        const dayIdx = (d.getDay() + 6) % 7; // Mon=0
        weekly[dayIdx] += r.distance_km;
      }
    });

    // This month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRuns = runs.filter(r => new Date(r.created_at) >= monthStart);
    const thisMonthDistance = thisMonthRuns.reduce((s, r) => s + r.distance_km, 0);
    const thisMonthCalories = thisMonthRuns.reduce((s, r) => s + r.calories, 0);

    // Streak (consecutive days with runs)
    let streak = 0;
    if (runs.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const runDates = [...new Set(runs.map(r => {
        const d = new Date(r.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }))].sort((a, b) => b - a);

      const todayTime = today.getTime();
      const yesterdayTime = todayTime - 86400000;
      if (runDates[0] === todayTime || runDates[0] === yesterdayTime) {
        streak = 1;
        for (let i = 1; i < runDates.length; i++) {
          if (runDates[i] === runDates[i - 1] - 86400000) streak++;
          else break;
        }
      }
    }

    setStats({
      totalDistance, totalRuns: runs.length, totalCalories, totalSteps,
      avgPace, weeklyDistance: weekly, thisMonthDistance, thisMonthCalories,
      currentStreak: streak, longestRun, fastestPace,
    });
  };

  const saveRun = useCallback(async (run: Omit<Run, "id" | "created_at">) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("runs")
      .insert({ ...run, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      await fetchRuns();
      return data;
    }
    return null;
  }, [user, fetchRuns]);

  useEffect(() => { fetchRuns(); }, [fetchRuns]);

  return { runs, stats, loading, saveRun, refetch: fetchRuns };
}

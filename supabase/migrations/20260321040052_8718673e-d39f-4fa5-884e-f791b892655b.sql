
CREATE TABLE public.runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  distance_km numeric NOT NULL DEFAULT 0,
  duration_seconds integer NOT NULL DEFAULT 0,
  calories integer NOT NULL DEFAULT 0,
  steps integer NOT NULL DEFAULT 0,
  avg_pace_min_per_km numeric DEFAULT 0,
  avg_speed_kmh numeric DEFAULT 0,
  route jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own runs" ON public.runs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own runs" ON public.runs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own runs" ON public.runs FOR DELETE TO authenticated USING (auth.uid() = user_id);

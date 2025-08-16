-- Enhanced Analytics Tables for AI Music Dashboard

-- Create listening_sessions table for session tracking
CREATE TABLE public.listening_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_session_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_songs_played INTEGER DEFAULT 0,
  total_duration_seconds INTEGER DEFAULT 0,
  device_type TEXT,
  browser_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_preferences table for behavioral analytics
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_session_id TEXT NOT NULL,
  song_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'play', 'skip', 'replay', 'favorite', 'share'
  duration_listened INTEGER DEFAULT 0, -- in seconds
  completion_percentage DECIMAL(5,2), -- percentage of song completed
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create geographic_data table for location analytics (anonymous)
CREATE TABLE public.geographic_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT, -- BC regions like Vancouver, Victoria, etc
  city TEXT,
  listening_count INTEGER DEFAULT 1,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real_time_metrics table for live dashboard updates
CREATE TABLE public.real_time_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'active_listeners', 'current_plays', 'peak_concurrent'
  metric_value INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create song_analytics view for comprehensive song statistics
CREATE OR REPLACE VIEW public.song_analytics AS
SELECT 
  sp.song_id,
  COUNT(*) as total_plays,
  AVG(sp.duration_seconds) as avg_duration,
  COUNT(CASE WHEN sp.is_valid_play = true THEN 1 END) as valid_plays,
  AVG(CASE WHEN up.completion_percentage IS NOT NULL THEN up.completion_percentage END) as avg_completion_rate,
  COUNT(CASE WHEN up.action_type = 'skip' THEN 1 END) as skip_count,
  COUNT(CASE WHEN up.action_type = 'replay' THEN 1 END) as replay_count,
  MAX(sp.played_at) as last_played_at,
  MIN(sp.played_at) as first_played_at
FROM public.song_plays sp
LEFT JOIN public.user_preferences up ON sp.song_id = up.song_id
GROUP BY sp.song_id;

-- Enable Row Level Security
ALTER TABLE public.listening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public survey/analytics platform)
CREATE POLICY "Public can insert listening sessions" 
ON public.listening_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert user preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view user preferences" 
ON public.user_preferences 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view geographic data" 
ON public.geographic_data 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert geographic data" 
ON public.geographic_data 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view real-time metrics" 
ON public.real_time_metrics 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert real-time metrics" 
ON public.real_time_metrics 
FOR INSERT 
WITH CHECK (true);

-- Create function to get dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(
  total_plays bigint,
  active_sessions bigint,
  unique_songs bigint,
  avg_session_duration numeric,
  top_region text,
  peak_hour integer
) 
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.song_plays WHERE is_valid_play = true)::bigint as total_plays,
    (SELECT COUNT(*) FROM public.listening_sessions WHERE ended_at IS NULL)::bigint as active_sessions,
    (SELECT COUNT(DISTINCT song_id) FROM public.song_plays)::bigint as unique_songs,
    (SELECT AVG(total_duration_seconds) FROM public.listening_sessions WHERE ended_at IS NOT NULL)::numeric as avg_session_duration,
    (SELECT region FROM public.geographic_data ORDER BY listening_count DESC LIMIT 1) as top_region,
    (SELECT EXTRACT(HOUR FROM played_at)::integer as hour FROM public.song_plays GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1) as peak_hour;
END;
$$;

-- Create function to get hourly listening patterns
CREATE OR REPLACE FUNCTION public.get_hourly_patterns()
RETURNS TABLE(hour integer, play_count bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(HOUR FROM played_at)::integer as hour,
    COUNT(*)::bigint as play_count
  FROM public.song_plays 
  WHERE played_at > now() - interval '7 days'
  GROUP BY hour
  ORDER BY hour;
END;
$$;

-- Create function to get geographic distribution
CREATE OR REPLACE FUNCTION public.get_geographic_distribution()
RETURNS TABLE(region text, city text, listening_count bigint, last_activity timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gd.region,
    gd.city,
    SUM(gd.listening_count)::bigint as listening_count,
    MAX(gd.last_activity) as last_activity
  FROM public.geographic_data gd
  GROUP BY gd.region, gd.city
  ORDER BY listening_count DESC;
END;
$$;
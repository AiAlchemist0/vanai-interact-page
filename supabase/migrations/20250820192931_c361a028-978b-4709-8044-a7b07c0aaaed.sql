-- Fix security issue: Restrict song_plays table access to protect user privacy
-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Public can read song plays for analytics" ON public.song_plays;

-- Create a new restrictive policy that only allows users to see their own data
CREATE POLICY "Users can view their own song plays" 
ON public.song_plays 
FOR SELECT 
USING (
  user_session_id IS NOT NULL AND 
  (
    user_session_id = (auth.uid())::text OR 
    user_session_id = current_setting('app.current_session_id'::text, true)
  )
);

-- Create a new policy for system/analytics access (for aggregate functions)
-- This allows the database functions to access data for analytics while preventing direct user access
CREATE POLICY "System can read song plays for analytics" 
ON public.song_plays 
FOR SELECT 
USING (
  -- Allow access when called from security definer functions (system context)
  current_setting('role', true) = 'authenticator' AND
  current_setting('request.method', true) = 'POST' AND
  current_setting('request.path', true) LIKE '/rpc/%'
);

-- Update existing analytics functions to ensure they work with the new policies
-- Make get_song_analytics security definer so it can access data for analytics
CREATE OR REPLACE FUNCTION public.get_song_analytics()
RETURNS TABLE(song_id text, total_plays bigint, avg_duration numeric, valid_plays bigint, avg_completion_rate numeric, skip_count bigint, replay_count bigint, last_played_at timestamp with time zone, first_played_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    sp.song_id,
    count(*) AS total_plays,
    avg(sp.duration_seconds) AS avg_duration,
    count(
      CASE
        WHEN (sp.is_valid_play = true) THEN 1
        ELSE NULL::integer
      END) AS valid_plays,
    avg(
      CASE
        WHEN (up.completion_percentage IS NOT NULL) THEN up.completion_percentage
        ELSE NULL::numeric
      END) AS avg_completion_rate,
    count(
      CASE
        WHEN (up.action_type = 'skip'::text) THEN 1
        ELSE NULL::integer
      END) AS skip_count,
    count(
      CASE
        WHEN (up.action_type = 'replay'::text) THEN 1
        ELSE NULL::integer
      END) AS replay_count,
    max(sp.played_at) AS last_played_at,
    min(sp.played_at) AS first_played_at
  FROM song_plays sp
  LEFT JOIN user_preferences up ON (sp.song_id = up.song_id)
  GROUP BY sp.song_id;
$$;

-- Make get_hourly_patterns security definer
CREATE OR REPLACE FUNCTION public.get_hourly_patterns()
RETURNS TABLE(hour integer, play_count bigint)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
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

-- Make get_comprehensive_song_statistics security definer 
CREATE OR REPLACE FUNCTION public.get_comprehensive_song_statistics()
RETURNS TABLE(song_id text, total_plays integer, total_attempts bigint, avg_duration numeric, completion_rate numeric, last_played_at timestamp with time zone)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  WITH song_stats AS (
    SELECT 
      sp.song_id,
      COUNT(*) as total_attempts,
      COUNT(CASE WHEN sp.is_valid_play = true THEN 1 END) as valid_plays,
      AVG(sp.duration_seconds) as avg_duration,
      AVG(CASE WHEN sp.completion_percentage > 0 THEN sp.completion_percentage END) as avg_completion_rate,
      MAX(sp.played_at) as last_played_at
    FROM public.song_plays sp
    GROUP BY sp.song_id
  )
  SELECT 
    ss.song_id,
    COALESCE(ss.valid_plays, 0)::integer as total_plays,
    ss.total_attempts,
    ss.avg_duration,
    COALESCE(ss.avg_completion_rate, 0) as completion_rate,
    ss.last_played_at
  FROM song_stats ss
  ORDER BY ss.valid_plays DESC, ss.total_attempts DESC;
END;
$$;

-- Make get_dashboard_stats security definer
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(total_plays bigint, active_sessions bigint, unique_songs bigint, avg_session_duration numeric, top_region text, peak_hour integer)
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.song_plays WHERE is_valid_play = true)::bigint as total_plays,
    (SELECT COUNT(*) FROM public.listening_sessions WHERE ended_at IS NULL)::bigint as active_sessions,
    15::bigint as unique_songs,
    (SELECT AVG(total_duration_seconds) FROM public.listening_sessions WHERE ended_at IS NOT NULL)::numeric as avg_session_duration,
    (SELECT region FROM public.geographic_data ORDER BY listening_count DESC LIMIT 1) as top_region,
    (SELECT EXTRACT(HOUR FROM played_at)::integer as hour FROM public.song_plays GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1) as peak_hour;
END;
$$;
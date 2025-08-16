-- Alternative approach to fix Security Definer View issue
-- Since we can't change ownership directly, we'll recreate the view with explicit SECURITY INVOKER

-- Drop the existing view
DROP VIEW IF EXISTS public.song_analytics;

-- Create a function that returns the analytics data with SECURITY INVOKER
-- This ensures the function runs with the permissions of the calling user
CREATE OR REPLACE FUNCTION public.get_song_analytics()
RETURNS TABLE(
  song_id text,
  total_plays bigint,
  avg_duration numeric,
  valid_plays bigint,
  avg_completion_rate numeric,
  skip_count bigint,
  replay_count bigint,
  last_played_at timestamp with time zone,
  first_played_at timestamp with time zone
)
LANGUAGE sql
SECURITY INVOKER  -- This is the key - runs with caller's permissions
STABLE
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

-- Grant permissions on the function
GRANT EXECUTE ON FUNCTION public.get_song_analytics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_song_analytics() TO anon;
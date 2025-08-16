-- Drop the existing song_analytics view that has SECURITY DEFINER properties
DROP VIEW IF EXISTS public.song_analytics;

-- Recreate the view without SECURITY DEFINER (making it SECURITY INVOKER by default)
-- This ensures the view respects RLS policies of the querying user
CREATE VIEW public.song_analytics AS
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

-- Grant appropriate permissions for the view
GRANT SELECT ON public.song_analytics TO authenticated;
GRANT SELECT ON public.song_analytics TO anon;
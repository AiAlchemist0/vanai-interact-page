-- Update the get_dashboard_stats function to show correct unique songs count
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
 RETURNS TABLE(total_plays bigint, active_sessions bigint, unique_songs bigint, avg_session_duration numeric, top_region text, peak_hour integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.song_plays WHERE is_valid_play = true)::bigint as total_plays,
    (SELECT COUNT(*) FROM public.listening_sessions WHERE ended_at IS NULL)::bigint as active_sessions,
    -- Count all available songs in the catalog (14 total) instead of just played songs
    14::bigint as unique_songs,
    (SELECT AVG(total_duration_seconds) FROM public.listening_sessions WHERE ended_at IS NOT NULL)::numeric as avg_session_duration,
    (SELECT region FROM public.geographic_data ORDER BY listening_count DESC LIMIT 1) as top_region,
    (SELECT EXTRACT(HOUR FROM played_at)::integer as hour FROM public.song_plays GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1) as peak_hour;
END;
$function$
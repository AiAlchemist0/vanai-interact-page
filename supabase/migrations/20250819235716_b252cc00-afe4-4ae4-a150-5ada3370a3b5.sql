-- Add keywords for the new song "BC Coast Catalyst" by Kassandra Linklater
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
-- BC Coast Catalyst keywords
('bc-coast-catalyst', 'coast', 'location', 10),
('bc-coast-catalyst', 'catalyst', 'concept', 10),
('bc-coast-catalyst', 'transformation', 'concept', 9),
('bc-coast-catalyst', 'pacific', 'location', 8),
('bc-coast-catalyst', 'innovation', 'concept', 8),
('bc-coast-catalyst', 'mountains', 'nature', 7),
('bc-coast-catalyst', 'ocean', 'nature', 7),
('bc-coast-catalyst', 'british columbia', 'location', 9),
('bc-coast-catalyst', 'change', 'concept', 7),
('bc-coast-catalyst', 'future', 'concept', 6),
('bc-coast-catalyst', 'creativity', 'concept', 6),
('bc-coast-catalyst', 'nature', 'theme', 8),
('bc-coast-catalyst', 'kassandra linklater', 'artist', 10);

-- Update the dashboard stats function to reflect 15 total songs instead of 14
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
    -- Updated to reflect 15 total songs in the catalog
    15::bigint as unique_songs,
    (SELECT AVG(total_duration_seconds) FROM public.listening_sessions WHERE ended_at IS NOT NULL)::numeric as avg_session_duration,
    (SELECT region FROM public.geographic_data ORDER BY listening_count DESC LIMIT 1) as top_region,
    (SELECT EXTRACT(HOUR FROM played_at)::integer as hour FROM public.song_plays GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1) as peak_hour;
END;
$function$;
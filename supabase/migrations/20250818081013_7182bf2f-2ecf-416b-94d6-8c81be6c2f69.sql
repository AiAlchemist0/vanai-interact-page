-- Add completion percentage tracking to song_plays table
ALTER TABLE public.song_plays 
ADD COLUMN IF NOT EXISTS completion_percentage numeric DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_song_plays_completion ON public.song_plays(completion_percentage);

-- Update the comprehensive statistics function to include completion data
CREATE OR REPLACE FUNCTION public.get_comprehensive_song_statistics()
RETURNS TABLE(
  song_id text, 
  total_plays integer, 
  total_attempts bigint,
  avg_duration numeric,
  completion_rate numeric,
  last_played_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$
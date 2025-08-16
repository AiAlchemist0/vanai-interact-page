-- Add duration tracking to song_plays table
ALTER TABLE public.song_plays 
ADD COLUMN duration_seconds INTEGER DEFAULT 0,
ADD COLUMN is_valid_play BOOLEAN DEFAULT FALSE;

-- Create index for better performance on valid plays
CREATE INDEX idx_song_plays_valid ON public.song_plays(song_id, is_valid_play) WHERE is_valid_play = true;

-- Update the get_song_statistics function to only count valid plays
CREATE OR REPLACE FUNCTION public.get_song_statistics()
 RETURNS TABLE(song_id text, total_plays integer, last_played_at timestamp with time zone)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.song_id,
    s.total_plays,
    s.last_played_at
  FROM public.song_statistics s
  ORDER BY s.total_plays DESC;
END;
$function$

-- Update the trigger function to only count valid plays (30+ seconds)
CREATE OR REPLACE FUNCTION public.update_song_statistics()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update statistics for valid plays (30+ seconds)
  IF NEW.is_valid_play = true THEN
    INSERT INTO public.song_statistics (song_id, total_plays, last_played_at)
    VALUES (NEW.song_id, 1, NEW.played_at)
    ON CONFLICT (song_id)
    DO UPDATE SET
      total_plays = song_statistics.total_plays + 1,
      last_played_at = NEW.played_at,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$function$

-- Create trigger for the updated function
DROP TRIGGER IF EXISTS trigger_update_song_statistics ON public.song_plays;
CREATE TRIGGER trigger_update_song_statistics
AFTER INSERT OR UPDATE ON public.song_plays
FOR EACH ROW EXECUTE FUNCTION public.update_song_statistics();

-- Enable realtime for song_statistics table
ALTER TABLE public.song_statistics REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.song_statistics;
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
$function$;
-- Create function to get song like statistics
CREATE OR REPLACE FUNCTION public.get_song_like_statistics()
RETURNS TABLE(song_id text, total_likes integer, last_liked_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.song_id,
    s.total_likes,
    s.last_liked_at
  FROM public.song_like_statistics s
  ORDER BY s.total_likes DESC;
END;
$$;
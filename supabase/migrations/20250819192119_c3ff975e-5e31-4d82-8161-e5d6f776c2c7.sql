-- Create function to get song keywords
CREATE OR REPLACE FUNCTION public.get_song_keywords(p_song_id TEXT DEFAULT NULL)
RETURNS TABLE(song_id TEXT, keyword TEXT, category TEXT, relevance_score INTEGER)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF p_song_id IS NOT NULL THEN
    RETURN QUERY
    SELECT sk.song_id, sk.keyword, sk.category, sk.relevance_score
    FROM public.song_keywords sk
    WHERE sk.song_id = p_song_id
    ORDER BY sk.relevance_score DESC, sk.keyword;
  ELSE
    RETURN QUERY
    SELECT sk.song_id, sk.keyword, sk.category, sk.relevance_score
    FROM public.song_keywords sk
    ORDER BY sk.song_id, sk.relevance_score DESC, sk.keyword;
  END IF;
END;
$function$
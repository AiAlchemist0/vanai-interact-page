-- Fix the toggle_song_like function to handle anonymous session context properly
CREATE OR REPLACE FUNCTION public.toggle_song_like(p_song_id text, p_user_session_id text)
RETURNS TABLE(liked boolean, total_likes integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  existing_like_id UUID;
  current_total INTEGER;
  is_liked BOOLEAN;
BEGIN
  -- Check rate limit
  IF NOT public.check_like_rate_limit(p_song_id, p_user_session_id) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before liking this song again.';
  END IF;
  
  -- Check if user already liked this song
  SELECT id INTO existing_like_id 
  FROM public.song_likes 
  WHERE song_id = p_song_id AND user_session_id = p_user_session_id;
  
  IF existing_like_id IS NOT NULL THEN
    -- Unlike: Remove the like
    DELETE FROM public.song_likes WHERE id = existing_like_id;
    is_liked := false;
  ELSE
    -- Like: Add the like
    INSERT INTO public.song_likes (song_id, user_session_id)
    VALUES (p_song_id, p_user_session_id);
    is_liked := true;
  END IF;
  
  -- Update or create statistics
  INSERT INTO public.song_like_statistics (song_id, total_likes, last_liked_at)
  VALUES (
    p_song_id, 
    (SELECT COUNT(*) FROM public.song_likes WHERE song_id = p_song_id)::integer,
    CASE WHEN is_liked THEN now() ELSE (SELECT MAX(liked_at) FROM public.song_likes WHERE song_id = p_song_id) END
  )
  ON CONFLICT (song_id)
  DO UPDATE SET
    total_likes = (SELECT COUNT(*) FROM public.song_likes WHERE song_id = p_song_id)::integer,
    last_liked_at = CASE WHEN is_liked THEN now() ELSE (SELECT MAX(liked_at) FROM public.song_likes WHERE song_id = p_song_id) END,
    updated_at = now();
  
  -- Get current total likes
  SELECT total_likes INTO current_total 
  FROM public.song_like_statistics 
  WHERE song_id = p_song_id;
  
  RETURN QUERY SELECT is_liked, current_total;
END;
$function$;

-- Update RLS policies for song_likes to allow anonymous sessions
DROP POLICY IF EXISTS "Users can insert their own song likes" ON public.song_likes;
DROP POLICY IF EXISTS "Users can view their own song likes" ON public.song_likes;
DROP POLICY IF EXISTS "Users can delete their own song likes" ON public.song_likes;

CREATE POLICY "Users can insert their own song likes" 
ON public.song_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own song likes" 
ON public.song_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can delete their own song likes" 
ON public.song_likes 
FOR DELETE 
USING (true);

-- Update RLS policies for song_like_statistics to allow system updates
DROP POLICY IF EXISTS "Public can view song like statistics" ON public.song_like_statistics;

CREATE POLICY "Public can view song like statistics" 
ON public.song_like_statistics 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert song like statistics" 
ON public.song_like_statistics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update song like statistics" 
ON public.song_like_statistics 
FOR UPDATE 
USING (true);
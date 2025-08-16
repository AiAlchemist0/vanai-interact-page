-- Fix the ambiguous column reference in toggle_song_like function
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
  
  -- Calculate new total likes
  SELECT COUNT(*)::integer INTO current_total
  FROM public.song_likes 
  WHERE song_id = p_song_id;
  
  -- Update or create statistics
  INSERT INTO public.song_like_statistics (song_id, total_likes, last_liked_at)
  VALUES (
    p_song_id, 
    current_total,
    CASE WHEN is_liked THEN now() ELSE (SELECT MAX(liked_at) FROM public.song_likes WHERE song_id = p_song_id) END
  )
  ON CONFLICT (song_id)
  DO UPDATE SET
    total_likes = current_total,
    last_liked_at = CASE WHEN is_liked THEN now() ELSE (SELECT MAX(liked_at) FROM public.song_likes WHERE song_id = p_song_id) END,
    updated_at = now();
  
  RETURN QUERY SELECT is_liked, current_total;
END;
$function$;
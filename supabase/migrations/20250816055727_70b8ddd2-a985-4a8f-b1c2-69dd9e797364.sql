-- Create function to toggle song likes
CREATE OR REPLACE FUNCTION public.toggle_song_like(p_song_id text, p_user_session_id text)
RETURNS TABLE(liked boolean, total_likes integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_like_id UUID;
  current_total INTEGER;
  is_liked BOOLEAN;
BEGIN
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
$$;
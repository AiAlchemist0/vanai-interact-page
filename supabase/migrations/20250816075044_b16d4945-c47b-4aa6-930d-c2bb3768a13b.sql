-- Phase 1: Critical Data Privacy Protection
-- Fix RLS policies to protect user data

-- 1. Update listening_sessions policies to be user-specific
DROP POLICY IF EXISTS "Public can view listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Public can insert listening sessions" ON public.listening_sessions;

CREATE POLICY "Users can view their own listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can insert their own listening sessions" 
ON public.listening_sessions 
FOR INSERT 
WITH CHECK (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can update their own listening sessions" 
ON public.listening_sessions 
FOR UPDATE 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

-- 2. Update user_preferences policies to be user-specific
DROP POLICY IF EXISTS "Public can view user preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Public can insert user preferences" ON public.user_preferences;

CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can insert their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

-- 3. Update song_likes policies to be user-specific
DROP POLICY IF EXISTS "Public can view song likes" ON public.song_likes;
DROP POLICY IF EXISTS "Public can insert song likes" ON public.song_likes;
DROP POLICY IF EXISTS "Public can delete song likes" ON public.song_likes;

CREATE POLICY "Users can view their own song likes" 
ON public.song_likes 
FOR SELECT 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can insert their own song likes" 
ON public.song_likes 
FOR INSERT 
WITH CHECK (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

CREATE POLICY "Users can delete their own song likes" 
ON public.song_likes 
FOR DELETE 
USING (user_session_id = auth.uid()::text OR user_session_id = current_setting('app.current_session_id', true));

-- 4. Update geographic_data to be session-specific (aggregate data should be anonymous)
DROP POLICY IF EXISTS "Public can view geographic data" ON public.geographic_data;
DROP POLICY IF EXISTS "Public can insert geographic data" ON public.geographic_data;

CREATE POLICY "Anyone can view aggregated geographic data" 
ON public.geographic_data 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert geographic data" 
ON public.geographic_data 
FOR INSERT 
WITH CHECK (true);

-- 5. Add rate limiting and spam prevention for song likes
CREATE OR REPLACE FUNCTION public.check_like_rate_limit(p_song_id text, p_user_session_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recent_likes_count INTEGER;
BEGIN
  -- Check if user has liked this song more than 5 times in the last hour
  SELECT COUNT(*) INTO recent_likes_count
  FROM public.song_likes
  WHERE song_id = p_song_id 
    AND user_session_id = p_user_session_id
    AND liked_at > now() - interval '1 hour';
  
  RETURN recent_likes_count < 5;
END;
$$;

-- Update the toggle_song_like function to include rate limiting
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
$$;
-- Create song_likes table to track individual likes
CREATE TABLE public.song_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  user_session_id TEXT NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(song_id, user_session_id)
);

-- Create song_like_statistics table for aggregated like counts
CREATE TABLE public.song_like_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL UNIQUE,
  total_likes INTEGER NOT NULL DEFAULT 0,
  last_liked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_like_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Public can view song likes" 
ON public.song_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert song likes" 
ON public.song_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can delete song likes" 
ON public.song_likes 
FOR DELETE 
USING (true);

CREATE POLICY "Public can view song like statistics" 
ON public.song_like_statistics 
FOR SELECT 
USING (true);

-- Create function to get song like statistics
CREATE OR REPLACE FUNCTION public.get_song_like_statistics()
RETURNS TABLE(song_id text, total_likes integer, last_liked_at timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.song_id,
    s.total_likes,
    s.last_liked_at
  FROM public.song_like_statistics s
  ORDER BY s.total_likes DESC;
END;
$function$

-- Create function to toggle song likes
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
$function$

-- Create trigger function to update like statistics
CREATE OR REPLACE FUNCTION public.update_song_like_statistics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.song_like_statistics (song_id, total_likes, last_liked_at)
    VALUES (NEW.song_id, 1, NEW.liked_at)
    ON CONFLICT (song_id)
    DO UPDATE SET
      total_likes = song_like_statistics.total_likes + 1,
      last_liked_at = NEW.liked_at,
      updated_at = now();
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.song_like_statistics
    SET 
      total_likes = GREATEST(0, total_likes - 1),
      last_liked_at = (SELECT MAX(liked_at) FROM public.song_likes WHERE song_id = OLD.song_id),
      updated_at = now()
    WHERE song_id = OLD.song_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic statistics updates
CREATE TRIGGER trigger_update_song_like_statistics_insert
AFTER INSERT ON public.song_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_song_like_statistics();

CREATE TRIGGER trigger_update_song_like_statistics_delete
AFTER DELETE ON public.song_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_song_like_statistics();
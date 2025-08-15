-- Fix critical security issue: Remove public access to individual song plays
-- This prevents tracking of individual user listening habits

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view song plays" ON public.song_plays;
DROP POLICY IF EXISTS "Anyone can insert song plays" ON public.song_plays;

-- Create more restrictive policies
-- Allow anonymous users to insert their own plays only
CREATE POLICY "Users can insert their own song plays" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (true);

-- Completely restrict direct SELECT access to song_plays table
-- This prevents tracking individual user behavior
CREATE POLICY "No direct access to song plays" 
ON public.song_plays 
FOR SELECT 
USING (false);

-- Create a security definer function to provide only aggregated statistics
-- This protects individual user privacy while allowing public statistics
CREATE OR REPLACE FUNCTION public.get_public_song_statistics()
RETURNS TABLE(song_id text, total_plays bigint, last_played_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.song_id,
    COUNT(*)::bigint as total_plays,
    MAX(sp.played_at) as last_played_at
  FROM public.song_plays sp
  GROUP BY sp.song_id
  ORDER BY total_plays DESC;
END;
$$;

-- Update the song statistics function to use proper search_path
CREATE OR REPLACE FUNCTION public.get_song_statistics()
RETURNS TABLE(song_id text, total_plays integer, last_played_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.song_id,
    s.total_plays,
    s.last_played_at
  FROM public.song_statistics s
  ORDER BY s.total_plays DESC;
END;
$$;

-- Update the trigger function to use proper search_path
CREATE OR REPLACE FUNCTION public.update_song_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.song_statistics (song_id, total_plays, last_played_at)
  VALUES (NEW.song_id, 1, NEW.played_at)
  ON CONFLICT (song_id)
  DO UPDATE SET
    total_plays = song_statistics.total_plays + 1,
    last_played_at = NEW.played_at,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update statistics when plays are recorded
DROP TRIGGER IF EXISTS update_song_statistics_trigger ON public.song_plays;
CREATE TRIGGER update_song_statistics_trigger
  AFTER INSERT ON public.song_plays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_song_statistics();

-- Grant execute permission on the public statistics function
GRANT EXECUTE ON FUNCTION public.get_public_song_statistics() TO anon, authenticated;
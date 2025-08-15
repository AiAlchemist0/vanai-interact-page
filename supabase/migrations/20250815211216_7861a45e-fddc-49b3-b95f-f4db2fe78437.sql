-- Fix critical security vulnerability: Restrict song_statistics write access
-- Only allow system triggers to modify statistics, prevent manual manipulation

-- Drop existing permissive policies on song_statistics
DROP POLICY IF EXISTS "Anyone can insert song statistics" ON public.song_statistics;
DROP POLICY IF EXISTS "Anyone can update song statistics" ON public.song_statistics;

-- Keep read access public (statistics should be viewable by everyone)
-- The existing "Anyone can view song statistics" policy remains

-- Create restrictive policies that only allow system operations
-- No INSERT policy = only triggers/functions can insert
-- No UPDATE policy = only triggers/functions can update

-- Update the trigger function to run with elevated privileges
-- This allows the trigger to bypass RLS and modify song_statistics
CREATE OR REPLACE FUNCTION public.update_song_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update song statistics with elevated privileges
  -- This bypasses RLS since it's SECURITY DEFINER
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

-- Ensure the trigger is properly configured
DROP TRIGGER IF EXISTS update_song_statistics_trigger ON public.song_plays;
CREATE TRIGGER update_song_statistics_trigger
  AFTER INSERT ON public.song_plays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_song_statistics();

-- Add a comment to document the security model
COMMENT ON TABLE public.song_statistics IS 'Song play statistics. Write access restricted to system triggers only to prevent manipulation.';
COMMENT ON FUNCTION public.update_song_statistics() IS 'System function to update song statistics. Runs with elevated privileges to bypass RLS.';
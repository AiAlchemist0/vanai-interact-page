-- Fix RLS policies for song_plays to allow anonymous song tracking
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Public can insert song plays" ON public.song_plays;
DROP POLICY IF EXISTS "Public can update song plays" ON public.song_plays;

-- Create new policies that properly allow anonymous tracking
CREATE POLICY "Allow anonymous song play tracking" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updates to own song play records" 
ON public.song_plays 
FOR UPDATE 
USING (true);
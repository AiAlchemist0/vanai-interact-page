-- Fix RLS policies for song_plays table to allow proper analytics access

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "System can read song plays for analytics" ON public.song_plays;

-- Create a new SELECT policy that allows reading for analytics
CREATE POLICY "Public can read song plays for analytics" 
ON public.song_plays 
FOR SELECT 
USING (true);

-- Update the INSERT policy to be more explicit about session handling
DROP POLICY IF EXISTS "Anyone can insert song plays" ON public.song_plays;

CREATE POLICY "Public can insert song plays" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (true);

-- Also allow UPDATE for completing play tracking
CREATE POLICY "Public can update song plays" 
ON public.song_plays 
FOR UPDATE 
USING (true);

-- Fix geographic_data policies for better access
DROP POLICY IF EXISTS "System can view geographic data for analytics" ON public.geographic_data;

CREATE POLICY "Public can view geographic data for analytics" 
ON public.geographic_data 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "System can insert geographic data" ON public.geographic_data;

CREATE POLICY "Public can insert geographic data" 
ON public.geographic_data 
FOR INSERT 
WITH CHECK (true);

-- Add UPDATE policy for geographic data
CREATE POLICY "Public can update geographic data" 
ON public.geographic_data 
FOR UPDATE 
USING (true);
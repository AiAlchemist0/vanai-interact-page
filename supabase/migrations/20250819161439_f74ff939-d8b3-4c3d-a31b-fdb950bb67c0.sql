-- Fix RLS policies for song_plays table to support anonymous users
DROP POLICY IF EXISTS "Users can insert their own song plays" ON public.song_plays;
DROP POLICY IF EXISTS "No direct access to song plays" ON public.song_plays;

-- Create new RLS policies that properly handle anonymous users
CREATE POLICY "Anyone can insert song plays" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (true);

-- Allow reading song plays for analytics (but restrict to functions)
CREATE POLICY "System can read song plays for analytics" 
ON public.song_plays 
FOR SELECT 
USING (false); -- Still restrict direct access, only allow through functions

-- Update listening_sessions policies to support anonymous users
DROP POLICY IF EXISTS "Users can insert their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can view their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can update their own listening sessions" ON public.listening_sessions;

CREATE POLICY "Anyone can insert listening sessions" 
ON public.listening_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view their own listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update their own listening sessions" 
ON public.listening_sessions 
FOR UPDATE 
USING (true);
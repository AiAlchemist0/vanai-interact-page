-- Fix RLS policy for anonymous song tracking
-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Enable anonymous song tracking" ON public.song_plays;

-- Create a new INSERT policy that allows anonymous tracking with session IDs
CREATE POLICY "Allow anonymous song tracking with session" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (
  user_session_id IS NOT NULL AND 
  LENGTH(user_session_id) > 0
);

-- Update the SELECT policy to be more permissive for analytics
DROP POLICY IF EXISTS "Enable reading own plays" ON public.song_plays;
DROP POLICY IF EXISTS "Enable analytics access" ON public.song_plays;

-- Create a unified SELECT policy for both user access and analytics
CREATE POLICY "Enable reading song plays" 
ON public.song_plays 
FOR SELECT 
USING (
  -- Allow users to see their own plays
  (user_session_id IS NOT NULL AND user_session_id = COALESCE((auth.uid())::text, current_setting('app.current_session_id'::text, true)))
  OR
  -- Allow analytics access (aggregate queries)
  (current_setting('role'::text, true) = 'authenticator')
);
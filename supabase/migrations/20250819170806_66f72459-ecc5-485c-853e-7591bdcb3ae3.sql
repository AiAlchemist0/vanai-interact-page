-- Fix security issue: Restrict song_likes table access to user's own data only
-- Currently anyone can read all song likes, which violates user privacy

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own song likes" ON public.song_likes;

-- Create a new restrictive SELECT policy that only allows users to see their own likes
CREATE POLICY "Users can view only their own song likes" 
ON public.song_likes 
FOR SELECT 
USING (
  -- Allow access if the user_session_id matches either:
  -- 1. The authenticated user's ID (for logged-in users)
  -- 2. The current session ID setting (for anonymous users)
  (user_session_id = (auth.uid())::text) OR 
  (user_session_id = current_setting('app.current_session_id'::text, true))
);

-- Also update the INSERT policy to use the same pattern for consistency
DROP POLICY IF EXISTS "Users can insert their own song likes" ON public.song_likes;

CREATE POLICY "Users can insert only their own song likes" 
ON public.song_likes 
FOR INSERT 
WITH CHECK (
  (user_session_id = (auth.uid())::text) OR 
  (user_session_id = current_setting('app.current_session_id'::text, true))
);

-- Update the DELETE policy to use the same pattern for consistency
DROP POLICY IF EXISTS "Users can delete their own song likes" ON public.song_likes;

CREATE POLICY "Users can delete only their own song likes" 
ON public.song_likes 
FOR DELETE 
USING (
  (user_session_id = (auth.uid())::text) OR 
  (user_session_id = current_setting('app.current_session_id'::text, true))
);
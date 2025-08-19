-- Fix security vulnerability in listening_sessions table
-- The current SELECT policy allows anyone to view all listening sessions
-- This should be restricted to only allow users to view their own sessions

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view their own listening sessions" ON public.listening_sessions;

-- Create a properly restrictive SELECT policy that only allows users to view their own sessions
CREATE POLICY "Users can view only their own listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (
  (user_session_id = (auth.uid())::text) OR 
  (user_session_id = current_setting('app.current_session_id'::text, true))
);

-- Also update the UPDATE policy to use the same pattern for consistency
DROP POLICY IF EXISTS "Anyone can update their own listening sessions" ON public.listening_sessions;

CREATE POLICY "Users can update only their own listening sessions" 
ON public.listening_sessions 
FOR UPDATE 
USING (
  (user_session_id = (auth.uid())::text) OR 
  (user_session_id = current_setting('app.current_session_id'::text, true))
);
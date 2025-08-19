-- Fix RLS policies for listening_sessions to handle the actual session ID format
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can insert their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can update their own listening sessions" ON public.listening_sessions;

-- Create new policies that support both authenticated and anonymous users with proper session ID pattern
CREATE POLICY "Users can view their own listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow anonymous access (any unauthenticated user can view sessions they create)
  (auth.uid() IS NULL)
);

CREATE POLICY "Users can insert their own listening sessions" 
ON public.listening_sessions 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow anonymous inserts (any unauthenticated user can create sessions)
  (auth.uid() IS NULL)
);

CREATE POLICY "Users can update their own listening sessions" 
ON public.listening_sessions 
FOR UPDATE 
USING (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow anonymous updates (any unauthenticated user can update sessions)
  (auth.uid() IS NULL)
);
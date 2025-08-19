-- Update RLS policies for listening_sessions to support anonymous users
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can insert their own listening sessions" ON public.listening_sessions;
DROP POLICY IF EXISTS "Users can update their own listening sessions" ON public.listening_sessions;

-- Create new policies that support both authenticated and anonymous users
CREATE POLICY "Users can view their own listening sessions" 
ON public.listening_sessions 
FOR SELECT 
USING (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow if session ID follows anonymous pattern (session_timestamp_randomstring)
  (auth.uid() IS NULL AND user_session_id ~ '^session_[0-9]+_[a-z0-9]+$')
);

CREATE POLICY "Users can insert their own listening sessions" 
ON public.listening_sessions 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow if session ID follows anonymous pattern (session_timestamp_randomstring)
  (auth.uid() IS NULL AND user_session_id ~ '^session_[0-9]+_[a-z0-9]+$')
);

CREATE POLICY "Users can update their own listening sessions" 
ON public.listening_sessions 
FOR UPDATE 
USING (
  -- Allow if user is authenticated and owns the session
  (auth.uid() IS NOT NULL AND user_session_id = (auth.uid())::text) 
  OR 
  -- Allow if session ID follows anonymous pattern (session_timestamp_randomstring)
  (auth.uid() IS NULL AND user_session_id ~ '^session_[0-9]+_[a-z0-9]+$')
);
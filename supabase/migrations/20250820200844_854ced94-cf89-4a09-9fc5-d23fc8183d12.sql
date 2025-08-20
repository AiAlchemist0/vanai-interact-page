-- Ensure anonymous users can insert song plays
-- First, check if RLS is properly enabled
ALTER TABLE public.song_plays ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous song play tracking" ON public.song_plays;
DROP POLICY IF EXISTS "Allow updates to own song play records" ON public.song_plays;
DROP POLICY IF EXISTS "Users can view their own song plays" ON public.song_plays;
DROP POLICY IF EXISTS "System can read song plays for analytics" ON public.song_plays;

-- Create comprehensive policies for anonymous tracking
CREATE POLICY "Enable anonymous song tracking" 
ON public.song_plays 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Enable song play updates" 
ON public.song_plays 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Enable reading own plays" 
ON public.song_plays 
FOR SELECT 
TO public 
USING (
  user_session_id IS NOT NULL AND (
    user_session_id = coalesce(auth.uid()::text, current_setting('app.current_session_id', true))
  )
);

CREATE POLICY "Enable analytics access" 
ON public.song_plays 
FOR SELECT 
TO public 
USING (
  current_setting('role', true) = 'authenticator' AND 
  current_setting('request.method', true) = 'POST' AND 
  current_setting('request.path', true) LIKE '/rpc/%'
);
-- Drop all existing policies on song_plays to start fresh
DROP POLICY IF EXISTS "Enable anonymous song tracking" ON public.song_plays;
DROP POLICY IF EXISTS "Allow anonymous song tracking with session" ON public.song_plays;
DROP POLICY IF EXISTS "Enable song play updates" ON public.song_plays;
DROP POLICY IF EXISTS "Enable reading own plays" ON public.song_plays;
DROP POLICY IF EXISTS "Enable analytics access" ON public.song_plays;

-- Create simple and effective policies
-- 1. Allow INSERT for any session with a valid session ID
CREATE POLICY "Allow song tracking" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (
  user_session_id IS NOT NULL AND 
  LENGTH(user_session_id) > 0
);

-- 2. Allow UPDATE for existing records
CREATE POLICY "Allow song tracking updates" 
ON public.song_plays 
FOR UPDATE 
USING (true);

-- 3. Allow SELECT for analytics and user access
CREATE POLICY "Allow song tracking reads" 
ON public.song_plays 
FOR SELECT 
USING (true);
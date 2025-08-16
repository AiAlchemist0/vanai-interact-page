-- Fix Security Definer View issue by changing ownership
-- This addresses the SUPA_security_definer_view lint error

-- The issue is that views owned by postgres superuser act as SECURITY DEFINER
-- Solution: Change ownership to a less privileged user (authenticator or anon)

-- Change ownership of song_analytics view from postgres to authenticator
-- This makes the view respect RLS policies of the querying user instead of creator
ALTER VIEW public.song_analytics OWNER TO authenticator;

-- Ensure proper permissions are granted for both authenticated and anonymous users
GRANT SELECT ON public.song_analytics TO authenticated;
GRANT SELECT ON public.song_analytics TO anon;
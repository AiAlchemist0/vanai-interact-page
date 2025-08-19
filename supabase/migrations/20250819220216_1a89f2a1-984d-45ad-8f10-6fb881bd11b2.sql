-- Fix security vulnerability in geographic_data table
-- The current SELECT policy allows anyone to view all geographic data
-- This should be restricted to protect user location privacy

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view aggregated geographic data" ON public.geographic_data;

-- Create a restrictive policy that only allows system access to raw geographic data
-- Public access should go through the secure get_geographic_distribution() function instead
CREATE POLICY "System can view geographic data for analytics" 
ON public.geographic_data 
FOR SELECT 
USING (false); -- No direct public access to raw geographic data

-- Ensure the get_geographic_distribution() function can still access the data
-- by updating it to be a SECURITY DEFINER function (if not already)
CREATE OR REPLACE FUNCTION public.get_geographic_distribution()
RETURNS TABLE(region text, city text, listening_count bigint, last_activity timestamp with time zone)
LANGUAGE plpgsql
STABLE SECURITY DEFINER -- This allows the function to bypass RLS
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gd.region,
    gd.city,
    SUM(gd.listening_count)::bigint as listening_count,
    MAX(gd.last_activity) as last_activity
  FROM public.geographic_data gd
  GROUP BY gd.region, gd.city
  ORDER BY listening_count DESC;
END;
$$;

-- Create a more privacy-friendly function that provides only broad regional data
CREATE OR REPLACE FUNCTION public.get_regional_summary()
RETURNS TABLE(region text, total_listening_count bigint, active_cities bigint)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gd.region,
    SUM(gd.listening_count)::bigint as total_listening_count,
    COUNT(DISTINCT gd.city)::bigint as active_cities
  FROM public.geographic_data gd
  WHERE gd.region IS NOT NULL
  GROUP BY gd.region
  ORDER BY total_listening_count DESC;
END;
$$;
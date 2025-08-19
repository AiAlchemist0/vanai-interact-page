-- Create function to get keyword analytics
CREATE OR REPLACE FUNCTION public.get_keyword_analytics()
RETURNS TABLE(category TEXT, keyword_count BIGINT, total_relevance BIGINT, avg_relevance NUMERIC)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sk.category,
    COUNT(*)::BIGINT as keyword_count,
    SUM(sk.relevance_score)::BIGINT as total_relevance,
    AVG(sk.relevance_score) as avg_relevance
  FROM public.song_keywords sk
  GROUP BY sk.category
  ORDER BY total_relevance DESC;
END;
$function$
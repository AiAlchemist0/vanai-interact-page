-- Create song_keywords table for thematic keyword analysis
CREATE TABLE public.song_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  category TEXT NOT NULL,
  relevance_score INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.song_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for song_keywords
CREATE POLICY "Public can view song keywords" 
ON public.song_keywords 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert song keywords" 
ON public.song_keywords 
FOR INSERT 
WITH CHECK (true);

-- Insert keywords for "Circles in the AI Glow" by Kris Krüg & BC + AI Crew
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
-- AI Experience keywords
('circles-in-the-ai-glow', 'Vancouver AI Community', 'AI Experience', 10),
('circles-in-the-ai-glow', 'Human++', 'AI Experience', 9),
('circles-in-the-ai-glow', 'TheUpgrade.ai', 'AI Experience', 8),
('circles-in-the-ai-glow', 'Sandboxing AI', 'AI Experience', 8),
('circles-in-the-ai-glow', 'bots take the stage', 'AI Experience', 7),
('circles-in-the-ai-glow', 'digital land', 'AI Experience', 6),
('circles-in-the-ai-glow', 'machine''s cold glow', 'AI Experience', 7),

-- Creative Impact keywords  
('circles-in-the-ai-glow', 'artist soul questioning', 'Creative Impact', 10),
('circles-in-the-ai-glow', 'AI paint my dreams', 'Creative Impact', 9),
('circles-in-the-ai-glow', 'steal my brush', 'Creative Impact', 8),
('circles-in-the-ai-glow', 'code steals the art', 'Creative Impact', 8),
('circles-in-the-ai-glow', 'human touch fading', 'Creative Impact', 7),
('circles-in-the-ai-glow', 'just a tool', 'Creative Impact', 6),

-- Future Vision keywords
('circles-in-the-ai-glow', 'uncertainty creeping', 'Future Vision', 8),
('circles-in-the-ai-glow', 'fear in the air', 'Future Vision', 7),
('circles-in-the-ai-glow', 'optimism sparkling', 'Future Vision', 9),
('circles-in-the-ai-glow', 'enthusiasm everywhere', 'Future Vision', 8),
('circles-in-the-ai-glow', 'hope dancing', 'Future Vision', 7),
('circles-in-the-ai-glow', 'embrace the unknown', 'Future Vision', 8),

-- Relationships keywords
('circles-in-the-ai-glow', 'choose a bot over real heart', 'Relationships', 10),
('circles-in-the-ai-glow', 'relationships glitching', 'Relationships', 9),
('circles-in-the-ai-glow', 'loving a program', 'Relationships', 8),
('circles-in-the-ai-glow', 'AI loves better', 'Relationships', 7),
('circles-in-the-ai-glow', 'never breaks your heart', 'Relationships', 6),
('circles-in-the-ai-glow', 'deepfake faces', 'Relationships', 8),

-- Community keywords
('circles-in-the-ai-glow', 'bringing us close', 'Community', 9),
('circles-in-the-ai-glow', 'connecting the crew', 'Community', 8),
('circles-in-the-ai-glow', 'making the circle full', 'Community', 8),
('circles-in-the-ai-glow', 'unite', 'Community', 7),
('circles-in-the-ai-glow', 'not alone', 'Community', 6),
('circles-in-the-ai-glow', 'gathering the crew', 'Community', 7),

-- Identity keywords
('circles-in-the-ai-glow', 'what it mean to be human', 'Identity', 10),
('circles-in-the-ai-glow', 'humanity''s vibe', 'Identity', 9),
('circles-in-the-ai-glow', 'real or just pixels', 'Identity', 8),
('circles-in-the-ai-glow', 'humanity''s the start', 'Identity', 8),
('circles-in-the-ai-glow', 'human forever', 'Identity', 7),
('circles-in-the-ai-glow', 'pulse of the stream', 'Identity', 6);

-- Create function to get song keywords
CREATE OR REPLACE FUNCTION public.get_song_keywords(p_song_id TEXT DEFAULT NULL)
RETURNS TABLE(song_id TEXT, keyword TEXT, category TEXT, relevance_score INTEGER)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF p_song_id IS NOT NULL THEN
    RETURN QUERY
    SELECT sk.song_id, sk.keyword, sk.category, sk.relevance_score
    FROM public.song_keywords sk
    WHERE sk.song_id = p_song_id
    ORDER BY sk.relevance_score DESC, sk.keyword;
  ELSE
    RETURN QUERY
    SELECT sk.song_id, sk.keyword, sk.category, sk.relevance_score
    FROM public.song_keywords sk
    ORDER BY sk.song_id, sk.relevance_score DESC, sk.keyword;
  END IF;
END;
$function$

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
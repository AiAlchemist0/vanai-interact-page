-- Create song keywords table to store thematic keywords for each song
CREATE TABLE public.song_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  category TEXT NOT NULL, -- survey theme category
  relevance_score INTEGER DEFAULT 1, -- 1-5 scale for keyword relevance
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on song keywords
ALTER TABLE public.song_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies for song keywords
CREATE POLICY "Public can view song keywords"
ON public.song_keywords
FOR SELECT
USING (true);

CREATE POLICY "System can insert song keywords"
ON public.song_keywords
FOR INSERT
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_song_keywords_song_id ON public.song_keywords(song_id);
CREATE INDEX idx_song_keywords_category ON public.song_keywords(category);

-- Insert Kris Krug song keywords based on lyrics analysis
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
-- AI Experience keywords
('deepfakes-in-the-rain', 'Vancouver AI Community', 'AI Experience', 5),
('deepfakes-in-the-rain', 'Sandboxing AI', 'AI Experience', 4),
('deepfakes-in-the-rain', 'TheUpgrade.ai', 'AI Experience', 4),
('deepfakes-in-the-rain', 'META CREATION Lab', 'AI Experience', 3),
('deepfakes-in-the-rain', 'BC AI Ecosystem', 'AI Experience', 4),

-- Creative Impact keywords
('deepfakes-in-the-rain', 'Artist soul', 'Creative Impact', 5),
('deepfakes-in-the-rain', 'AI paint my dreams', 'Creative Impact', 5),
('deepfakes-in-the-rain', 'steal my brush', 'Creative Impact', 4),
('deepfakes-in-the-rain', 'code steals the art', 'Creative Impact', 4),
('deepfakes-in-the-rain', 'Human touch fading', 'Creative Impact', 3),

-- Future Vision keywords
('deepfakes-in-the-rain', 'Optimism', 'Future Vision', 4),
('deepfakes-in-the-rain', 'Enthusiasm', 'Future Vision', 4),
('deepfakes-in-the-rain', 'Fear', 'Future Vision', 3),
('deepfakes-in-the-rain', 'Hope', 'Future Vision', 4),
('deepfakes-in-the-rain', 'Uncertainty', 'Future Vision', 3),

-- Relationships keywords
('deepfakes-in-the-rain', 'Lovin a program', 'Relationships', 5),
('deepfakes-in-the-rain', 'choose a bot over real heart', 'Relationships', 5),
('deepfakes-in-the-rain', 'AI loves better', 'Relationships', 4),
('deepfakes-in-the-rain', 'never breaks your heart', 'Relationships', 3),

-- Technology keywords
('deepfakes-in-the-rain', 'Deepfake', 'Technology', 5),
('deepfakes-in-the-rain', 'Human++', 'Technology', 4),
('deepfakes-in-the-rain', 'Bots take the stage', 'Technology', 4),
('deepfakes-in-the-rain', 'digital land', 'Technology', 3),
('deepfakes-in-the-rain', 'machines cold glow', 'Technology', 3),

-- Community keywords
('deepfakes-in-the-rain', 'Unity', 'Community', 4),
('deepfakes-in-the-rain', 'connectin the crew', 'Community', 4),
('deepfakes-in-the-rain', 'circle full', 'Community', 4),
('deepfakes-in-the-rain', 'Bringin us close', 'Community', 4),
('deepfakes-in-the-rain', 'Vancouver beat', 'Community', 3);

-- Create function to get song keywords
CREATE OR REPLACE FUNCTION public.get_song_keywords(p_song_id text DEFAULT NULL)
RETURNS TABLE(song_id text, keyword text, category text, relevance_score integer)
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
$function$;

-- Create function to get keyword statistics
CREATE OR REPLACE FUNCTION public.get_keyword_analytics()
RETURNS TABLE(category text, keyword_count bigint, total_relevance bigint, avg_relevance numeric)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    sk.category,
    COUNT(*)::bigint as keyword_count,
    SUM(sk.relevance_score)::bigint as total_relevance,
    AVG(sk.relevance_score) as avg_relevance
  FROM public.song_keywords sk
  GROUP BY sk.category
  ORDER BY total_relevance DESC;
END;
$function$;
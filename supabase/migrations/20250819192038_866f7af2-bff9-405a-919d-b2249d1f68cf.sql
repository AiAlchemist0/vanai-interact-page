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
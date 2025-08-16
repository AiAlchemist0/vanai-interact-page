-- Create song_likes table to track individual likes
CREATE TABLE public.song_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  user_session_id TEXT NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(song_id, user_session_id)
);

-- Create song_like_statistics table for aggregated like counts
CREATE TABLE public.song_like_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL UNIQUE,
  total_likes INTEGER NOT NULL DEFAULT 0,
  last_liked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_like_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access
CREATE POLICY "Public can view song likes" 
ON public.song_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert song likes" 
ON public.song_likes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can delete song likes" 
ON public.song_likes 
FOR DELETE 
USING (true);

CREATE POLICY "Public can view song like statistics" 
ON public.song_like_statistics 
FOR SELECT 
USING (true);
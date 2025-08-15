-- Create song_plays table to track individual play events
CREATE TABLE public.song_plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_session_id TEXT, -- Track anonymous sessions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create song_statistics table for aggregated play counts
CREATE TABLE public.song_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  song_id TEXT NOT NULL UNIQUE,
  total_plays INTEGER NOT NULL DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.song_plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for this app)
CREATE POLICY "Anyone can view song plays" 
ON public.song_plays 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert song plays" 
ON public.song_plays 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view song statistics" 
ON public.song_statistics 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert song statistics" 
ON public.song_statistics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update song statistics" 
ON public.song_statistics 
FOR UPDATE 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_song_plays_song_id ON public.song_plays(song_id);
CREATE INDEX idx_song_plays_played_at ON public.song_plays(played_at);
CREATE INDEX idx_song_statistics_song_id ON public.song_statistics(song_id);

-- Create function to update statistics when a play is recorded
CREATE OR REPLACE FUNCTION public.update_song_statistics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.song_statistics (song_id, total_plays, last_played_at)
  VALUES (NEW.song_id, 1, NEW.played_at)
  ON CONFLICT (song_id)
  DO UPDATE SET
    total_plays = song_statistics.total_plays + 1,
    last_played_at = NEW.played_at,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update statistics
CREATE TRIGGER update_song_statistics_trigger
  AFTER INSERT ON public.song_plays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_song_statistics();

-- Create function to get song statistics
CREATE OR REPLACE FUNCTION public.get_song_statistics()
RETURNS TABLE (
  song_id TEXT,
  total_plays INTEGER,
  last_played_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.song_id,
    s.total_plays,
    s.last_played_at
  FROM public.song_statistics s
  ORDER BY s.total_plays DESC;
END;
$$ LANGUAGE plpgsql;
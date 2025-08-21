-- Enable RLS for song_keywords table (it was missing RLS despite having policies)
ALTER TABLE public.song_keywords ENABLE ROW LEVEL SECURITY;
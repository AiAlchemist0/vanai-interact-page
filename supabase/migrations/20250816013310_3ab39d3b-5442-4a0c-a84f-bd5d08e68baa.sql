-- Add duration tracking columns to song_plays table
ALTER TABLE public.song_plays 
ADD COLUMN duration_seconds INTEGER DEFAULT 0,
ADD COLUMN is_valid_play BOOLEAN DEFAULT FALSE;

-- Create index for better performance on valid plays
CREATE INDEX idx_song_plays_valid ON public.song_plays(song_id, is_valid_play) WHERE is_valid_play = true;

-- Enable realtime for song_statistics table
ALTER TABLE public.song_statistics REPLICA IDENTITY FULL;

-- Add the table to realtime publication if not already added
DO $$ 
BEGIN
    -- Check if the table is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'song_statistics'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.song_statistics;
    END IF;
END $$;
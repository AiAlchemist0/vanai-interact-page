-- Clean up all database records for the "deepfakes" song
-- This will completely remove the song from all analytics and leaderboards

-- Delete from song_likes table
DELETE FROM public.song_likes WHERE song_id = 'deepfakes';

-- Delete from song_plays table  
DELETE FROM public.song_plays WHERE song_id = 'deepfakes';

-- Delete from song_statistics table
DELETE FROM public.song_statistics WHERE song_id = 'deepfakes';

-- Delete from song_like_statistics table
DELETE FROM public.song_like_statistics WHERE song_id = 'deepfakes';
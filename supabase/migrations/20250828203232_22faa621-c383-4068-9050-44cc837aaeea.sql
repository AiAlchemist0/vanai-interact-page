-- Remove all data for "Eagle's Watch Over the Inlet by Gabriel George Sr." (song_id: gabriel-george-sr-eagles-watch)

-- Delete from song_plays table
DELETE FROM public.song_plays WHERE song_id = 'gabriel-george-sr-eagles-watch';

-- Delete from song_likes table  
DELETE FROM public.song_likes WHERE song_id = 'gabriel-george-sr-eagles-watch';

-- Delete from song_keywords table
DELETE FROM public.song_keywords WHERE song_id = 'gabriel-george-sr-eagles-watch';

-- Delete from song_statistics table
DELETE FROM public.song_statistics WHERE song_id = 'gabriel-george-sr-eagles-watch';

-- Delete from song_like_statistics table
DELETE FROM public.song_like_statistics WHERE song_id = 'gabriel-george-sr-eagles-watch';

-- Delete from user_preferences table
DELETE FROM public.user_preferences WHERE song_id = 'gabriel-george-sr-eagles-watch';
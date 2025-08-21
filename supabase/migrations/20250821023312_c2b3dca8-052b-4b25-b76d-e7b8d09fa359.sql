-- Fix song_id for Brenda Bailey keywords - update from 'brenda-bailey-jedi' to 'brenda-bailey'
UPDATE public.song_keywords 
SET song_id = 'brenda-bailey' 
WHERE song_id = 'brenda-bailey-jedi';
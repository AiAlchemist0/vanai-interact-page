-- Fix song ID mismatch for Kris Krug's "Circles in the AI Glow"
-- Update all keyword records from 'circles-in-the-ai-glow' to 'kris-krug-circles'
UPDATE public.song_keywords 
SET song_id = 'kris-krug-circles'
WHERE song_id = 'circles-in-the-ai-glow';
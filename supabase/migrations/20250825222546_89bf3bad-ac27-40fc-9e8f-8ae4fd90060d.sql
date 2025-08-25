-- Update Mr. Pixel Wizard BC AI song keywords to use proper category format
-- Convert snake_case categories to Title Case to match color mapping system

UPDATE public.song_keywords 
SET category = 'AI Experience' 
WHERE song_id = 'pixel-wizard' AND category = 'ai_experience';

UPDATE public.song_keywords 
SET category = 'Creative Impact' 
WHERE song_id = 'pixel-wizard' AND category = 'creative_impact';

UPDATE public.song_keywords 
SET category = 'Future Vision' 
WHERE song_id = 'pixel-wizard' AND category = 'future_vision';

UPDATE public.song_keywords 
SET category = 'Community' 
WHERE song_id = 'pixel-wizard' AND category = 'community';

UPDATE public.song_keywords 
SET category = 'Innovation' 
WHERE song_id = 'pixel-wizard' AND category = 'innovation';

-- Keep these as lowercase to match existing mappings
UPDATE public.song_keywords 
SET category = 'technology' 
WHERE song_id = 'pixel-wizard' AND category = 'technology';

UPDATE public.song_keywords 
SET category = 'location' 
WHERE song_id = 'pixel-wizard' AND category = 'location';

UPDATE public.song_keywords 
SET category = 'person' 
WHERE song_id = 'pixel-wizard' AND category = 'person';
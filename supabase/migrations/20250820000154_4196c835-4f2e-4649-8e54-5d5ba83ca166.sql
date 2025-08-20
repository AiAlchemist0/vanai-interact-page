-- Add comprehensive keywords for BC Coast Catalyst based on the full lyrics
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
-- Technology & Innovation Keywords
('bc-coast-catalyst', 'vancouver', 'location', 10),
('bc-coast-catalyst', 'ai', 'technology', 10),
('bc-coast-catalyst', 'code', 'technology', 9),
('bc-coast-catalyst', 'alchemy', 'concept', 8),
('bc-coast-catalyst', 'circuits', 'technology', 8),
('bc-coast-catalyst', 'biotech', 'technology', 8),
('bc-coast-catalyst', 'summit', 'event', 9),
('bc-coast-catalyst', 'ecosystem', 'concept', 9),

-- Organizations & Ventures
('bc-coast-catalyst', 'frontier collective', 'organization', 9),
('bc-coast-catalyst', 'tenacious ventures', 'organization', 8),
('bc-coast-catalyst', 'rotary', 'organization', 6),
('bc-coast-catalyst', 'university confidential', 'organization', 7),
('bc-coast-catalyst', 'justice hack', 'event', 7),
('bc-coast-catalyst', 'star blue', 'organization', 6),

-- Concepts & Themes
('bc-coast-catalyst', 'futures', 'concept', 9),
('bc-coast-catalyst', 'dreams', 'concept', 8),
('bc-coast-catalyst', 'pioneer', 'concept', 8),
('bc-coast-catalyst', 'weaver', 'concept', 7),
('bc-coast-catalyst', 'electric', 'concept', 7),
('bc-coast-catalyst', 'storm', 'concept', 6),
('bc-coast-catalyst', 'prophecy', 'concept', 6),
('bc-coast-catalyst', 'legacy', 'concept', 6),

-- Nature & Location
('bc-coast-catalyst', 'mist', 'nature', 8),
('bc-coast-catalyst', 'rain', 'nature', 7),
('bc-coast-catalyst', 'cedar', 'nature', 6),
('bc-coast-catalyst', 'tides', 'nature', 7),
('bc-coast-catalyst', 'yvr', 'location', 6),
('bc-coast-catalyst', 'g20', 'event', 6),

-- Personal & Artistic
('bc-coast-catalyst', 'kassandra', 'person', 10),
('bc-coast-catalyst', 'quantum', 'concept', 6);

-- Remove any duplicate basic keywords that may conflict
DELETE FROM public.song_keywords 
WHERE song_id = 'bc-coast-catalyst' 
AND keyword IN ('coast', 'catalyst', 'transformation', 'pacific', 'innovation', 'mountains', 'ocean', 'british columbia', 'change', 'future', 'creativity', 'nature', 'kassandra linklater');
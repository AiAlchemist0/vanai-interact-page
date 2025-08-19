-- Complete keywords for "Circles in the AI Glow" by Kris Krüg & BC + AI Crew
-- Add missing keywords across all categories with exact user-specified phrases

-- AI Experience category keywords
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'Vancouver AI Community', 'AI Experience', 10),
('kris-krug-circles', 'Human++', 'AI Experience', 9),
('kris-krug-circles', 'TheUpgrade.ai', 'AI Experience', 8),
('kris-krug-circles', 'Sandboxing AI', 'AI Experience', 8),
('kris-krug-circles', 'bots', 'AI Experience', 9),
('kris-krug-circles', 'digital land', 'AI Experience', 7);

-- Creative Impact category keywords
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'Artist soul', 'Creative Impact', 9),
('kris-krug-circles', 'paint dreams', 'Creative Impact', 8),
('kris-krug-circles', 'steal brush', 'Creative Impact', 8),
('kris-krug-circles', 'code steals art', 'Creative Impact', 9),
('kris-krug-circles', 'human touch', 'Creative Impact', 10);

-- Future Vision category keywords
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'Uncertainty', 'Future Vision', 8),
('kris-krug-circles', 'fear', 'Future Vision', 9),
('kris-krug-circles', 'optimism', 'Future Vision', 8),
('kris-krug-circles', 'enthusiasm', 'Future Vision', 7),
('kris-krug-circles', 'hope', 'Future Vision', 9),
('kris-krug-circles', 'fear and hope dancing', 'Future Vision', 10);

-- Relationships category keywords (new category)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'choose bot over real heart', 'Relationships', 9),
('kris-krug-circles', 'relationships glitching', 'Relationships', 8),
('kris-krug-circles', 'lovin'' a program', 'Relationships', 8);

-- Community category keywords
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'unite', 'Community', 8),
('kris-krug-circles', 'connectin'' crew', 'Community', 9),
('kris-krug-circles', 'circle full', 'Community', 10);

-- Identity category keywords
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('kris-krug-circles', 'what it mean to be human', 'Identity', 10),
('kris-krug-circles', 'humanity''s vibe', 'Identity', 9),
('kris-krug-circles', 'real or pixels', 'Identity', 8);
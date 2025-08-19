-- Remove duplicate keywords keeping only the first occurrence based on lowest id
DELETE FROM song_keywords 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM song_keywords 
  GROUP BY song_id, keyword, category, relevance_score
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE song_keywords 
ADD CONSTRAINT unique_song_keyword_category 
UNIQUE(song_id, keyword, category);
-- Remove duplicate keywords keeping only the first occurrence
WITH duplicates_to_remove AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY song_id, keyword, category 
      ORDER BY created_at ASC, id
    ) as row_num
  FROM song_keywords
)
DELETE FROM song_keywords 
WHERE id IN (
  SELECT id FROM duplicates_to_remove WHERE row_num > 1
);

-- Add unique constraint to prevent future duplicates
ALTER TABLE song_keywords 
ADD CONSTRAINT unique_song_keyword_category 
UNIQUE(song_id, keyword, category);
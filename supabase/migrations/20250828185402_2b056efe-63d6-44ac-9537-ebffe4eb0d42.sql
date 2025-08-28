-- Handle duplicates by merging data before updating song IDs

-- First, remove duplicate song_likes that would be created by the update
-- Keep the earliest like for each unique combination after the update
DELETE FROM song_likes 
WHERE id NOT IN (
  SELECT DISTINCT ON (
    CASE 
      WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
      WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
      WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
      WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
      WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
      WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
      ELSE song_id
    END,
    user_session_id
  ) id
  FROM song_likes
  ORDER BY 
    CASE 
      WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
      WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
      WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
      WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
      WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
      WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
      ELSE song_id
    END,
    user_session_id,
    liked_at ASC
);

-- Handle duplicates in song_statistics by merging data
-- Sum total_plays and keep the latest last_played_at for duplicates
INSERT INTO song_statistics (song_id, total_plays, last_played_at, created_at, updated_at)
SELECT 
  CASE 
    WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
    WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
    WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
    WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
    WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
    WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
    ELSE song_id
  END as new_song_id,
  SUM(total_plays) as total_plays,
  MAX(last_played_at) as last_played_at,
  MIN(created_at) as created_at,
  now() as updated_at
FROM song_statistics
WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit')
GROUP BY new_song_id
ON CONFLICT (song_id) DO UPDATE SET
  total_plays = song_statistics.total_plays + EXCLUDED.total_plays,
  last_played_at = GREATEST(song_statistics.last_played_at, EXCLUDED.last_played_at),
  updated_at = now();

-- Handle duplicates in song_like_statistics by merging data
INSERT INTO song_like_statistics (song_id, total_likes, last_liked_at, created_at, updated_at)
SELECT 
  CASE 
    WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
    WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
    WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
    WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
    WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
    WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
    ELSE song_id
  END as new_song_id,
  SUM(total_likes) as total_likes,
  MAX(last_liked_at) as last_liked_at,
  MIN(created_at) as created_at,
  now() as updated_at
FROM song_like_statistics
WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit')
GROUP BY new_song_id
ON CONFLICT (song_id) DO UPDATE SET
  total_likes = song_like_statistics.total_likes + EXCLUDED.total_likes,
  last_liked_at = GREATEST(song_like_statistics.last_liked_at, EXCLUDED.last_liked_at),
  updated_at = now();

-- Now update the song IDs after handling duplicates
UPDATE song_plays 
SET song_id = CASE 
  WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
  WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
  WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
  WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
  WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
  WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
  ELSE song_id
END
WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit');

UPDATE song_likes 
SET song_id = CASE 
  WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
  WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
  WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
  WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
  WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
  WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
  ELSE song_id
END
WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit');

-- Delete old entries after merging
DELETE FROM song_statistics WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit');
DELETE FROM song_like_statistics WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit');

UPDATE user_preferences 
SET song_id = CASE 
  WHEN song_id = 'brenda-bailey' THEN 'brenda-bailey-jedi-master'
  WHEN song_id = 'dr-patrick-cover' THEN 'dr-patrick'
  WHEN song_id = 'hr-macmillan-alien' THEN 'hr-macmillan'
  WHEN song_id = 'mac-mind-ai-consciousness' THEN 'mac'
  WHEN song_id = 'eagle-watch-inlet' THEN 'gabriel-george-sr-eagles-watch'
  WHEN song_id = 'smells-like-reids-spirit' THEN 'smells-like-reid-spirit'
  ELSE song_id
END
WHERE song_id IN ('brenda-bailey', 'dr-patrick-cover', 'hr-macmillan-alien', 'mac-mind-ai-consciousness', 'eagle-watch-inlet', 'smells-like-reids-spirit');
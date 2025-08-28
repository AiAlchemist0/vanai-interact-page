-- Fix song ID mappings to match current song catalog
-- Update incorrect song IDs in song_plays table
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

-- Update incorrect song IDs in song_likes table
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

-- Update incorrect song IDs in song_statistics table
UPDATE song_statistics 
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

-- Update incorrect song IDs in song_like_statistics table
UPDATE song_like_statistics 
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

-- Update incorrect song IDs in user_preferences table
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

-- Remove orphaned entries that don't match any valid song IDs
-- Only keep entries where song_id exists in the current song catalog
DELETE FROM song_plays WHERE song_id NOT IN (
  'bc-ai-hackathon', 'lionel-ringenbach', 'kris-krug-circles', 'pixel-wizard', 
  'dr-patrick', 'hr-macmillan', 'my-arts-all-human', 'indigenomics-ai', 
  'lalala-ai-dilemma', 'mac', 'darren-ai-struck', 'dean-shev-human', 
  'philippe-pasquier-art-hallucinations', 'bc-coast-catalyst', 'brenda-bailey-jedi-master', 
  'gabriel-george-sr-eagles-watch', 'smells-like-reid-spirit', 'deepfakes-rain'
);

DELETE FROM song_likes WHERE song_id NOT IN (
  'bc-ai-hackathon', 'lionel-ringenbach', 'kris-krug-circles', 'pixel-wizard', 
  'dr-patrick', 'hr-macmillan', 'my-arts-all-human', 'indigenomics-ai', 
  'lalala-ai-dilemma', 'mac', 'darren-ai-struck', 'dean-shev-human', 
  'philippe-pasquier-art-hallucinations', 'bc-coast-catalyst', 'brenda-bailey-jedi-master', 
  'gabriel-george-sr-eagles-watch', 'smells-like-reid-spirit', 'deepfakes-rain'
);

DELETE FROM song_statistics WHERE song_id NOT IN (
  'bc-ai-hackathon', 'lionel-ringenbach', 'kris-krug-circles', 'pixel-wizard', 
  'dr-patrick', 'hr-macmillan', 'my-arts-all-human', 'indigenomics-ai', 
  'lalala-ai-dilemma', 'mac', 'darren-ai-struck', 'dean-shev-human', 
  'philippe-pasquier-art-hallucinations', 'bc-coast-catalyst', 'brenda-bailey-jedi-master', 
  'gabriel-george-sr-eagles-watch', 'smells-like-reid-spirit', 'deepfakes-rain'
);

DELETE FROM song_like_statistics WHERE song_id NOT IN (
  'bc-ai-hackathon', 'lionel-ringenbach', 'kris-krug-circles', 'pixel-wizard', 
  'dr-patrick', 'hr-macmillan', 'my-arts-all-human', 'indigenomics-ai', 
  'lalala-ai-dilemma', 'mac', 'darren-ai-struck', 'dean-shev-human', 
  'philippe-pasquier-art-hallucinations', 'bc-coast-catalyst', 'brenda-bailey-jedi-master', 
  'gabriel-george-sr-eagles-watch', 'smells-like-reid-spirit', 'deepfakes-rain'
);

DELETE FROM user_preferences WHERE song_id NOT IN (
  'bc-ai-hackathon', 'lionel-ringenbach', 'kris-krug-circles', 'pixel-wizard', 
  'dr-patrick', 'hr-macmillan', 'my-arts-all-human', 'indigenomics-ai', 
  'lalala-ai-dilemma', 'mac', 'darren-ai-struck', 'dean-shev-human', 
  'philippe-pasquier-art-hallucinations', 'bc-coast-catalyst', 'brenda-bailey-jedi-master', 
  'gabriel-george-sr-eagles-watch', 'smells-like-reid-spirit', 'deepfakes-rain'
);
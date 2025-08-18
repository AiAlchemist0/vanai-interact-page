-- Final batch: Add balanced listen data for remaining songs

-- My Arts All Human (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 hours', 41, true, 68.9),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '9 hours', 28, true, 47.3),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 14 hours', 48, true, 80.6),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 8 hours', 34, true, 57.1);

-- BC AI Hackathon (3 likes) - Add 5 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 hour', 50, true, 83.8),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '6 hours', 36, true, 60.4),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '12 hours', 54, true, 90.7),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 6 hours', 31, true, 52.1),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 days 12 hours', 45, true, 75.8);

-- MAC (3 likes) - Add 4 valid listens  
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 hours', 47, true, 78.9),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '11 hours', 33, true, 55.2),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 20 hours', 52, true, 87.4),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 16 hours', 37, true, 62.8);

-- Pixel Wizard (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 44, true, 73.6),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '7 hours', 29, true, 48.9),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 12 hours', 56, true, 94.1),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 20 hours', 38, true, 64.7);

-- Verify all songs now have balanced data
SELECT 
  song_id,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN is_valid_play = true THEN 1 END) as valid_plays,
  AVG(completion_percentage) as avg_completion
FROM song_plays 
WHERE song_id IN (
  'lionel-ringenbach', 'dean-shev-human', 'lalala-ai-dilemma', 
  'brenda-bailey', 'indigenomics-ai', 'hr-macmillan', 
  'darren-ai-struck', 'dr-patrick', 'my-arts-all-human', 
  'bc-ai-hackathon', 'mac', 'pixel-wizard'
)
GROUP BY song_id
ORDER BY valid_plays DESC;
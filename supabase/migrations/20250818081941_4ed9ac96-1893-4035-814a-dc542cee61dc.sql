-- Final batch: Add listen data for remaining songs with likes but no plays

-- My Arts All Human (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 hours', 35, true, 58.7),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '9 hours', 48, true, 80.4),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 14 hours', 27, true, 45.9),
  ('my-arts-all-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 8 hours', 42, true, 70.6);

-- BC AI Hackathon (3 likes) - Add 5 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 hour', 51, true, 85.8),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '6 hours', 36, true, 60.2),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '12 hours', 59, true, 98.7),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 3 hours', 28, true, 47.1),
  ('bc-ai-hackathon', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 days 6 hours', 44, true, 74.3);

-- MAC (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 hours', 40, true, 67.5),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '7 hours', 32, true, 54.1),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 5 hours', 56, true, 94.2),
  ('mac', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 16 hours', 25, true, 42.8);

-- Pixel Wizard (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 45, true, 75.9),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '8 hours', 31, true, 52.4),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 11 hours', 53, true, 89.6),
  ('pixel-wizard', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 4 hours', 37, true, 62.7);

-- Verify the balanced data
SELECT 
  song_id,
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN is_valid_play = true THEN 1 END) as valid_plays,
  AVG(duration_seconds) as avg_duration,
  AVG(completion_percentage) as avg_completion
FROM public.song_plays 
WHERE song_id IN (
  'lionel-ringenbach', 'dean-shev-human', 'lalala-ai-dilemma', 'brenda-bailey',
  'indigenomics-ai', 'hr-macmillan', 'darren-ai-struck', 'dr-patrick',
  'my-arts-all-human', 'bc-ai-hackathon', 'mac', 'pixel-wizard'
)
GROUP BY song_id
ORDER BY valid_plays DESC;
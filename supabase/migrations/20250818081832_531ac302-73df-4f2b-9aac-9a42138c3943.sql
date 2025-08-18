-- Add balanced listen data for songs with likes but no valid plays
-- This will create realistic listening patterns for each song

-- Lionel Ringenbach (4 likes) - Add 6 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 hours', 42, true, 70.8),
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '5 hours', 28, true, 47.2),
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day', 55, true, 92.6),
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 6 hours', 35, true, 58.9),
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days', 48, true, 80.5),
  ('lionel-ringenbach', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days', 22, true, 37.1);

-- Dean Shev Human (4 likes) - Add 7 valid listens  
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 hour', 56, true, 93.8),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 hours', 38, true, 63.5),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '8 hours', 45, true, 75.2),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day', 29, true, 48.7),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 12 hours', 52, true, 87.1),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days', 41, true, 68.4),
  ('dean-shev-human', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days', 33, true, 55.9);

-- Lalala AI Dilemma (4 likes) - Add 6 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 47, true, 78.6),
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '6 hours', 34, true, 57.3),
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '10 hours', 58, true, 96.8),
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 3 hours', 25, true, 42.1),
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 4 hours', 43, true, 72.5),
  ('lalala-ai-dilemma', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 days', 39, true, 65.2);

-- Brenda Bailey (4 likes) - Add 5 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('brenda-bailey', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 hours', 44, true, 73.7),
  ('brenda-bailey', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '7 hours', 31, true, 52.1),
  ('brenda-bailey', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 2 hours', 49, true, 82.4),
  ('brenda-bailey', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 8 hours', 36, true, 60.8),
  ('brenda-bailey', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 12 hours', 53, true, 89.2);
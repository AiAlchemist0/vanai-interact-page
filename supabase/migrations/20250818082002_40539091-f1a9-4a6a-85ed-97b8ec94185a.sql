-- Continue adding balanced listen data for remaining songs

-- Indigenomics AI (4 likes) - Add 5 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('indigenomics-ai', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 38, true, 63.9),
  ('indigenomics-ai', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '6 hours', 45, true, 75.4),
  ('indigenomics-ai', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 4 hours', 29, true, 48.6),
  ('indigenomics-ai', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days', 52, true, 87.3),
  ('indigenomics-ai', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 6 hours', 41, true, 68.8);

-- H.R MacMillan (4 likes) - Add 6 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 hour', 49, true, 82.1),
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '5 hours', 33, true, 55.7),
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '9 hours', 57, true, 95.2),
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 8 hours', 26, true, 43.9),
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 12 hours', 44, true, 73.8),
  ('hr-macmillan', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 days', 37, true, 62.4);

-- Darren AI Struck (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('darren-ai-struck', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 hours', 46, true, 77.5),
  ('darren-ai-struck', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '7 hours', 32, true, 54.2),
  ('darren-ai-struck', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 10 hours', 51, true, 85.9),
  ('darren-ai-struck', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '3 days 2 hours', 39, true, 65.8);

-- Dr. Patrick (3 likes) - Add 4 valid listens
INSERT INTO public.song_plays (
  song_id, user_session_id, played_at, duration_seconds, is_valid_play, completion_percentage
) VALUES
  ('dr-patrick', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 43, true, 72.1),
  ('dr-patrick', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '8 hours', 30, true, 50.8),
  ('dr-patrick', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 6 hours', 54, true, 90.7),
  ('dr-patrick', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 18 hours', 35, true, 59.3);
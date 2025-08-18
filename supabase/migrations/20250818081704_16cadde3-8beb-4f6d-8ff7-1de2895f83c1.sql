-- Add 8 valid listens for "Circles in the AI Glow" with realistic data
INSERT INTO public.song_plays (
  song_id,
  user_session_id,
  played_at,
  duration_seconds,
  is_valid_play,
  completion_percentage
) VALUES
  -- Listen 1: Full completion
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 hours', 58, true, 97.5),
  
  -- Listen 2: Partial listen
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '4 hours', 32, true, 53.8),
  
  -- Listen 3: Good completion
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '6 hours', 45, true, 75.6),
  
  -- Listen 4: Short but valid
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '8 hours', 18, true, 30.2),
  
  -- Listen 5: Almost full
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day', 52, true, 87.3),
  
  -- Listen 6: Mid-length listen
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '1 day 4 hours', 38, true, 63.9),
  
  -- Listen 7: Another full listen
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days', 59, true, 99.1),
  
  -- Listen 8: Decent completion
  ('kris-krug-circles', 'session_' || gen_random_uuid()::text, NOW() - INTERVAL '2 days 8 hours', 41, true, 68.9);

-- Verify the data was inserted correctly
SELECT 
  song_id,
  COUNT(*) as total_listens,
  COUNT(CASE WHEN is_valid_play = true THEN 1 END) as valid_listens,
  AVG(duration_seconds) as avg_duration,
  AVG(completion_percentage) as avg_completion
FROM public.song_plays 
WHERE song_id = 'kris-krug-circles'
GROUP BY song_id;
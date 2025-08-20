-- Manually populate song statistics for bc-coast-catalyst since the trigger isn't working
INSERT INTO public.song_statistics (song_id, total_plays, last_played_at)
SELECT 
  'bc-coast-catalyst',
  COUNT(CASE WHEN is_valid_play = true THEN 1 END)::integer as total_plays,
  MAX(CASE WHEN is_valid_play = true THEN played_at END) as last_played_at
FROM public.song_plays 
WHERE song_id = 'bc-coast-catalyst'
ON CONFLICT (song_id) 
DO UPDATE SET
  total_plays = EXCLUDED.total_plays,
  last_played_at = EXCLUDED.last_played_at,
  updated_at = now();
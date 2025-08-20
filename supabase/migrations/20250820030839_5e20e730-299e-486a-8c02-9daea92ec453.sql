-- Phase 1: Database Cleanup - Remove orphaned "deepfakes-in-the-rain" data
-- This song exists in keywords but not in the actual app catalog

-- Remove orphaned keywords for the ghost song
DELETE FROM song_keywords 
WHERE song_id = 'deepfakes-in-the-rain';

-- Clean up any potential song statistics for the ghost song
DELETE FROM song_statistics 
WHERE song_id = 'deepfakes-in-the-rain';

-- Clean up any song plays for the ghost song
DELETE FROM song_plays 
WHERE song_id = 'deepfakes-in-the-rain';

-- Clean up any song likes for the ghost song
DELETE FROM song_likes 
WHERE song_id = 'deepfakes-in-the-rain';

-- Clean up any song like statistics for the ghost song
DELETE FROM song_like_statistics 
WHERE song_id = 'deepfakes-in-the-rain';
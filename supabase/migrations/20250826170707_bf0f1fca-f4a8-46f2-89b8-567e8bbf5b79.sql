-- Fix MAC song keywords display by updating song_id from "mac-cover" to "mac"
UPDATE song_keywords 
SET song_id = 'mac' 
WHERE song_id = 'mac-cover';
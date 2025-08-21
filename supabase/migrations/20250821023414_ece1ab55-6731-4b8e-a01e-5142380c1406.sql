-- Clean up existing Brenda Bailey keywords and add comprehensive set
-- First delete existing keywords for brenda-bailey
DELETE FROM public.song_keywords WHERE song_id = 'brenda-bailey';

-- Delete the incorrectly named entries
DELETE FROM public.song_keywords WHERE song_id = 'brenda-bailey-jedi';

-- Now insert the comprehensive keyword set with correct song_id
-- Economic Impact theme keywords (Primary theme - highest relevance)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('brenda-bailey', 'Minister of Finance', 'Economic Impact', 10),
('brenda-bailey', 'balancing budgets', 'Economic Impact', 10),
('brenda-bailey', 'fiscal responsibility', 'Economic Impact', 9),
('brenda-bailey', 'cutting through deficits', 'Economic Impact', 9),
('brenda-bailey', 'Empire of debt', 'Economic Impact', 9),
('brenda-bailey', 'financial leadership', 'Economic Impact', 8),
('brenda-bailey', 'wielding the ledger', 'Economic Impact', 8),
('brenda-bailey', 'Sith inflation', 'Economic Impact', 8),
('brenda-bailey', 'economic chains', 'Economic Impact', 8),
('brenda-bailey', 'fiscal hall', 'Economic Impact', 8),
('brenda-bailey', 'masters the math', 'Economic Impact', 8),
('brenda-bailey', 'audits the shadows', 'Economic Impact', 7),
('brenda-bailey', 'cabinet table power', 'Economic Impact', 7);

-- Identity theme keywords (High relevance)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('brenda-bailey', 'Brenda Bailey', 'Identity', 10),
('brenda-bailey', 'Jedi of the coin', 'Identity', 9),
('brenda-bailey', 'Minister of might', 'Identity', 9),
('brenda-bailey', 'dressed as Leia', 'Identity', 8),
('brenda-bailey', 'buns in her hair', 'Identity', 7),
('brenda-bailey', 'Yoda wisdom', 'Identity', 8),
('brenda-bailey', 'Leia fire in veins', 'Identity', 8),
('brenda-bailey', 'rebel spirit', 'Identity', 8),
('brenda-bailey', 'tech founder', 'Identity', 7),
('brenda-bailey', 'innovation background', 'Identity', 7),
('brenda-bailey', 'Percy Jackson nods', 'Identity', 6);

-- Community theme keywords (High relevance)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('brenda-bailey', 'BC land', 'Community', 10),
('brenda-bailey', 'Vancouver-False Creek', 'Community', 9),
('brenda-bailey', 'halls of Victoria', 'Community', 9),
('brenda-bailey', 'brighter BC', 'Community', 9),
('brenda-bailey', 'fight for the people', 'Community', 9),
('brenda-bailey', 'families and futures', 'Community', 8),
('brenda-bailey', 'galaxy of governance', 'Community', 8),
('brenda-bailey', 'building tomorrow', 'Community', 8),
('brenda-bailey', 'legend of BC', 'Community', 8),
('brenda-bailey', 'JEDI team by her side', 'Community', 7),
('brenda-bailey', 'LinkedIn to legislature', 'Community', 7);

-- Future Vision theme keywords (High relevance)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('brenda-bailey', 'appointed November 2024', 'Future Vision', 8),
('brenda-bailey', 'swapped innovation for fiscal', 'Future Vision', 8),
('brenda-bailey', 'craft the policies', 'Future Vision', 8),
('brenda-bailey', 'balancing dark and light', 'Future Vision', 7),
('brenda-bailey', 'breaking economic chains', 'Future Vision', 8),
('brenda-bailey', 'building tomorrow', 'Future Vision', 8),
('brenda-bailey', 'Force guide every decree', 'Future Vision', 7),
('brenda-bailey', 'no dark side temptation', 'Future Vision', 7),
('brenda-bailey', 'promises I keep', 'Future Vision', 7);

-- Creative Impact theme keywords (High relevance)
INSERT INTO public.song_keywords (song_id, keyword, category, relevance_score) VALUES
('brenda-bailey', 'Star Wars Day', 'Creative Impact', 9),
('brenda-bailey', 'May the Force be with you', 'Creative Impact', 9),
('brenda-bailey', 'lightsaber bright', 'Creative Impact', 8),
('brenda-bailey', 'Force in the stars', 'Creative Impact', 8),
('brenda-bailey', 'saw Star Wars first', 'Creative Impact', 8),
('brenda-bailey', 'dressed up for cons', 'Creative Impact', 7),
('brenda-bailey', 'galaxy of finance', 'Creative Impact', 8),
('brenda-bailey', 'master of the game', 'Creative Impact', 7),
('brenda-bailey', 'story retold', 'Creative Impact', 6),
('brenda-bailey', 'happy Star Wars Day every May', 'Creative Impact', 8);
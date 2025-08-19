import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SongKeyword {
  song_id: string;
  keyword: string;
  category: string;
  relevance_score: number;
}

export interface KeywordAnalytics {
  category: string;
  keyword_count: number;
  total_relevance: number;
  avg_relevance: number;
}

export const useSongKeywords = (songId?: string) => {
  const [keywords, setKeywords] = useState<SongKeyword[]>([]);
  const [analytics, setAnalytics] = useState<KeywordAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch keywords for specific song or all songs
      const { data: keywordData, error: keywordError } = await supabase
        .rpc('get_song_keywords', songId ? { p_song_id: songId } : {});

      if (keywordError) throw keywordError;

      // Fetch keyword analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_keyword_analytics');

      if (analyticsError) throw analyticsError;

      setKeywords(keywordData || []);
      setAnalytics(analyticsData || []);
    } catch (err) {
      console.error('Error fetching song keywords:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [songId]);

  const getKeywordsByCategory = (category: string) => {
    return keywords.filter(k => k.category === category);
  };

  const getSongKeywords = (targetSongId: string) => {
    return keywords.filter(k => k.song_id === targetSongId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI Experience': 'from-blue-500 to-cyan-500',
      'Creative Impact': 'from-purple-500 to-pink-500',
      'Future Vision': 'from-green-500 to-teal-500',
      'Relationships': 'from-red-500 to-rose-500',
      'Technology': 'from-yellow-500 to-orange-500',
      'Community': 'from-indigo-500 to-violet-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return {
    keywords,
    analytics,
    loading,
    error,
    refetch: fetchKeywords,
    getKeywordsByCategory,
    getSongKeywords,
    getCategoryColor
  };
};
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

export const useSongKeywords = () => {
  const [keywords, setKeywords] = useState<SongKeyword[]>([]);
  const [analytics, setAnalytics] = useState<KeywordAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKeywords = async () => {
    try {
      const { data, error } = await supabase.rpc('get_song_keywords');
      if (error) throw error;
      setKeywords(data || []);
    } catch (error) {
      console.error('Error fetching song keywords:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase.rpc('get_keyword_analytics');
      if (error) throw error;
      setAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching keyword analytics:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchKeywords(), fetchAnalytics()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getKeywordsForSong = (songId: string) => {
    return keywords.filter(k => k.song_id === songId);
  };

  const getTopKeywordsForSong = (songId: string, limit = 3) => {
    return getKeywordsForSong(songId)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);
  };

  const getKeywordsByCategory = (category: string) => {
    return keywords.filter(k => k.category === category);
  };

  return {
    keywords,
    analytics,
    loading,
    getKeywordsForSong,
    getTopKeywordsForSong,
    getKeywordsByCategory,
    refetch: () => {
      fetchKeywords();
      fetchAnalytics();
    }
  };
};
import { useState, useEffect, useCallback, useMemo } from 'react';
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

  const getKeywordsForSong = useCallback((songId: string) => {
    const songKeywords = keywords.filter(k => k.song_id === songId);
    
    // Deduplicate based on song_id, keyword, and category as defensive measure
    const uniqueKeywords = songKeywords.reduce((acc, current) => {
      const key = `${current.song_id}-${current.keyword}-${current.category}`;
      if (!acc.has(key)) {
        acc.set(key, current);
      }
      return acc;
    }, new Map<string, SongKeyword>());
    
    return Array.from(uniqueKeywords.values());
  }, [keywords]);

  const getTopKeywordsForSong = useCallback((songId: string, limit = 3) => {
    return getKeywordsForSong(songId)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);
  }, [getKeywordsForSong]);

  const getKeywordsByCategory = useCallback((category: string) => {
    return keywords.filter(k => k.category === category);
  }, [keywords]);

  // Memoize analytics array to prevent unnecessary re-renders
  const stableAnalytics = useMemo(() => analytics, [analytics]);

  return {
    keywords,
    analytics: stableAnalytics,
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
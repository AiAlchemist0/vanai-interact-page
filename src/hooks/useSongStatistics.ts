import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SongStatistics {
  song_id: string;
  total_plays: number;
  last_played_at: string | null;
}

export const useSongStatistics = () => {
  const [statistics, setStatistics] = useState<SongStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      console.log('Fetching song statistics...');
      setLoading(true);
      const { data, error } = await supabase
        .from('song_statistics')
        .select('song_id, total_plays, last_played_at')
        .order('total_plays', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Statistics data received:', data);
      setStatistics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.error('Error fetching song statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const recordPlay = async (songId: string) => {
    try {
      console.log('Recording play for song:', songId);
      
      // Generate a simple session ID for anonymous tracking
      const sessionId = localStorage.getItem('session_id') || 
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', sessionId);

      const { error } = await supabase
        .from('song_plays')
        .insert({
          song_id: songId,
          user_session_id: sessionId,
          played_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error recording play:', error);
        throw error;
      }

      console.log('Play recorded successfully for song:', songId);
      
      // Refresh statistics after recording a play
      await fetchStatistics();
    } catch (err) {
      console.error('Error recording song play:', err);
    }
  };

  const getPlayCount = (songId: string): number => {
    const stat = statistics.find(s => s.song_id === songId);
    return stat?.total_plays || 0;
  };

  const getTotalPlays = (): number => {
    return statistics.reduce((total, stat) => total + stat.total_plays, 0);
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    recordPlay,
    getPlayCount,
    getTotalPlays,
    refetch: fetchStatistics
  };
};
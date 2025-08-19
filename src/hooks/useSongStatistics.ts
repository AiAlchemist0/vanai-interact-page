import { useState, useEffect, useRef } from 'react';
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
  const playStartTimes = useRef<Map<string, { startTime: number; recordId: string }>>(new Map());

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Use the secure statistics function that provides aggregated data only
      const { data, error } = await supabase.rpc('get_song_statistics');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        song_id: item.song_id,
        total_plays: item.total_plays,
        last_played_at: item.last_played_at
      }));
      setStatistics(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.error('Error fetching song statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const startPlayTracking = async (songId: string) => {
    try {
      console.log('Starting play tracking for song:', songId);
      
      // Generate a simple session ID for anonymous tracking
      const sessionId = localStorage.getItem('session_id') || 
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', sessionId);
      
      console.log('Using session ID for tracking:', sessionId);

      // Insert initial record with is_valid_play = false
      const insertData = {
        song_id: songId,
        user_session_id: sessionId,
        played_at: new Date().toISOString(),
        duration_seconds: 0,
        is_valid_play: false,
        completion_percentage: 0
      };
      
      console.log('Inserting play record:', insertData);
      
      const { data, error } = await supabase
        .from('song_plays')
        .insert(insertData)
        .select('id')
        .single();

      if (error) {
        console.error('Error starting play tracking:', error);
        console.error('Failed insert data:', insertData);
        throw error;
      }

      // Store start time and record ID for duration calculation
      playStartTimes.current.set(songId, {
        startTime: Date.now(),
        recordId: data.id
      });
    } catch (err) {
      console.error('Error starting play tracking:', err);
    }
  };

  const endPlayTracking = async (songId: string, songDuration?: number) => {
    try {
      const trackingData = playStartTimes.current.get(songId);
      if (!trackingData) {
        console.log('No tracking data found for song:', songId);
        return;
      }

      const duration = Math.floor((Date.now() - trackingData.startTime) / 1000);
      const isValidPlay = duration >= 15; // 15+ seconds counts as a valid play
      
      // Calculate completion percentage (assuming average song length of 180 seconds)
      const estimatedSongLength = songDuration || 180; // 3 minutes default
      const completionPercentage = Math.min((duration / estimatedSongLength) * 100, 100);

      console.log(`Ending play tracking for song: ${songId}, Duration: ${duration}s, Valid: ${isValidPlay}, Completion: ${completionPercentage.toFixed(1)}%`);

      // Update the record with duration, validity, and completion percentage
      const { error } = await supabase
        .from('song_plays')
        .update({
          duration_seconds: duration,
          is_valid_play: isValidPlay,
          completion_percentage: completionPercentage
        })
        .eq('id', trackingData.recordId);

      if (error) {
        console.error('Error updating play duration:', error);
        throw error;
      }

      // Clean up tracking data
      playStartTimes.current.delete(songId);

      console.log('Play tracking completed for song:', songId);
      
      // Only refresh statistics if it was a valid play
      if (isValidPlay) {
        await fetchStatistics();
      }
    } catch (err) {
      console.error('Error ending play tracking:', err);
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

    // Set up real-time subscription for statistics updates
    const channel = supabase
      .channel('song-statistics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_statistics'
        },
        (payload) => {
          console.log('Real-time statistics update:', payload);
          // Refresh statistics when any change occurs
          fetchStatistics();
        }
      )
      .subscribe();

    return () => {
      // Clean up any ongoing tracking
      playStartTimes.current.clear();
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    statistics,
    loading,
    error,
    startPlayTracking,
    endPlayTracking,
    getPlayCount,
    getTotalPlays,
    refetch: fetchStatistics
  };
};
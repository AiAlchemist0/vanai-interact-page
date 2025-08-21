import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SongStatistics {
  song_id: string;
  total_plays: number;
  last_played_at: string | null;
}

interface UseSongStatisticsOptions {
  enabled?: boolean;
  enableRealtime?: boolean;
}

export const useSongStatistics = (options: UseSongStatisticsOptions = {}) => {
  const { enabled = true, enableRealtime = true } = options;
  const [statistics, setStatistics] = useState<SongStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playStartTimes = useRef<Map<string, { startTime: number; recordId: string; audioLoadSuccess?: boolean }>>(new Map());

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

  const startPlayTracking = async (songId: string, audioLoadSuccess: boolean = true) => {
    try {
      console.log('Starting play tracking for song:', songId, 'Audio loaded:', audioLoadSuccess);
      
      // Generate a simple session ID for anonymous tracking
      const sessionId = localStorage.getItem('session_id') || 
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem('session_id', sessionId);
      
      console.log('Using session ID for tracking:', sessionId);


      // Insert initial record with is_valid_play = false
      // Track audio loading status for debugging
      const insertData = {
        song_id: songId,
        user_session_id: sessionId,
        played_at: new Date().toISOString(),
        duration_seconds: 0,
        is_valid_play: false,
        completion_percentage: 0
      };
      
      // Log additional context for problematic songs
      if (['bc-coast-catalyst', 'philippe-pasquier-art-hallucinations', 'brenda-bailey', 'lionel-ringenbach'].includes(songId)) {
        console.warn(`⚠️ Tracking problematic song: ${songId}, Audio loaded: ${audioLoadSuccess}`);
      }
      
      console.log('Inserting play record:', insertData);
      
      const { data, error } = await supabase
        .from('song_plays')
        .insert(insertData)
        .select('id')
        .single();

      if (error) {
        console.error('Error starting play tracking:', error);
        console.error('Failed insert data:', insertData);
        console.error('Session ID:', sessionId);
        // Don't throw error - allow playback to continue even if tracking fails
        return;
      }

      // Store start time and record ID for duration calculation
      playStartTimes.current.set(songId, {
        startTime: Date.now(),
        recordId: data.id,
        audioLoadSuccess
      });
    } catch (err) {
      console.error('Error starting play tracking:', err);
      // Don't re-throw - allow music playback to continue
    }
  };

  const endPlayTracking = async (songId: string, songDuration?: number, failureReason?: string) => {
    try {
      const trackingData = playStartTimes.current.get(songId);
      if (!trackingData) {
        console.log('No tracking data found for song:', songId);
        return;
      }

      const duration = Math.floor((Date.now() - trackingData.startTime) / 1000);
      const isValidPlay = duration >= 15 && !failureReason; // Valid play requires 15+ seconds AND no failure
      
      // Calculate completion percentage (assuming average song length of 180 seconds)
      const estimatedSongLength = songDuration || 180; // 3 minutes default
      const completionPercentage = Math.min((duration / estimatedSongLength) * 100, 100);

      // Enhanced logging for problematic songs
      const logLevel = ['bc-coast-catalyst', 'philippe-pasquier-art-hallucinations'].includes(songId) ? 'warn' : 'log';
      const logMessage = `Ending play tracking for song: ${songId}, Duration: ${duration}s, Valid: ${isValidPlay}, Completion: ${completionPercentage.toFixed(1)}%`;
      
      if (failureReason) {
        console.error(`❌ ${logMessage}, Failure: ${failureReason}, Audio loaded: ${trackingData.audioLoadSuccess}`);
      } else if (logLevel === 'warn') {
        console.warn(`⚠️ ${logMessage}, Audio loaded: ${trackingData.audioLoadSuccess}`);
      } else {
        console.log(logMessage);
      }

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
    // Only fetch if enabled
    if (enabled) {
      fetchStatistics();
    }

    // Only set up real-time subscription if enabled
    if (!enableRealtime || !enabled) {
      return;
    }

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
  }, [enabled, enableRealtime]);

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
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SongLikeStatistics {
  song_id: string;
  total_likes: number;
  last_liked_at: string | null;
}

interface LikedSongs {
  [songId: string]: boolean;
}

export const useSongLikes = () => {
  const [statistics, setStatistics] = useState<SongLikeStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<LikedSongs>({});

  // Generate a unique session ID for anonymous tracking
  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('user_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // Load liked songs from localStorage
  const loadLikedSongs = useCallback(() => {
    const sessionId = getSessionId();
    const storedLikes = localStorage.getItem(`liked_songs_${sessionId}`);
    if (storedLikes) {
      try {
        setLikedSongs(JSON.parse(storedLikes));
      } catch (e) {
        console.error('Error loading liked songs:', e);
      }
    }
  }, [getSessionId]);

  // Save liked songs to localStorage
  const saveLikedSongs = useCallback((likes: LikedSongs) => {
    const sessionId = getSessionId();
    localStorage.setItem(`liked_songs_${sessionId}`, JSON.stringify(likes));
  }, [getSessionId]);

  // Fetch like statistics from database
  const fetchStatistics = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase.rpc('get_song_like_statistics');
      
      if (fetchError) {
        throw fetchError;
      }
      
      setStatistics(data || []);
    } catch (err) {
      console.error('Error fetching like statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch like statistics');
      setStatistics([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle like for a song
  const toggleLike = useCallback(async (songId: string) => {
    try {
      setError(null); // Clear any previous errors
      const sessionId = getSessionId();
      console.log('Toggling like for song:', songId, 'with session:', sessionId);
      
      const { data, error: toggleError } = await supabase.rpc('toggle_song_like', {
        p_song_id: songId,
        p_user_session_id: sessionId
      });

      if (toggleError) {
        console.error('RPC error:', toggleError);
        throw toggleError;
      }

      console.log('Toggle like response:', data);

      if (data && data.length > 0) {
        const { liked, total_likes } = data[0];
        
        // Update local liked state
        const newLikedSongs = { ...likedSongs, [songId]: liked };
        setLikedSongs(newLikedSongs);
        saveLikedSongs(newLikedSongs);

        // Update statistics
        setStatistics(prev => {
          const existing = prev.find(stat => stat.song_id === songId);
          if (existing) {
            return prev.map(stat => 
              stat.song_id === songId 
                ? { ...stat, total_likes, last_liked_at: liked ? new Date().toISOString() : stat.last_liked_at }
                : stat
            );
          } else {
            return [...prev, { 
              song_id: songId, 
              total_likes, 
              last_liked_at: liked ? new Date().toISOString() : null 
            }];
          }
        });

        console.log('Like toggled successfully:', { liked, total_likes });
        return { liked, total_likes };
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle like';
      setError(errorMessage);
      
      // Show a toast notification for better UX
      import('@/hooks/use-toast').then(({ toast }) => {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      });
    }
    
    return null;
  }, [getSessionId, likedSongs, saveLikedSongs]);

  // Get like count for a specific song
  const getLikeCount = useCallback((songId: string): number => {
    const stat = statistics.find(s => s.song_id === songId);
    return stat?.total_likes || 0;
  }, [statistics]);

  // Check if a song is liked by current user
  const isLiked = useCallback((songId: string): boolean => {
    return likedSongs[songId] || false;
  }, [likedSongs]);

  // Get total likes across all songs
  const getTotalLikes = useCallback((): number => {
    return statistics.reduce((total, stat) => total + stat.total_likes, 0);
  }, [statistics]);

  // Refresh statistics
  const refetch = useCallback(() => {
    setLoading(true);
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    loadLikedSongs();
    fetchStatistics();

    // Set up real-time subscription for like statistics
    const channel = supabase
      .channel('song_like_statistics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_like_statistics'
        },
        () => {
          fetchStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStatistics, loadLikedSongs]);

  return {
    statistics,
    loading,
    error,
    toggleLike,
    getLikeCount,
    isLiked,
    getTotalLikes,
    refetch
  };
};
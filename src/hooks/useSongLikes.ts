import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedNetworking } from '@/hooks/useOptimizedNetworking';

interface SongLikeStatistics {
  song_id: string;
  total_likes: number;
  last_liked_at: string | null;
}

interface LikedSongs {
  [songId: string]: boolean;
}

interface UseSongLikesOptions {
  fetchOnMount?: boolean;
  enableRealtime?: boolean;
}

export const useSongLikes = (options: UseSongLikesOptions = {}) => {
  const { fetchOnMount = true, enableRealtime = true } = options;
  const [statistics, setStatistics] = useState<SongLikeStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<LikedSongs>({});
  const { debouncedRequest } = useOptimizedNetworking();

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

  // Fetch like statistics from database with optimized networking
  const fetchStatistics = useCallback(async () => {
    return debouncedRequest(
      'fetch_like_statistics',
      async () => {
        setError(null);
        const { data, error: fetchError } = await supabase.rpc('get_song_like_statistics');
        
        if (fetchError) {
          throw fetchError;
        }
        
        setStatistics(data || []);
        return data;
      },
      { debounceMs: 500, retryAttempts: 2 }
    ).catch(err => {
      console.error('Error fetching like statistics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch like statistics');
      setStatistics([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [debouncedRequest]);

  // Optimized fetch for real-time updates
  const optimizedFetchStatistics = useCallback(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Toggle like for a song with optimized networking
  const toggleLike = useCallback(async (songId: string) => {
    return debouncedRequest(
      `toggle_like_${songId}`,
      async () => {
        setError(null);
        const sessionId = getSessionId();
        
        const { data, error: toggleError } = await supabase.rpc('toggle_song_like', {
          p_song_id: songId,
          p_user_session_id: sessionId
        });

        if (toggleError) {
          console.error('RPC error:', toggleError);
          throw toggleError;
        }

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

          return { liked, total_likes };
        }
        return null;
      },
      { debounceMs: 100, retryAttempts: 2 }
    ).catch(err => {
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
      return null;
    });
  }, [debouncedRequest, getSessionId, likedSongs, saveLikedSongs]);

  // Get like count for a specific song
  const getLikeCount = useCallback((songId: string): number => {
    const stat = statistics.find(s => s.song_id === songId);
    return stat?.total_likes || 0;
  }, [statistics]);

  // Check if a song is liked by current user
  const isLiked = useCallback((songId: string): boolean => {
    return likedSongs[songId] || false;
  }, [likedSongs]);

  // Get total likes across all songs (memoized for performance)
  const getTotalLikes = useMemo((): number => {
    return statistics.reduce((total, stat) => total + stat.total_likes, 0);
  }, [statistics]);

  // Refresh statistics
  const refetch = useCallback(() => {
    setLoading(true);
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    loadLikedSongs();
    
    // Only fetch on mount if specified
    if (fetchOnMount) {
      fetchStatistics();
    }

    // Only set up real-time subscription if enabled
    if (!enableRealtime) {
      return;
    }

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
          optimizedFetchStatistics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOnMount, enableRealtime, optimizedFetchStatistics, loadLikedSongs]);

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
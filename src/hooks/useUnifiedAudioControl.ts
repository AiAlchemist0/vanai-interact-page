import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useToast } from '@/hooks/use-toast';

export interface UnifiedAudioState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isCurrent: boolean;
  progress: number;
}

export const useUnifiedAudioControl = (songId: string, songIndex?: number, updateActivity?: () => void) => {
  const { 
    currentSong, 
    isPlaying, 
    currentSongIndex, 
    progress,
    loadSpecificSong,
    togglePlay,
    stopPlayback,
    startPlaylistMode,
    startPlayTracking
  } = useAudio();
  
  const { toast } = useToast();
  const [loadingSong, setLoadingSong] = useState<string | null>(null);
  const [lastPlayAttempt, setLastPlayAttempt] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minLoadingTimeRef = useRef<NodeJS.Timeout | null>(null);

  // Standardized current song detection - prioritize songId match for consistency
  const isCurrent = currentSong?.id === songId;
  
  const audioState: UnifiedAudioState = {
    isLoading: loadingSong === songId,
    isPlaying: isCurrent && isPlaying,
    isPaused: isCurrent && !isPlaying && currentSong !== null,
    isCurrent: isCurrent,
    progress: isCurrent ? progress : 0
  };

  // Clear loading timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (minLoadingTimeRef.current) {
        clearTimeout(minLoadingTimeRef.current);
      }
    };
  }, []);

  // Enhanced loading state management with minimum display time
  const setLoadingWithMinimumTime = (songId: string | null) => {
    if (songId) {
      setLoadingSong(songId);
      
      // Set minimum loading display time (500ms)
      minLoadingTimeRef.current = setTimeout(() => {
        // This ensures loading shows for at least 500ms
      }, 500);
      
      // Set maximum loading time (5 seconds timeout)
      loadingTimeoutRef.current = setTimeout(() => {
        if (loadingSong === songId) {
          setLoadingSong(null);
          toast({
            title: "Loading timeout",
            description: "Song took too long to load. Please try again.",
            variant: "destructive"
          });
        }
      }, 5000);
    } else {
      // Clear loading with delay to ensure minimum display time
      if (minLoadingTimeRef.current) {
        setTimeout(() => {
          setLoadingSong(null);
          if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
          }
        }, 200); // Small delay to ensure smooth transition
      } else {
        setLoadingSong(null);
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }
      }
    }
  };

  // Clear loading state when song actually starts playing
  useEffect(() => {
    if (isCurrent && isPlaying && loadingSong === songId) {
      // Add a slight delay to ensure "Loading..." is visible before "Now Playing"
      setTimeout(() => {
        setLoadingWithMinimumTime(null);
      }, 300);
    }
  }, [isCurrent, isPlaying, loadingSong, songId]);

  const handlePlay = async () => {
    // Optimized: Only update activity for meaningful interactions
    updateActivity?.();
    
    // If clicking on the currently playing song, toggle play/pause
    if (isCurrent && isPlaying) {
      togglePlay();
      return;
    }
    
    // If clicking on the current song and it's paused, resume
    if (isCurrent && !isPlaying && currentSong) {
      try {
        // Add console log for consistency with navigation panel
        console.log('▶️ Manual play: Starting play tracking for:', currentSong.title);
        togglePlay();
      } catch (error) {
        toast({
          title: "Playback blocked",
          description: "Please interact with the page first to enable audio.",
          variant: "destructive"
        });
      }
      return;
    }
    
    // Prevent duplicate tracking if this is the same song we just attempted
    if (lastPlayAttempt === songId) {
      console.log('🚫 Duplicate play attempt prevented for:', songId);
      return;
    }

    // If clicking on a different song, load it and start playback
    setLoadingWithMinimumTime(songId);
    setLastPlayAttempt(songId);
    
    try {
      // Get song metadata for console log
      const songs = await import('@/utils/songData');
      const songMetadata = songs.getSongMetadata(songId);
      
      // Enhanced console log with autoplay status
      console.log('▶️ Manual play: Starting play tracking for:', songMetadata.title);
      console.log('🎵 Audio context state:', {
        songId,
        userActivated: true,
        timestamp: new Date().toISOString()
      });
      
      // Start play tracking for the new song (geographic tracking is now session-based)
      await startPlayTracking(songId);
      
      // Load the specific song with autoplay flag
      loadSpecificSong(songId, true);
      
      // Clear duplicate prevention after successful load
      setTimeout(() => setLastPlayAttempt(null), 2000);
      
      // Note: Loading state will be cleared by the useEffect when song starts playing
    } catch (error) {
      setLoadingWithMinimumTime(null);
      setLastPlayAttempt(null);
      
      // Enhanced error logging
      console.error('❌ Playback failed:', error);
      if (error instanceof Error && error.message.includes('autoplay')) {
        console.log('🔇 Autoplay blocked - user interaction required');
        toast({
          title: "Audio blocked",
          description: "Click anywhere on the page first, then try playing the song.",
          variant: "default"
        });
      } else {
        toast({
          title: "Playback failed",
          description: "Could not play this song. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleStop = () => {
    updateActivity?.();
    stopPlayback();
    setLoadingWithMinimumTime(null);
  };

  return {
    audioState,
    handlePlay,
    handleStop
  };
};
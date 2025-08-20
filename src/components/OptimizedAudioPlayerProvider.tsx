import React, { ReactNode, useCallback, useMemo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { AudioProvider } from '@/contexts/AudioContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useEnhancedTracking } from '@/hooks/useEnhancedTracking';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useSongLikes } from '@/hooks/useSongLikes';
import { SONGS } from '@/utils/songData';
import AudioPlayer from './AudioPlayer';

interface OptimizedAudioPlayerProviderProps {
  children: ReactNode;
  enableAnalytics?: boolean;
}

/**
 * Optimized Audio Player Provider for main page
 * Reduces unnecessary data fetching while maintaining core functionality
 */
export const OptimizedAudioPlayerProvider: React.FC<OptimizedAudioPlayerProviderProps> = ({ 
  children, 
  enableAnalytics = false 
}) => {
  const audioPlayerHook = useAudioPlayer(SONGS);
  const enhancedTracking = useEnhancedTracking();
  const performanceMonitor = usePerformanceMonitor('OptimizedAudioPlayerProvider');
  
  // Optimized song likes - only fetch likes on mount, no real-time updates for main page
  const songLikes = useSongLikes({ 
    fetchOnMount: true, 
    enableRealtime: false 
  });

  const { 
    loadSpecificSong,
    startPlayback,
    isPlaying, 
    isLoadedAndReady,
    currentSongIndex, 
    currentSong,
    progress,
    currentTime,
    duration,
    setCurrentSongIndex,
    isPlaylistMode,
    setIsPlaylistMode,
    audioRef
  } = audioPlayerHook;

  const togglePlay = useCallback(async () => {
    return performanceMonitor.measureAsync(async () => {
      enhancedTracking.updateActivity();
      const audio = audioRef.current;
      if (!audio) return;
      
      if (audio.paused) {
        try {
          await audio.play();
          audioPlayerHook.setIsPlaying(true);
        } catch (e) {
          console.error('Audio play failed:', e);
        }
      } else {
        audio.pause();
        audioPlayerHook.setIsPlaying(false);
      }
    }, 'togglePlay');
  }, [enhancedTracking, audioPlayerHook, audioRef, performanceMonitor]);

  const nextSong = useCallback(() => {
    enhancedTracking.updateActivity();
    const wasPlaying = isPlaying;
    
    if (currentSongIndex < SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (isPlaylistMode) {
      setCurrentSongIndex(0);
    } else {
      setCurrentSongIndex(0);
    }

    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(() => console.log('Autoplay blocked on skip'));
        }
      }, 100);
    }
  }, [enhancedTracking, isPlaying, currentSongIndex, isPlaylistMode, setCurrentSongIndex, audioRef]);

  const previousSong = useCallback(() => {
    enhancedTracking.updateActivity();
    const wasPlaying = isPlaying;
    
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(SONGS.length - 1);
    }

    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(() => console.log('Autoplay blocked on skip'));
        }
      }, 100);
    }
  }, [enhancedTracking, isPlaying, currentSongIndex, setCurrentSongIndex, audioRef]);

  const stopPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, [audioRef]);

  const startPlaylistMode = useCallback(() => {
    enhancedTracking.updateActivity();
    setIsPlaylistMode(true);
    
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().then(() => {
          audioPlayerHook.setIsPlaying(true);
        }).catch(() => console.log('Autoplay blocked'));
      }
    }, 100);
  }, [enhancedTracking, setIsPlaylistMode, audioRef, audioPlayerHook]);

  const stopPlaylistMode = useCallback(() => {
    enhancedTracking.updateActivity();
    setIsPlaylistMode(false);
  }, [enhancedTracking, setIsPlaylistMode]);

  const contextValue = useMemo(() => ({
    ...audioPlayerHook,
    ...songLikes,
    togglePlay,
    nextSong,
    previousSong,
    stopPlayback,
    startPlaylistMode,
    stopPlaylistMode,
    songs: SONGS,
    // Enhanced tracking functions required by AudioContextType
    startPlayTracking: enhancedTracking.startPlayTracking,
    endPlayTracking: enhancedTracking.endPlayTracking,
    updateActivity: enhancedTracking.updateActivity,
    // Additional tracking data
    session: enhancedTracking.session,
    location: enhancedTracking.location,
    locationLoading: enhancedTracking.locationLoading,
  }), [
    audioPlayerHook,
    songLikes,
    togglePlay,
    nextSong,
    previousSong,
    stopPlayback,
    startPlaylistMode,
    stopPlaylistMode,
    enhancedTracking
  ]);

  return (
    <ErrorBoundary>
      <AudioProvider value={contextValue}>
        <AudioPlayer audioPlayerHook={audioPlayerHook} />
        {children}
      </AudioProvider>
    </ErrorBoundary>
  );
};

export default OptimizedAudioPlayerProvider;
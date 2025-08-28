import React, { useCallback, useMemo } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { SONGS } from '@/constants/songs';
import { AudioProvider } from '@/contexts/AudioContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useEnhancedTracking } from '@/hooks/useEnhancedTracking';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import ErrorBoundary from '@/components/ErrorBoundary';

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayerHook = useAudioPlayer(SONGS);
  const { updateActivity } = useEnhancedTracking();
  const { measureAsync, logPerformanceMetric } = usePerformanceMonitor('AudioPlayerProvider');
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
    return measureAsync(async () => {
      // Optimized: Minimal activity tracking for toggle operations
      const audio = audioRef.current;
      if (!audio) return;
      
      if (audio.paused) {
        try {
          await audio.play();
          audioPlayerHook.setIsPlaying(true);
          updateActivity(); // Only track meaningful playback starts
        } catch (e) {
          console.error('Audio play failed:', e);
        }
      } else {
        audio.pause();
        audioPlayerHook.setIsPlaying(false);
        // No activity tracking for pause to reduce overhead
      }
    }, 'togglePlay');
  }, [updateActivity, audioPlayerHook, audioRef, measureAsync]);

  const nextSong = useCallback(() => {
    updateActivity(); // Track meaningful navigation
    const wasPlaying = isPlaying;
    
    if (currentSongIndex < SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (isPlaylistMode) {
      setCurrentSongIndex(0); // Loop to first song in playlist mode
    } else {
      setCurrentSongIndex(0); // Loop to first song
    }

    // Auto-play if audio was playing before skip
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(() => console.log('Autoplay blocked on skip'));
        }
      }, 100);
    }
  }, [updateActivity, isPlaying, currentSongIndex, isPlaylistMode, setCurrentSongIndex, audioRef]);

  const previousSong = useCallback(() => {
    updateActivity(); // Track meaningful navigation
    const wasPlaying = isPlaying;
    
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(SONGS.length - 1); // Loop to last song
    }

    // Auto-play if audio was playing before skip
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(() => console.log('Autoplay blocked on skip'));
        }
      }, 100);
    }
  }, [updateActivity, isPlaying, currentSongIndex, setCurrentSongIndex, audioRef]);

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const startPlaylistMode = () => {
    updateActivity(); // Track meaningful mode change
    setIsPlaylistMode(true);
    
    // Always start playback for the current song, regardless of previous state
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        // Reset audio to beginning if it was previously playing a different song
        audio.currentTime = 0;
        audio.play().then(() => {
          audioPlayerHook.setIsPlaying(true);
        }).catch(() => console.log('Autoplay blocked'));
      }
    }, 100);
  };

  const stopPlaylistMode = () => {
    updateActivity(); // Track meaningful mode change
    setIsPlaylistMode(false);
    // Don't stop playback, just disable auto-advance
  };

  const { startPlayTracking, endPlayTracking } = useEnhancedTracking();

  const contextValue = useMemo(() => ({
    loadSpecificSong,
    startPlayback,
    togglePlay,
    nextSong,
    previousSong,
    stopPlayback,
    startPlaylistMode,
    stopPlaylistMode,
    isPlaying,
    isLoadedAndReady,
    isPlaylistMode,
    currentSongIndex,
    currentSong,
    songs: SONGS,
    progress,
    currentTime,
    duration,
    setCurrentSongIndex,
    // Enhanced tracking functions
    startPlayTracking,
    endPlayTracking,
    updateActivity,
  }), [
    loadSpecificSong, startPlayback, togglePlay, nextSong, previousSong,
    stopPlayback, startPlaylistMode, stopPlaylistMode, isPlaying,
    isLoadedAndReady, isPlaylistMode, currentSongIndex, currentSong,
    progress, currentTime, duration, setCurrentSongIndex,
    startPlayTracking, endPlayTracking, updateActivity
  ]);

  return (
    <ErrorBoundary>
      <AudioProvider value={contextValue}>
        {children}
        <AudioPlayer audioPlayerHook={audioPlayerHook} />
      </AudioProvider>
    </ErrorBoundary>
  );
};

export default AudioPlayerProvider;
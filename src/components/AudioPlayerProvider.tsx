import React from 'react';
import AudioPlayer, { SONGS } from '@/components/AudioPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useEnhancedTracking } from '@/hooks/useEnhancedTracking';

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayerHook = useAudioPlayer(SONGS);
  const { updateActivity } = useEnhancedTracking();
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

  const togglePlay = async () => {
    updateActivity(); // Track user interaction
    const audio = audioRef.current;
    if (!audio) return;
    
    if (audio.paused) {
      try {
        await audio.play();
      } catch (e) {
        console.error('Audio play failed:', e);
      }
    } else {
      audio.pause();
    }
  };

  const nextSong = () => {
    updateActivity(); // Track user interaction
    if (currentSongIndex < SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (isPlaylistMode) {
      setCurrentSongIndex(0); // Loop to first song in playlist mode
    } else {
      setCurrentSongIndex(0); // Loop to first song
    }
  };

  const previousSong = () => {
    updateActivity(); // Track user interaction
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(SONGS.length - 1); // Loop to last song
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  };

  const startPlaylistMode = () => {
    updateActivity(); // Track user interaction
    setIsPlaylistMode(true);
    
    // If not already playing, start from current song
    if (!isPlaying) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(() => console.log('Autoplay blocked'));
        }
      }, 100);
    }
  };

  const stopPlaylistMode = () => {
    updateActivity(); // Track user interaction
    setIsPlaylistMode(false);
    // Don't stop playback, just disable auto-advance
  };

  const contextValue = {
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
  };

  return (
    <AudioProvider value={contextValue}>
      {children}
      <AudioPlayer audioPlayerHook={audioPlayerHook} />
    </AudioProvider>
  );
};

export default AudioPlayerProvider;
import React from 'react';
import AudioPlayer, { SONGS } from '@/components/AudioPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayerHook = useAudioPlayer(SONGS);
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
    if (currentSongIndex < SONGS.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else if (isPlaylistMode) {
      setCurrentSongIndex(0); // Loop to first song in playlist mode
    } else {
      setCurrentSongIndex(0); // Loop to first song
    }
  };

  const previousSong = () => {
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
    setIsPlaylistMode(true);
    setCurrentSongIndex(0); // Start from first song
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => console.log('Autoplay blocked'));
      }
    }, 100);
  };

  const stopPlaylistMode = () => {
    setIsPlaylistMode(false);
    stopPlayback();
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
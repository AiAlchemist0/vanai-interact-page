import React from 'react';
import AudioPlayer, { SONGS } from '@/components/AudioPlayer';
import { AudioProvider } from '@/contexts/AudioContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayerHook = useAudioPlayer(SONGS);
  const { playSpecificSong, isPlaying, currentSongIndex, currentSong } = audioPlayerHook;

  const contextValue = {
    playSpecificSong,
    isPlaying,
    currentSongIndex,
    currentSong,
  };

  return (
    <AudioProvider value={contextValue}>
      {children}
      <AudioPlayer audioPlayerHook={audioPlayerHook} />
    </AudioProvider>
  );
};

export default AudioPlayerProvider;
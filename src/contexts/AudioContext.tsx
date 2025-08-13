import React, { createContext, useContext, ReactNode } from 'react';
import { Song } from '@/hooks/useAudioPlayer';

interface AudioContextType {
  playSpecificSong: (songId: string) => void;
  togglePlay: () => void;
  nextSong: () => void;
  previousSong: () => void;
  stopPlayback: () => void;
  isPlaying: boolean;
  currentSongIndex: number;
  currentSong: Song;
  songs: Song[];
  progress: number;
  currentTime: number;
  duration: number;
  setCurrentSongIndex: (index: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
  value: AudioContextType;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  value,
}) => {
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
import React, { createContext, useContext, ReactNode } from 'react';

interface AudioContextType {
  playSpecificSong: (songId: string) => void;
  isPlaying: boolean;
  currentSongIndex: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

interface AudioProviderProps {
  children: ReactNode;
  playSpecificSong: (songId: string) => void;
  isPlaying: boolean;
  currentSongIndex: number;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  playSpecificSong,
  isPlaying,
  currentSongIndex,
}) => {
  return (
    <AudioContext.Provider
      value={{
        playSpecificSong,
        isPlaying,
        currentSongIndex,
      }}
    >
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
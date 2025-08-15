import React from 'react';

// Define the song structure
export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverArt: string;
  lyrics: { time: number; text: string }[];
}

export const useAudioPlayer = (songs: Song[]) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = React.useState(false);
  const [hasUserInteracted, setHasUserInteracted] = React.useState(false);
  const [audioError, setAudioError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fileAvailable, setFileAvailable] = React.useState<boolean | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const [showLyricsOnly, setShowLyricsOnly] = React.useState(false);
  const [playbackMode, setPlaybackMode] = React.useState<"off" | "next" | "repeat" | "repeat-all">("next");
  const [isLoadedAndReady, setIsLoadedAndReady] = React.useState(false);

  const currentSong = songs[currentSongIndex];

  // Function to load and prepare a specific song by ID
  const loadSpecificSong = React.useCallback((songId: string) => {
    const songIndex = songs.findIndex(song => song.id === songId);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
      setHasUserInteracted(true);
      setIsLoadedAndReady(true);
      setIsLoading(false);
      setAudioError(null);
    }
  }, [songs]);

  // Function to start playing the loaded song
  const startPlayback = React.useCallback(() => {
    if (isLoadedAndReady) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(() => {
            setIsPlaying(true);
            setIsLoadedAndReady(false);
          }).catch(() => setAutoplayBlocked(true));
        }
      }, 100);
    }
  }, [isLoadedAndReady]);

  return {
    // Refs
    audioRef,
    
    // State
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    autoplayBlocked,
    setAutoplayBlocked,
    hasUserInteracted,
    setHasUserInteracted,
    audioError,
    setAudioError,
    isLoading,
    setIsLoading,
    fileAvailable,
    setFileAvailable,
    retryCount,
    setRetryCount,
    showLyricsOnly,
    setShowLyricsOnly,
    playbackMode,
    setPlaybackMode,
    isLoadedAndReady,
    setIsLoadedAndReady,
    
    // Computed
    currentSong,
    
    // Functions
    loadSpecificSong,
    startPlayback,
  };
};
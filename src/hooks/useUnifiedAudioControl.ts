import { useState } from 'react';
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
    startPlaylistMode
  } = useAudio();
  
  const { toast } = useToast();
  const [loadingSong, setLoadingSong] = useState<string | null>(null);

  // Standardized current song detection - prioritize songId match for consistency
  const isCurrent = currentSong?.id === songId;
  
  const audioState: UnifiedAudioState = {
    isLoading: loadingSong === songId,
    isPlaying: isCurrent && isPlaying,
    isPaused: isCurrent && !isPlaying && currentSong !== null,
    isCurrent: isCurrent,
    progress: isCurrent ? progress : 0
  };

  const handlePlay = async () => {
    updateActivity?.();
    
    // If clicking on the currently playing song, toggle play/pause
    if (isCurrent && isPlaying) {
      togglePlay();
      return;
    }
    
    // If clicking on the current song and it's paused, resume
    if (isCurrent && !isPlaying && currentSong) {
      try {
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
    
    // If clicking on a different song, load it and start playback immediately
    setLoadingSong(songId);
    try {
      // Load the specific song first
      loadSpecificSong(songId);
      
      // Start playlist mode immediately with proper error handling
      setTimeout(() => {
        startPlaylistMode();
        setLoadingSong(null);
      }, 50); // Reduced delay for better UX
    } catch (error) {
      setLoadingSong(null);
      toast({
        title: "Playback failed",
        description: "Could not play this song. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStop = () => {
    updateActivity?.();
    stopPlayback();
    setLoadingSong(null);
  };

  return {
    audioState,
    handlePlay,
    handleStop
  };
};
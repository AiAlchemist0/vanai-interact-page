import { useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTracking } from '@/hooks/useEnhancedTracking';

export interface UnifiedAudioState {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isCurrent: boolean;
  progress: number;
}

export const useUnifiedAudioControl = (songId: string, songIndex?: number) => {
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
  const { updateActivity } = useEnhancedTracking();
  const [loadingSong, setLoadingSong] = useState<string | null>(null);

  const isCurrent = currentSong?.id === songId;
  const isCurrentIndex = songIndex !== undefined ? songIndex === currentSongIndex : isCurrent;
  
  const audioState: UnifiedAudioState = {
    isLoading: loadingSong === songId,
    isPlaying: isCurrentIndex && isPlaying,
    isPaused: isCurrentIndex && !isPlaying && currentSong !== null,
    isCurrent: isCurrent,
    progress: isCurrent ? progress : 0
  };

  const handlePlay = async () => {
    updateActivity();
    
    // If clicking on the currently playing song, toggle play/pause
    if (isCurrentIndex && isPlaying) {
      togglePlay();
      return;
    }
    
    // If clicking on the current song and it's paused, resume
    if (isCurrentIndex && !isPlaying && currentSong) {
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
    
    // If clicking on a different song, behave exactly like "Play all songs" button
    setLoadingSong(songId);
    try {
      // Load the specific song first
      loadSpecificSong(songId);
      
      // Use the same timing and approach as startPlaylistMode (100ms delay)
      setTimeout(async () => {
        try {
          await startPlaylistMode();
          setLoadingSong(null);
        } catch (error) {
          setLoadingSong(null);
          toast({
            title: "Autoplay blocked",
            description: "Please interact with the page first to enable playlist mode.",
            variant: "destructive"
          });
        }
      }, 100);
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
    updateActivity();
    stopPlayback();
    setLoadingSong(null);
  };

  return {
    audioState,
    handlePlay,
    handleStop
  };
};
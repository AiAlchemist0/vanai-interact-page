import { useEffect, useCallback, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface UseModalAudioProtectionOptions {
  isModalOpen: boolean;
  onModalStateChange?: (isOpen: boolean) => void;
}

export const useModalAudioProtection = ({ 
  isModalOpen, 
  onModalStateChange 
}: UseModalAudioProtectionOptions) => {
  const { isPlaying, currentSong } = useAudio();

  // Store the audio state when modal opens
  const audioStateRef = useRef<{
    wasPlaying: boolean;
    currentSongId?: string;
  }>({ wasPlaying: false });

  // Protect audio playback when modal opens
  useEffect(() => {
    if (isModalOpen && isPlaying && currentSong) {
      // Store current state
      audioStateRef.current = {
        wasPlaying: true,
        currentSongId: currentSong.id
      };
      
      // Prevent focus/blur events from stopping audio
      const preventAudioInterruption = (e: Event) => {
        e.stopImmediatePropagation();
      };

      // Add event listeners to prevent audio interruption
      document.addEventListener('focusout', preventAudioInterruption, true);
      document.addEventListener('blur', preventAudioInterruption, true);
      
      return () => {
        document.removeEventListener('focusout', preventAudioInterruption, true);
        document.removeEventListener('blur', preventAudioInterruption, true);
      };
    }
  }, [isModalOpen, isPlaying, currentSong]);

  // Handle modal close with audio state restoration
  const handleModalClose = useCallback(() => {
    onModalStateChange?.(false);
    
    // Reset audio state reference
    audioStateRef.current = { wasPlaying: false };
  }, [onModalStateChange]);

  // Prevent event propagation for tab clicks
  const handleTabClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ensure audio context stays active
    if (isPlaying && currentSong) {
      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio && audio.paused) {
        audio.play().catch(() => {
          console.log('Audio resume blocked after tab click');
        });
      }
    }
  }, [isPlaying, currentSong]);

  return {
    handleModalClose,
    handleTabClick,
    isAudioProtected: isModalOpen && isPlaying
  };
};
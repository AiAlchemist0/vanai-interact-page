import { useState, useEffect, useCallback } from 'react';

interface AudioInteractionState {
  hasInteracted: boolean;
  autoplayBlocked: boolean;
  needsInteraction: boolean;
  showPrimer: boolean;
}

export const useAudioInteractionGuard = () => {
  const [state, setState] = useState<AudioInteractionState>({
    hasInteracted: false,
    autoplayBlocked: false,
    needsInteraction: false,
    showPrimer: false
  });

  // Check if user has previously interacted (stored in sessionStorage)
  useEffect(() => {
    const hasInteracted = sessionStorage.getItem('audio-interaction-granted') === 'true';
    setState(prev => ({ 
      ...prev, 
      hasInteracted,
      needsInteraction: !hasInteracted 
    }));
  }, []);

  // Test audio context and detect autoplay blocking
  const testAudioContext = useCallback(async (): Promise<boolean> => {
    try {
      // Create a minimal audio context test
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create a brief silent audio test
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.01);

      // Mark as successfully interacted
      sessionStorage.setItem('audio-interaction-granted', 'true');
      setState(prev => ({
        ...prev,
        hasInteracted: true,
        autoplayBlocked: false,
        needsInteraction: false
      }));

      console.log('✅ Audio context test successful - audio enabled');
      return true;

    } catch (error) {
      console.warn('⚠️ Audio context test failed:', error);
      setState(prev => ({
        ...prev,
        autoplayBlocked: true,
        needsInteraction: true
      }));
      return false;
    }
  }, []);

  // Handle first-time setup
  const showInteractionPrimer = useCallback(() => {
    setState(prev => ({ ...prev, showPrimer: true }));
  }, []);

  const hideInteractionPrimer = useCallback(() => {
    setState(prev => ({ ...prev, showPrimer: false }));
  }, []);

  // Detect autoplay block (typically called when play() promise rejects)
  const handleAutoplayBlocked = useCallback(() => {
    console.log('🔇 Autoplay blocked detected');
    setState(prev => ({
      ...prev,
      autoplayBlocked: true,
      needsInteraction: true
    }));
  }, []);

  // Mark interaction complete
  const markInteractionComplete = useCallback(() => {
    sessionStorage.setItem('audio-interaction-granted', 'true');
    setState(prev => ({
      ...prev,
      hasInteracted: true,
      autoplayBlocked: false,
      needsInteraction: false
    }));
  }, []);

  return {
    ...state,
    testAudioContext,
    showInteractionPrimer,
    hideInteractionPrimer,
    handleAutoplayBlocked,
    markInteractionComplete
  };
};
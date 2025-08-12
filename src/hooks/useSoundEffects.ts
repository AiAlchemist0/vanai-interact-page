import { useCallback, useRef } from 'react';

export type SoundEffect = 'hit_perfect' | 'hit_good' | 'hit_okay' | 'miss' | 'combo_milestone' | 'star_power';

interface SoundEffectsSettings {
  volume: number;
  enabled: boolean;
}

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const settings = useRef<SoundEffectsSettings>({ volume: 0.7, enabled: true });

  // Initialize Web Audio API
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Generate tone using Web Audio API
  const generateTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    // Envelope for smooth attack/decay
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(settings.current.volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [initAudioContext]);

  // Generate complex chord sound
  const generateChord = useCallback((frequencies: number[], duration: number) => {
    frequencies.forEach(freq => {
      generateTone(freq, duration, 'triangle');
    });
  }, [generateTone]);

  // Generate noise-based sound
  const generateNoise = useCallback((duration: number, filterFreq: number) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    // Create noise buffer
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gainNode = audioContext.createGain();

    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, audioContext.currentTime);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(settings.current.volume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    source.start(audioContext.currentTime);
    source.stop(audioContext.currentTime + duration);
  }, [initAudioContext]);

  const playSound = useCallback((effect: SoundEffect) => {
    if (!settings.current.enabled) return;

    switch (effect) {
      case 'hit_perfect':
        generateChord([523.25, 659.25, 783.99], 0.15); // C major chord (higher octave)
        break;
      
      case 'hit_good':
        generateChord([440, 554.37, 659.25], 0.12); // A major chord
        break;
      
      case 'hit_okay':
        generateTone(392, 0.1, 'triangle'); // G note
        break;
      
      case 'miss':
        generateNoise(0.2, 200); // Low-frequency noise
        break;
      
      case 'combo_milestone':
        // Ascending arpeggio
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.08, 'sine'), i * 50);
        });
        break;
      
      case 'star_power':
        // Magical chime effect
        [523.25, 698.46, 880, 1174.66].forEach((freq, i) => {
          setTimeout(() => generateTone(freq, 0.3, 'sine'), i * 100);
        });
        break;
    }
  }, [generateTone, generateChord, generateNoise]);

  const setVolume = useCallback((volume: number) => {
    settings.current.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    settings.current.enabled = enabled;
  }, []);

  return {
    playSound,
    setVolume,
    setEnabled,
    settings: settings.current
  };
};
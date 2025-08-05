class GameAudio {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = duration * sampleRate;
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(t * 10, 1) * Math.min((duration - t) * 10, 1);
      channelData[i] = sample * envelope * 0.1; // Lower volume
    }

    return buffer;
  }

  preloadSounds() {
    if (!this.enabled || !this.audioContext) return;

    // Create sound effects
    const soundDefinitions = [
      { name: 'step', frequency: 200, duration: 0.1, type: 'sine' as OscillatorType },
      { name: 'interact', frequency: 440, duration: 0.2, type: 'sine' as OscillatorType },
      { name: 'unlock', frequency: 660, duration: 0.5, type: 'sine' as OscillatorType },
      { name: 'discover', frequency: 880, duration: 0.3, type: 'sine' as OscillatorType },
      { name: 'success', frequency: 523, duration: 0.4, type: 'sine' as OscillatorType },
      { name: 'ambient', frequency: 110, duration: 2.0, type: 'sine' as OscillatorType }
    ];

    soundDefinitions.forEach(({ name, frequency, duration, type }) => {
      const buffer = this.createTone(frequency, duration, type);
      if (buffer) {
        this.sounds.set(name, buffer);
      }
    });
  }

  playSound(name: string, volume: number = 0.5) {
    if (!this.enabled || !this.audioContext || !this.sounds.has(name)) return;

    try {
      const buffer = this.sounds.get(name)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  playMovementSound() {
    this.playSound('step', 0.1);
  }

  playInteractionSound() {
    this.playSound('interact', 0.3);
  }

  playUnlockSound() {
    this.playSound('unlock', 0.4);
  }

  playDiscoverySound() {
    this.playSound('discover', 0.5);
  }

  playSuccessSound() {
    this.playSound('success', 0.4);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const gameAudio = new GameAudio();
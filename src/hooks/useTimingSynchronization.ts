import { useState, useCallback, useRef, useEffect } from 'react';

export interface CalibrationSettings {
  audioOffset: number;    // Audio delay compensation (ms)
  visualOffset: number;   // Visual timing adjustment (ms)
  noteSpeed: number;      // Speed multiplier for note movement
  hitWindow: {
    perfect: number;
    good: number;
    okay: number;
  };
}

export interface TimingMetrics {
  averageLatency: number;
  consistency: number;
  driftDetected: boolean;
  lastCalibration: number;
}

export const useTimingSynchronization = () => {
  const [settings, setSettings] = useState<CalibrationSettings>({
    audioOffset: 0,
    visualOffset: 0,
    noteSpeed: 1.0,
    hitWindow: { perfect: 75, good: 150, okay: 250 }
  });

  const [metrics, setMetrics] = useState<TimingMetrics>({
    averageLatency: 0,
    consistency: 100,
    driftDetected: false,
    lastCalibration: Date.now()
  });

  const latencyMeasurements = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastDriftCheckRef = useRef<number>(0);

  // Initialize audio context for precise timing
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const measureAudioLatency = useCallback(async (): Promise<number> => {
    if (!audioContextRef.current) return 0;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const analyser = context.createAnalyser();
    
    oscillator.connect(analyser);
    analyser.connect(context.destination);
    
    const startTime = performance.now();
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
    
    const endTime = performance.now();
    const latency = endTime - startTime;
    
    latencyMeasurements.current.push(latency);
    if (latencyMeasurements.current.length > 10) {
      latencyMeasurements.current = latencyMeasurements.current.slice(-10);
    }

    const averageLatency = latencyMeasurements.current.reduce((sum, l) => sum + l, 0) / latencyMeasurements.current.length;
    const variance = latencyMeasurements.current.reduce((sum, l) => sum + Math.pow(l - averageLatency, 2), 0) / latencyMeasurements.current.length;
    const consistency = Math.max(0, 100 - Math.sqrt(variance));

    setMetrics(prev => ({
      ...prev,
      averageLatency,
      consistency,
      lastCalibration: Date.now()
    }));

    return latency;
  }, []);

  const autoCalibrate = useCallback(async () => {
    console.log('🔧 Starting auto-calibration...');
    
    // Measure multiple samples for better accuracy
    const measurements: number[] = [];
    for (let i = 0; i < 5; i++) {
      const latency = await measureAudioLatency();
      measurements.push(latency);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const avgLatency = measurements.reduce((sum, l) => sum + l, 0) / measurements.length;
    const recommendedAudioOffset = Math.round(avgLatency);

    setSettings(prev => ({
      ...prev,
      audioOffset: recommendedAudioOffset,
      visualOffset: Math.round(recommendedAudioOffset * 0.3) // Visual typically needs less compensation
    }));

    console.log(`✅ Auto-calibration complete: Audio offset ${recommendedAudioOffset}ms, Visual offset ${Math.round(recommendedAudioOffset * 0.3)}ms`);
    
    return { audioOffset: recommendedAudioOffset, visualOffset: Math.round(recommendedAudioOffset * 0.3) };
  }, [measureAudioLatency]);

  const detectDrift = useCallback((currentTime: number, audioTime: number) => {
    const now = performance.now();
    if (now - lastDriftCheckRef.current < 5000) return; // Check every 5 seconds
    
    lastDriftCheckRef.current = now;
    
    const expectedDiff = settings.audioOffset;
    const actualDiff = currentTime - (audioTime * 1000);
    const driftAmount = Math.abs(actualDiff - expectedDiff);
    
    if (driftAmount > 100) { // More than 100ms drift
      setMetrics(prev => ({ ...prev, driftDetected: true }));
      console.warn(`⚠️ Timing drift detected: ${driftAmount.toFixed(1)}ms`);
    } else {
      setMetrics(prev => ({ ...prev, driftDetected: false }));
    }
  }, [settings.audioOffset]);

  const calculateSynchronizedTime = useCallback((audioTime: number, visualTime: number): number => {
    const audioTimeMs = audioTime * 1000;
    const compensatedAudioTime = audioTimeMs + settings.audioOffset;
    const compensatedVisualTime = visualTime + settings.visualOffset;
    
    // Use audio time as primary source with visual compensation
    return compensatedAudioTime;
  }, [settings.audioOffset, settings.visualOffset]);

  const adjustForDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const difficultySettings = {
      easy: { noteSpeed: 0.7, hitWindow: { perfect: 100, good: 200, okay: 350 } },
      medium: { noteSpeed: 0.85, hitWindow: { perfect: 85, good: 170, okay: 300 } },
      hard: { noteSpeed: 1.0, hitWindow: { perfect: 75, good: 150, okay: 250 } },
      expert: { noteSpeed: 1.3, hitWindow: { perfect: 60, good: 120, okay: 200 } }
    };

    setSettings(prev => ({
      ...prev,
      noteSpeed: difficultySettings[difficulty].noteSpeed,
      hitWindow: difficultySettings[difficulty].hitWindow
    }));
  }, []);

  const updateAudioOffset = useCallback((offset: number) => {
    setSettings(prev => ({ ...prev, audioOffset: offset }));
  }, []);

  const updateVisualOffset = useCallback((offset: number) => {
    setSettings(prev => ({ ...prev, visualOffset: offset }));
  }, []);

  const updateNoteSpeed = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, noteSpeed: Math.max(0.1, Math.min(3.0, speed)) }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings({
      audioOffset: 0,
      visualOffset: 0,
      noteSpeed: 1.0,
      hitWindow: { perfect: 75, good: 150, okay: 250 }
    });
    setMetrics({
      averageLatency: 0,
      consistency: 100,
      driftDetected: false,
      lastCalibration: Date.now()
    });
  }, []);

  const calculateNotePosition = useCallback((noteTime: number, currentTime: number): [number, number, number] => {
    const timeDiff = noteTime - currentTime;
    const distance = (timeDiff / 1000) * settings.noteSpeed * 2; // 2 units per second base speed
    
    return [0, 0, Math.max(-10, Math.min(5, distance))];
  }, [settings.noteSpeed]);

  return {
    settings,
    metrics,
    autoCalibrate,
    detectDrift,
    calculateSynchronizedTime,
    adjustForDifficulty,
    updateAudioOffset,
    updateVisualOffset,
    updateNoteSpeed,
    resetToDefaults,
    calculateNotePosition,
    measureAudioLatency
  };
};
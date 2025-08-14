import { useState, useCallback, useRef, useEffect } from 'react';

export interface PracticeModeSettings {
  enabled: boolean;
  speed: number;           // 0.1 to 2.0
  showNoteNames: boolean;
  showTimingIndicator: boolean;
  pauseOnMiss: boolean;
  loopSection: boolean;
  sectionStart?: number;
  sectionEnd?: number;
}

export interface VisualMetronome {
  enabled: boolean;
  bpm: number;
  beat: number;
  subdivision: 'quarter' | 'eighth' | 'sixteenth';
  volume: number;
}

export interface PerformanceStats {
  streakBest: number;
  streakCurrent: number;
  improvementRate: number;
  weakestFrets: number[];
  strongestFrets: number[];
  averageAccuracy: number;
  sessionStats: {
    notesPlayed: number;
    perfectHits: number;
    goodHits: number;
    okayHits: number;
    misses: number;
    startTime: number;
  };
}

export const useEnhancedFeedback = () => {
  const [practiceMode, setPracticeMode] = useState<PracticeModeSettings>({
    enabled: false,
    speed: 1.0,
    showNoteNames: true,
    showTimingIndicator: true,
    pauseOnMiss: false,
    loopSection: false
  });

  const [metronome, setMetronome] = useState<VisualMetronome>({
    enabled: false,
    bpm: 120,
    beat: 0,
    subdivision: 'quarter',
    volume: 0.3
  });

  const [stats, setStats] = useState<PerformanceStats>({
    streakBest: 0,
    streakCurrent: 0,
    improvementRate: 0,
    weakestFrets: [],
    strongestFrets: [],
    averageAccuracy: 100,
    sessionStats: {
      notesPlayed: 0,
      perfectHits: 0,
      goodHits: 0,
      okayHits: 0,
      misses: 0,
      startTime: Date.now()
    }
  });

  const fretStats = useRef<Map<number, { hits: number; misses: number }>>(new Map());
  const accuracyHistory = useRef<number[]>([]);
  const metronomeAudio = useRef<AudioContext | null>(null);
  const beatInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context for metronome
  useEffect(() => {
    if (typeof window !== 'undefined' && !metronomeAudio.current) {
      metronomeAudio.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Visual metronome tick sound
  const playMetronomeTick = useCallback((isDownbeat: boolean = false) => {
    if (!metronomeAudio.current || metronome.volume === 0) return;

    const context = metronomeAudio.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Different pitch for downbeat vs regular beat
    oscillator.frequency.setValueAtTime(isDownbeat ? 800 : 400, context.currentTime);
    gainNode.gain.setValueAtTime(metronome.volume, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  }, [metronome.volume]);

  // Start/stop metronome
  const toggleMetronome = useCallback(() => {
    if (metronome.enabled) {
      if (beatInterval.current) {
        clearInterval(beatInterval.current);
        beatInterval.current = null;
      }
      setMetronome(prev => ({ ...prev, enabled: false, beat: 0 }));
    } else {
      const beatDuration = (60 / metronome.bpm) * 1000; // ms per beat
      const subdivisionMultiplier = {
        quarter: 1,
        eighth: 0.5,
        sixteenth: 0.25
      }[metronome.subdivision];

      setMetronome(prev => ({ ...prev, enabled: true }));
      
      beatInterval.current = setInterval(() => {
        setMetronome(prev => {
          const newBeat = (prev.beat + 1) % 4;
          playMetronomeTick(newBeat === 0);
          return { ...prev, beat: newBeat };
        });
      }, beatDuration * subdivisionMultiplier);
    }
  }, [metronome.enabled, metronome.bpm, metronome.subdivision, playMetronomeTick]);

  // Update metronome BPM
  const updateMetronomeBPM = useCallback((bpm: number) => {
    setMetronome(prev => ({ ...prev, bpm: Math.max(60, Math.min(200, bpm)) }));
    
    // Restart if currently running
    if (metronome.enabled) {
      toggleMetronome();
      setTimeout(toggleMetronome, 100);
    }
  }, [metronome.enabled, toggleMetronome]);

  // Practice mode controls
  const togglePracticeMode = useCallback(() => {
    setPracticeMode(prev => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setPracticeSpeed = useCallback((speed: number) => {
    setPracticeMode(prev => ({ 
      ...prev, 
      speed: Math.max(0.1, Math.min(2.0, speed)) 
    }));
  }, []);

  const setLoopSection = useCallback((start: number, end: number) => {
    setPracticeMode(prev => ({
      ...prev,
      loopSection: true,
      sectionStart: start,
      sectionEnd: end
    }));
  }, []);

  // Performance tracking
  const recordHit = useCallback((fret: number, grade: 'perfect' | 'good' | 'okay' | 'miss') => {
    // Update fret-specific stats
    const fretStat = fretStats.current.get(fret) || { hits: 0, misses: 0 };
    if (grade === 'miss') {
      fretStat.misses++;
    } else {
      fretStat.hits++;
    }
    fretStats.current.set(fret, fretStat);

    // Update session stats
    setStats(prev => {
      const newSessionStats = { ...prev.sessionStats };
      newSessionStats.notesPlayed++;
      
      switch (grade) {
        case 'perfect':
          newSessionStats.perfectHits++;
          break;
        case 'good':
          newSessionStats.goodHits++;
          break;
        case 'okay':
          newSessionStats.okayHits++;
          break;
        case 'miss':
          newSessionStats.misses++;
          break;
      }

      // Update streak
      const newStreakCurrent = grade === 'miss' ? 0 : prev.streakCurrent + 1;
      const newStreakBest = Math.max(prev.streakBest, newStreakCurrent);

      return {
        ...prev,
        streakCurrent: newStreakCurrent,
        streakBest: newStreakBest,
        sessionStats: newSessionStats
      };
    });
  }, []);

  // Calculate performance insights
  const calculateInsights = useCallback(() => {
    const fretAccuracies = new Map<number, number>();
    
    fretStats.current.forEach((stat, fret) => {
      const total = stat.hits + stat.misses;
      const accuracy = total > 0 ? (stat.hits / total) * 100 : 100;
      fretAccuracies.set(fret, accuracy);
    });

    const sortedFrets = Array.from(fretAccuracies.entries()).sort((a, b) => a[1] - b[1]);
    const weakestFrets = sortedFrets.slice(0, 2).map(([fret]) => fret);
    const strongestFrets = sortedFrets.slice(-2).map(([fret]) => fret);

    const totalNotes = stats.sessionStats.notesPlayed;
    const successfulHits = stats.sessionStats.perfectHits + stats.sessionStats.goodHits + stats.sessionStats.okayHits;
    const currentAccuracy = totalNotes > 0 ? (successfulHits / totalNotes) * 100 : 100;

    accuracyHistory.current.push(currentAccuracy);
    if (accuracyHistory.current.length > 100) {
      accuracyHistory.current = accuracyHistory.current.slice(-100);
    }

    const averageAccuracy = accuracyHistory.current.reduce((sum, acc) => sum + acc, 0) / accuracyHistory.current.length;
    
    // Calculate improvement rate (accuracy trend over last 10 measurements)
    const recentAccuracy = accuracyHistory.current.slice(-10);
    const improvementRate = recentAccuracy.length > 5 
      ? ((recentAccuracy[recentAccuracy.length - 1] - recentAccuracy[0]) / recentAccuracy.length)
      : 0;

    setStats(prev => ({
      ...prev,
      weakestFrets,
      strongestFrets,
      averageAccuracy,
      improvementRate
    }));
  }, [stats.sessionStats]);

  // Auto-calculate insights periodically
  useEffect(() => {
    const interval = setInterval(calculateInsights, 5000);
    return () => clearInterval(interval);
  }, [calculateInsights]);

  // Practice mode suggestions
  const getSuggestions = useCallback((): string[] => {
    const suggestions: string[] = [];
    
    if (stats.averageAccuracy < 70) {
      suggestions.push("Try slowing down the practice speed to build accuracy first");
    }
    
    if (stats.weakestFrets.length > 0) {
      const fretNames = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];
      suggestions.push(`Focus on ${stats.weakestFrets.map(f => fretNames[f]).join(' and ')} frets`);
    }
    
    if (stats.streakBest < 10) {
      suggestions.push("Enable pause-on-miss to build consistent patterns");
    }
    
    if (stats.improvementRate < 0) {
      suggestions.push("Take a break - fatigue might be affecting your performance");
    }

    return suggestions;
  }, [stats]);

  // Reset session stats
  const resetSession = useCallback(() => {
    setStats(prev => ({
      ...prev,
      sessionStats: {
        notesPlayed: 0,
        perfectHits: 0,
        goodHits: 0,
        okayHits: 0,
        misses: 0,
        startTime: Date.now()
      },
      streakCurrent: 0
    }));
    fretStats.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (beatInterval.current) {
        clearInterval(beatInterval.current);
      }
    };
  }, []);

  return {
    practiceMode,
    metronome,
    stats,
    togglePracticeMode,
    setPracticeSpeed,
    setLoopSection,
    toggleMetronome,
    updateMetronomeBPM,
    recordHit,
    calculateInsights,
    getSuggestions,
    resetSession,
    updatePracticeMode: setPracticeMode,
    updateMetronome: setMetronome
  };
};
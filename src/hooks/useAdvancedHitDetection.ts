import { useState, useCallback, useRef } from 'react';
import { NotePattern } from '@/pages/Game';

export type HitGrade = 'perfect' | 'good' | 'okay' | 'miss';

export interface HitResult {
  grade: HitGrade;
  points: number;
  multiplier: number;
  timingDiff: number;
  isChord: boolean;
  fretMatches: boolean;
}

export interface HitWindowSettings {
  perfect: number;
  good: number;
  okay: number;
}

export interface HitStats {
  totalNotesHit: number;
  perfectHits: number;
  goodHits: number;
  okayHits: number;
  missedNotes: number;
  accuracy: number;
  averageTimingError: number;
}

export const useAdvancedHitDetection = (hitWindow?: HitWindowSettings) => {
  const defaultHitWindow = hitWindow || { 
    perfect: 75,   // Generous perfect window
    good: 150,     // Good window
    okay: 250      // Okay window
  };

  const [totalNotesHit, setTotalNotesHit] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [okayHits, setOkayHits] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);
  const [timingErrors, setTimingErrors] = useState<number[]>([]);
  
  // Grace period for holding frets before/after strum
  const fretGracePeriod = 200; // ms

  const calculateHitGrade = useCallback((timingDiff: number): HitGrade => {
    const absTimingDiff = Math.abs(timingDiff);
    
    if (absTimingDiff <= defaultHitWindow.perfect) return 'perfect';
    if (absTimingDiff <= defaultHitWindow.good) return 'good';
    if (absTimingDiff <= defaultHitWindow.okay) return 'okay';
    return 'miss';
  }, [defaultHitWindow]);

  const calculatePoints = useCallback((grade: HitGrade, isChord: boolean, combo: number): number => {
    const basePoints = isChord ? 150 : 50;
    
    const gradeMultiplier = {
      perfect: 5,   // Increased rewards for precision
      good: 3,
      okay: 1,
      miss: 0
    }[grade];

    // Improved combo system
    const comboMultiplier = Math.min(Math.floor(combo / 10) + 1, 8);
    
    return basePoints * gradeMultiplier * comboMultiplier;
  }, []);

  const checkFretMatch = useCallback((notePattern: NotePattern, pressedFrets: Set<number>): boolean => {
    const requiredFrets = new Set(notePattern.frets);
    const pressedFretsArray = Array.from(pressedFrets);
    
    // Exact match required - all pressed frets must be required, and all required frets must be pressed
    const isExactMatch = requiredFrets.size === pressedFrets.size && 
                        pressedFretsArray.every(fret => requiredFrets.has(fret));
    
    console.log(`Fret match check: required=[${notePattern.frets.join(',')}], pressed=[${pressedFretsArray.join(',')}], match=${isExactMatch}`);
    
    return isExactMatch;
  }, []);

  const findHittableNotes = useCallback((
    notes: NotePattern[], 
    currentTime: number
  ): NotePattern[] => {
    // Find notes within the hit window
    return notes.filter(note => {
      const timingDiff = Math.abs(note.time - currentTime);
      return timingDiff <= defaultHitWindow.okay;
    }).sort((a, b) => Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime));
  }, [defaultHitWindow]);

  const processHit = useCallback((
    notes: NotePattern[],
    currentTime: number,
    pressedFrets: Set<number>,
    combo: number
  ): { result: HitResult | null, hitNote: NotePattern | null } => {
    
    // Find all hittable notes
    const hittableNotes = findHittableNotes(notes, currentTime);
    
    if (hittableNotes.length === 0) {
      console.log('No hittable notes in range');
      return { result: null, hitNote: null };
    }

    // Get the closest note
    const closestNote = hittableNotes[0];
    const timingDiff = closestNote.time - currentTime;
    const grade = calculateHitGrade(timingDiff);
    
    // Check if frets match
    const fretMatches = checkFretMatch(closestNote, pressedFrets);
    
    console.log(`Hit attempt: note@${closestNote.time}, current@${currentTime.toFixed(0)}, diff=${timingDiff.toFixed(1)}ms, grade=${grade}, fretMatch=${fretMatches}`);
    
    if (!fretMatches) {
      // Wrong frets pressed - count as miss but don't update stats yet
      return {
        result: {
          grade: 'miss',
          points: 0,
          multiplier: 0,
          timingDiff,
          isChord: closestNote.type === 'chord',
          fretMatches: false
        },
        hitNote: closestNote
      };
    }

    if (grade === 'miss') {
      // Bad timing - count as miss
      setMissedNotes(prev => prev + 1);
      return {
        result: {
          grade: 'miss',
          points: 0,
          multiplier: 0,
          timingDiff,
          isChord: closestNote.type === 'chord',
          fretMatches: true
        },
        hitNote: closestNote
      };
    }

    // Successful hit!
    const isChord = closestNote.type === 'chord';
    const points = calculatePoints(grade, isChord, combo);
    const multiplier = Math.min(Math.floor(combo / 10) + 1, 8);

    // Update statistics
    setTotalNotesHit(prev => prev + 1);
    setTimingErrors(prev => [...prev.slice(-19), Math.abs(timingDiff)]); // Keep last 20 errors
    
    switch (grade) {
      case 'perfect':
        setPerfectHits(prev => prev + 1);
        break;
      case 'good':
        setGoodHits(prev => prev + 1);
        break;
      case 'okay':
        setOkayHits(prev => prev + 1);
        break;
    }

    return {
      result: {
        grade,
        points,
        multiplier,
        timingDiff,
        isChord,
        fretMatches: true
      },
      hitNote: closestNote
    };
  }, [calculateHitGrade, calculatePoints, checkFretMatch, findHittableNotes]);

  const processMiss = useCallback(() => {
    setMissedNotes(prev => prev + 1);
    console.log('Note missed automatically');
  }, []);

  const isNoteHittable = useCallback((noteTime: number, currentTime: number): boolean => {
    const timingDiff = Math.abs(noteTime - currentTime);
    return timingDiff <= defaultHitWindow.okay;
  }, [defaultHitWindow]);

  const predictHit = useCallback((
    notes: NotePattern[],
    currentTime: number,
    pressedFrets: Set<number>
  ): { canHit: boolean, nextNote: NotePattern | null, grade: HitGrade | null } => {
    const hittableNotes = findHittableNotes(notes, currentTime);
    
    if (hittableNotes.length === 0) {
      return { canHit: false, nextNote: null, grade: null };
    }

    const nextNote = hittableNotes[0];
    const fretMatches = checkFretMatch(nextNote, pressedFrets);
    const timingDiff = nextNote.time - currentTime;
    const grade = calculateHitGrade(timingDiff);
    
    return {
      canHit: fretMatches && grade !== 'miss',
      nextNote,
      grade: fretMatches ? grade : null
    };
  }, [findHittableNotes, checkFretMatch, calculateHitGrade]);

  const resetStats = useCallback(() => {
    setTotalNotesHit(0);
    setPerfectHits(0);
    setGoodHits(0);
    setOkayHits(0);
    setMissedNotes(0);
    setTimingErrors([]);
    console.log('Hit detection stats reset');
  }, []);

  const getAccuracy = useCallback(() => {
    const totalAttempts = totalNotesHit + missedNotes;
    if (totalAttempts === 0) return 100;
    return Math.round((totalNotesHit / totalAttempts) * 100);
  }, [totalNotesHit, missedNotes]);

  const getAverageTimingError = useCallback(() => {
    if (timingErrors.length === 0) return 0;
    return timingErrors.reduce((sum, error) => sum + error, 0) / timingErrors.length;
  }, [timingErrors]);

  const getStats = useCallback((): HitStats => ({
    totalNotesHit,
    perfectHits,
    goodHits,
    okayHits,
    missedNotes,
    accuracy: getAccuracy(),
    averageTimingError: getAverageTimingError()
  }), [totalNotesHit, perfectHits, goodHits, okayHits, missedNotes, getAccuracy, getAverageTimingError]);

  return {
    processHit,
    processMiss,
    resetStats,
    getStats,
    calculateHitGrade,
    isNoteHittable,
    predictHit,
    hitWindow: defaultHitWindow,
    findHittableNotes
  };
};
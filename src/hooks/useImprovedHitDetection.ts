import { useState, useCallback } from 'react';
import { HIT_WINDOW_SETTINGS, FRET_POSITIONS, HIT_LINE_Z, NOTE_SPEED_MULTIPLIER } from '@/game/constants';

export type HitGrade = 'perfect' | 'good' | 'okay' | 'miss';

export interface HitResult {
  grade: HitGrade;
  points: number;
  multiplier: number;
  timingDiff: number;
  positionDiff: number;
}

export interface HitStats {
  totalNotesHit: number;
  perfectHits: number;
  goodHits: number;
  okayHits: number;
  missedNotes: number;
  accuracy: number;
}

export const useImprovedHitDetection = () => {
  const [totalNotesHit, setTotalNotesHit] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [okayHits, setOkayHits] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);

  // Calculate where a note should be visually at current time
  const calculateNoteZPosition = useCallback((noteTime: number, currentTime: number, noteSpeed: number = 1.0): number => {
    const timeToHit = (noteTime - currentTime) / 1000;
    return -30 + (HIT_LINE_Z - timeToHit) * (NOTE_SPEED_MULTIPLIER * noteSpeed);
  }, []);

  // Check if note is visually at hit line (position-based detection)
  const isNoteAtHitLine = useCallback((noteTime: number, currentTime: number, noteSpeed: number = 1.0): boolean => {
    const noteZ = calculateNoteZPosition(noteTime, currentTime, noteSpeed);
    return Math.abs(noteZ - HIT_LINE_Z) <= 1.0; // 1 unit tolerance for hit line
  }, [calculateNoteZPosition]);

  // Simplified timing-based hit detection - focus on timing first
  const calculateHitGrade = useCallback((timingDiff: number, positionDiff: number): HitGrade => {
    const absTimingDiff = Math.abs(timingDiff);
    
    // Primary timing-based detection with loose position validation
    if (absTimingDiff <= HIT_WINDOW_SETTINGS.perfect && positionDiff <= 3.0) return 'perfect';
    if (absTimingDiff <= HIT_WINDOW_SETTINGS.good && positionDiff <= 4.0) return 'good';
    if (absTimingDiff <= HIT_WINDOW_SETTINGS.okay && positionDiff <= 5.0) return 'okay';
    return 'miss';
  }, []);

  const calculatePoints = useCallback((grade: HitGrade, isChord: boolean, combo: number): number => {
    const basePoints = isChord ? 100 : 50;
    
    const gradeMultiplier = {
      perfect: 4,
      good: 2,
      okay: 1,
      miss: 0
    }[grade];

    const comboMultiplier = Math.min(Math.floor(combo / 10) + 1, 4);
    
    return basePoints * gradeMultiplier * comboMultiplier;
  }, []);

  // Enhanced hit processing with position validation
  const processHit = useCallback((
    timingDiff: number,
    noteTime: number,
    currentTime: number,
    isChord: boolean,
    combo: number,
    noteSpeed: number = 1.0
  ): HitResult => {
    const noteZ = calculateNoteZPosition(noteTime, currentTime, noteSpeed);
    const positionDiff = Math.abs(noteZ - HIT_LINE_Z);
    
    const grade = calculateHitGrade(timingDiff, positionDiff);
    const points = calculatePoints(grade, isChord, combo);
    const multiplier = Math.min(Math.floor(combo / 10) + 1, 4);

    // Update statistics
    if (grade !== 'miss') {
      setTotalNotesHit(prev => prev + 1);
    }
    
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
      case 'miss':
        setMissedNotes(prev => prev + 1);
        break;
    }

    console.log(`Hit: Grade=${grade}, Points=${points}, TimingDiff=${timingDiff.toFixed(1)}ms, PositionDiff=${positionDiff.toFixed(2)}, NoteZ=${noteZ.toFixed(2)}`);

    return {
      grade,
      points,
      multiplier,
      timingDiff,
      positionDiff
    };
  }, [calculateNoteZPosition, calculateHitGrade, calculatePoints]);

  const processMiss = useCallback(() => {
    setMissedNotes(prev => prev + 1);
    console.log('Note missed automatically');
  }, []);

  const resetStats = useCallback(() => {
    setTotalNotesHit(0);
    setPerfectHits(0);
    setGoodHits(0);
    setOkayHits(0);
    setMissedNotes(0);
  }, []);

  const getAccuracy = useCallback(() => {
    const totalAttempts = totalNotesHit + missedNotes;
    if (totalAttempts === 0) return 100;
    return Math.round((totalNotesHit / totalAttempts) * 100);
  }, [totalNotesHit, missedNotes]);

  // Simplified note hittability check - primarily timing-based
  const isNoteHittable = useCallback((noteTime: number, currentTime: number, noteSpeed: number = 1.0): boolean => {
    const timingDiff = Math.abs(noteTime - currentTime);
    
    // Much more forgiving - if timing is within window, it's hittable
    return timingDiff <= HIT_WINDOW_SETTINGS.okay;
  }, []);

  const getStats = useCallback((): HitStats => ({
    totalNotesHit,
    perfectHits,
    goodHits,
    okayHits,
    missedNotes,
    accuracy: getAccuracy()
  }), [totalNotesHit, perfectHits, goodHits, okayHits, missedNotes, getAccuracy]);

  return {
    processHit,
    processMiss,
    resetStats,
    getStats,
    calculateHitGrade,
    isNoteHittable,
    isNoteAtHitLine,
    calculateNoteZPosition,
    hitWindow: HIT_WINDOW_SETTINGS
  };
};
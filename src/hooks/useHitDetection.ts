import { useState, useCallback } from 'react';
import { HitGrade } from '@/components/game/HitEffects';

export interface HitResult {
  grade: HitGrade;
  points: number;
  multiplier: number;
  timingDiff: number;
}

export interface HitWindowSettings {
  perfect: number;
  good: number;
  okay: number;
}

export const useHitDetection = (hitWindow?: HitWindowSettings) => {
  const defaultHitWindow = hitWindow || { perfect: 50, good: 100, okay: 200 };
  const [totalNotesHit, setTotalNotesHit] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);
  const [goodHits, setGoodHits] = useState(0);
  const [okayHits, setOkayHits] = useState(0);
  const [missedNotes, setMissedNotes] = useState(0);

  const calculateHitGrade = useCallback((timingDiff: number): HitGrade => {
    const absTimingDiff = Math.abs(timingDiff);
    
    if (absTimingDiff <= defaultHitWindow.perfect) return 'perfect';
    if (absTimingDiff <= defaultHitWindow.good) return 'good';
    if (absTimingDiff <= defaultHitWindow.okay) return 'okay';
    return 'miss';
  }, [defaultHitWindow]);

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

  const processHit = useCallback((
    timingDiff: number, 
    isChord: boolean, 
    combo: number
  ): HitResult => {
    const grade = calculateHitGrade(timingDiff);
    const points = calculatePoints(grade, isChord, combo);
    const multiplier = Math.min(Math.floor(combo / 10) + 1, 4);

    // Update statistics
    setTotalNotesHit(prev => prev + 1);
    
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

    return {
      grade,
      points,
      multiplier,
      timingDiff
    };
  }, [calculateHitGrade, calculatePoints]);

  const processMiss = useCallback(() => {
    setMissedNotes(prev => prev + 1);
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

  const getStats = useCallback(() => ({
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
    calculateHitGrade
  };
};
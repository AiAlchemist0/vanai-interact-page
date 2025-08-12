import { useState, useCallback } from 'react';

export interface CalibrationSettings {
  audioOffset: number; // Audio delay in milliseconds
  visualOffset: number; // Visual delay in milliseconds
  noteSpeed: number; // Speed multiplier for note movement
  hitWindow: {
    perfect: number;
    good: number;
    okay: number;
  };
}

export const useGameCalibration = () => {
  const [settings, setSettings] = useState<CalibrationSettings>({
    audioOffset: 0,
    visualOffset: 0,
    noteSpeed: 1.0,
    hitWindow: {
      perfect: 25,
      good: 50,
      okay: 100
    }
  });

  const updateAudioOffset = useCallback((offset: number) => {
    setSettings(prev => ({ ...prev, audioOffset: offset }));
  }, []);

  const updateVisualOffset = useCallback((offset: number) => {
    setSettings(prev => ({ ...prev, visualOffset: offset }));
  }, []);

  const updateNoteSpeed = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, noteSpeed: speed }));
  }, []);

  const adjustForDifficulty = useCallback((difficulty: 'easy' | 'medium' | 'hard' | 'expert') => {
    const difficultySettings = {
      easy: {
        noteSpeed: 0.8,
        hitWindow: { perfect: 35, good: 70, okay: 120 }
      },
      medium: {
        noteSpeed: 1.0,
        hitWindow: { perfect: 30, good: 60, okay: 110 }
      },
      hard: {
        noteSpeed: 1.2,
        hitWindow: { perfect: 25, good: 50, okay: 100 }
      },
      expert: {
        noteSpeed: 1.4,
        hitWindow: { perfect: 20, good: 40, okay: 80 }
      }
    };

    const diffSettings = difficultySettings[difficulty];
    setSettings(prev => ({
      ...prev,
      noteSpeed: diffSettings.noteSpeed,
      hitWindow: diffSettings.hitWindow
    }));
  }, []);

  const calculateNotePosition = useCallback((noteTime: number, currentTime: number) => {
    // Account for offsets and speed
    const adjustedCurrentTime = currentTime + settings.audioOffset;
    const timeDiff = (noteTime - adjustedCurrentTime) / 1000; // Convert to seconds
    
    // Calculate Z position with speed multiplier
    // Notes travel from Z=-30 to Z=5 (35 units total) over 4 seconds at normal speed
    const travelDistance = 35;
    const travelTime = 4 / settings.noteSpeed; // Adjust travel time based on speed
    const noteZ = -30 + ((4 - timeDiff) / travelTime) * travelDistance;
    
    return {
      z: noteZ,
      visible: noteZ >= -35 && noteZ <= 10,
      timeDiff: noteTime - adjustedCurrentTime
    };
  }, [settings.audioOffset, settings.noteSpeed]);

  const isNoteHittable = useCallback((noteTime: number, currentTime: number) => {
    const adjustedCurrentTime = currentTime + settings.audioOffset;
    const timeDiff = Math.abs(noteTime - adjustedCurrentTime);
    return timeDiff <= settings.hitWindow.okay;
  }, [settings.audioOffset, settings.hitWindow.okay]);

  const getHitGrade = useCallback((noteTime: number, currentTime: number) => {
    const adjustedCurrentTime = currentTime + settings.audioOffset;
    const timeDiff = Math.abs(noteTime - adjustedCurrentTime);
    
    if (timeDiff <= settings.hitWindow.perfect) return 'perfect';
    if (timeDiff <= settings.hitWindow.good) return 'good';
    if (timeDiff <= settings.hitWindow.okay) return 'okay';
    return 'miss';
  }, [settings.audioOffset, settings.hitWindow]);

  const resetToDefaults = useCallback(() => {
    setSettings({
      audioOffset: 0,
      visualOffset: 0,
      noteSpeed: 1.0,
      hitWindow: {
        perfect: 25,
        good: 50,
        okay: 100
      }
    });
  }, []);

  return {
    settings,
    updateAudioOffset,
    updateVisualOffset,
    updateNoteSpeed,
    adjustForDifficulty,
    calculateNotePosition,
    isNoteHittable,
    getHitGrade,
    resetToDefaults
  };
};
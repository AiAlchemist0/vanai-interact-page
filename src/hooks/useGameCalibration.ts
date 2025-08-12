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
      perfect: 50,
      good: 100,
      okay: 200
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
        noteSpeed: 0.7,
        hitWindow: { perfect: 70, good: 140, okay: 250 }
      },
      medium: {
        noteSpeed: 0.9,
        hitWindow: { perfect: 60, good: 120, okay: 220 }
      },
      hard: {
        noteSpeed: 1.1,
        hitWindow: { perfect: 50, good: 100, okay: 200 }
      },
      expert: {
        noteSpeed: 1.3,
        hitWindow: { perfect: 40, good: 80, okay: 160 }
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
    // currentTime is already calibrated in GameBoard, so don't add offset again
    const timeDiff = Math.abs(noteTime - currentTime);
    return timeDiff <= settings.hitWindow.okay;
  }, [settings.hitWindow.okay]);

  const getHitGrade = useCallback((noteTime: number, currentTime: number) => {
    // currentTime is already calibrated in GameBoard, so don't add offset again
    const timeDiff = Math.abs(noteTime - currentTime);
    
    console.log(`Hit grade check: noteTime=${noteTime}, currentTime=${currentTime}, timeDiff=${timeDiff}`);
    console.log(`Hit windows: perfect=${settings.hitWindow.perfect}, good=${settings.hitWindow.good}, okay=${settings.hitWindow.okay}`);
    
    if (timeDiff <= settings.hitWindow.perfect) return 'perfect';
    if (timeDiff <= settings.hitWindow.good) return 'good';
    if (timeDiff <= settings.hitWindow.okay) return 'okay';
    return 'miss';
  }, [settings.hitWindow]);

  const resetToDefaults = useCallback(() => {
    setSettings({
      audioOffset: 0,
      visualOffset: 0,
      noteSpeed: 1.0,
      hitWindow: {
        perfect: 50,
        good: 100,
        okay: 200
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
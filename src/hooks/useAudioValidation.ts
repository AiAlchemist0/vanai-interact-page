import { useState, useEffect } from 'react';
import { validateMultipleAudioFiles, getAudioFileInfo } from '@/utils/audioValidator';
import { SONGS } from '@/components/AudioPlayer';

interface AudioValidationState {
  isValidating: boolean;
  validationResults: any[];
  failedSongs: string[];
  validSongs: string[];
  lastValidationTime: number | null;
}

/**
 * Hook for validating audio files and tracking their accessibility
 */
export const useAudioValidation = () => {
  const [state, setState] = useState<AudioValidationState>({
    isValidating: false,
    validationResults: [],
    failedSongs: [],
    validSongs: [],
    lastValidationTime: null
  });

  const validateAllAudioFiles = async () => {
    console.log('🔍 Starting comprehensive audio validation...');
    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const audioUrls = SONGS.map(song => ({
        songId: song.id,
        url: song.src
      }));

      const validation = await validateMultipleAudioFiles(audioUrls);
      
      setState({
        isValidating: false,
        validationResults: validation.results,
        failedSongs: validation.failedFiles.map(f => f.songId),
        validSongs: validation.validFiles.map(f => f.songId),
        lastValidationTime: Date.now()
      });

      // Log validation summary
      console.log(`✅ Audio validation complete: ${validation.validFiles.length} valid, ${validation.failedFiles.length} failed`);

      return validation;
    } catch (error) {
      console.error('Audio validation failed:', error);
      setState(prev => ({ 
        ...prev, 
        isValidating: false,
        lastValidationTime: Date.now()
      }));
      throw error;
    }
  };

  const validateSingleAudio = async (songId: string) => {
    const song = SONGS.find(s => s.id === songId);
    if (!song) {
      console.error(`Song not found: ${songId}`);
      return null;
    }

    console.log(`🔍 Validating single audio file: ${songId}`);
    const result = await getAudioFileInfo(song.src);
    
    // Update state for this specific song
    setState(prev => {
      const updatedResults = prev.validationResults.filter(r => r.songId !== songId);
      updatedResults.push({ songId, url: song.src, ...result });
      
      return {
        ...prev,
        validationResults: updatedResults,
        failedSongs: result.valid 
          ? prev.failedSongs.filter(id => id !== songId)
          : [...prev.failedSongs.filter(id => id !== songId), songId],
        validSongs: result.valid
          ? [...prev.validSongs.filter(id => id !== songId), songId]
          : prev.validSongs.filter(id => id !== songId)
      };
    });

    return { songId, ...result };
  };

  const getSongValidationStatus = (songId: string) => {
    const result = state.validationResults.find(r => r.songId === songId);
    return result ? {
      isValid: result.valid,
      error: result.error,
      duration: result.duration,
      lastChecked: state.lastValidationTime
    } : null;
  };

  // Auto-validate is now handled by the components that need it

  return {
    ...state,
    validateAllAudioFiles,
    validateSingleAudio,
    getSongValidationStatus,
    isAudioValid: (songId: string) => state.validSongs.includes(songId),
    isAudioFailed: (songId: string) => state.failedSongs.includes(songId)
  };
};
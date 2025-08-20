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

      // Log detailed results for problematic songs
      const problematicSongs = ['bc-coast-catalyst', 'philippe-pasquier-art-hallucinations', 'brenda-bailey', 'lionel-ringenbach'];
      problematicSongs.forEach(songId => {
        const result = validation.results.find(r => r.songId === songId);
        if (result) {
          if (result.valid) {
            console.log(`✅ ${songId}: Audio file is accessible (duration: ${result.duration?.toFixed(2)}s)`);
          } else {
            console.error(`❌ ${songId}: Audio file failed validation - ${result.error}`);
          }
        }
      });

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

  // Auto-validate on mount for critical songs
  useEffect(() => {
    const criticalSongs = ['bc-coast-catalyst', 'philippe-pasquier-art-hallucinations'];
    criticalSongs.forEach(songId => {
      validateSingleAudio(songId).catch(console.error);
    });
  }, []);

  return {
    ...state,
    validateAllAudioFiles,
    validateSingleAudio,
    getSongValidationStatus,
    isAudioValid: (songId: string) => state.validSongs.includes(songId),
    isAudioFailed: (songId: string) => state.failedSongs.includes(songId)
  };
};
/**
 * Audio file validation and accessibility checking utilities
 * Helps identify broken or inaccessible audio files for better tracking
 */

export interface AudioValidationResult {
  isAccessible: boolean;
  canPlay: boolean;
  duration?: number;
  error?: string;
  fileSize?: number;
}

/**
 * Test if an audio file is accessible and playable
 */
export const validateAudioFile = async (audioUrl: string): Promise<AudioValidationResult> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    let hasResolved = false;
    
    const resolveOnce = (result: AudioValidationResult) => {
      if (hasResolved) return;
      hasResolved = true;
      resolve(result);
    };

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      resolveOnce({
        isAccessible: false,
        canPlay: false,
        error: 'Timeout - audio file took too long to load'
      });
    }, 10000); // 10 second timeout

    audio.addEventListener('loadedmetadata', () => {
      clearTimeout(timeout);
      resolveOnce({
        isAccessible: true,
        canPlay: true,
        duration: audio.duration,
        fileSize: undefined // Can't get file size from audio element
      });
    });

    audio.addEventListener('error', (e) => {
      clearTimeout(timeout);
      const error = audio.error;
      let errorMessage = 'Unknown audio error';
      
      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio loading was aborted';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported or file not found';
            break;
        }
      }
      
      resolveOnce({
        isAccessible: false,
        canPlay: false,
        error: errorMessage
      });
    });

    audio.addEventListener('canplay', () => {
      // Additional check that the audio can actually play
      if (!hasResolved) {
        clearTimeout(timeout);
        resolveOnce({
          isAccessible: true,
          canPlay: true,
          duration: audio.duration
        });
      }
    });

    // Start loading the audio
    audio.src = audioUrl;
    audio.preload = 'metadata';
    audio.load();
  });
};

/**
 * Check HTTP accessibility of an audio file
 */
export const checkAudioFileAccessibility = async (audioUrl: string): Promise<{ accessible: boolean; status?: number; error?: string }> => {
  try {
    const response = await fetch(audioUrl, { 
      method: 'HEAD', // Only get headers, not the full file
      mode: 'cors'
    });
    
    return {
      accessible: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown fetch error'
    };
  }
};

/**
 * Get audio file information and validate it
 */
export const getAudioFileInfo = async (audioUrl: string) => {
  console.log(`🔍 Validating audio file: ${audioUrl}`);
  
  // First check HTTP accessibility
  const httpCheck = await checkAudioFileAccessibility(audioUrl);
  console.log(`📡 HTTP check for ${audioUrl}:`, httpCheck);
  
  if (!httpCheck.accessible) {
    return {
      valid: false,
      error: `HTTP Error (${httpCheck.status}): ${httpCheck.error}`,
      httpStatus: httpCheck.status
    };
  }
  
  // Then validate the actual audio
  const audioCheck = await validateAudioFile(audioUrl);
  console.log(`🎵 Audio validation for ${audioUrl}:`, audioCheck);
  
  return {
    valid: audioCheck.isAccessible && audioCheck.canPlay,
    duration: audioCheck.duration,
    error: audioCheck.error,
    httpStatus: httpCheck.status
  };
};

/**
 * Batch validate multiple audio files
 */
export const validateMultipleAudioFiles = async (audioUrls: { songId: string; url: string }[]) => {
  console.log('🔍 Starting batch audio validation...');
  
  const results = await Promise.all(
    audioUrls.map(async ({ songId, url }) => {
      const result = await getAudioFileInfo(url);
      return {
        songId,
        url,
        ...result
      };
    })
  );
  
  const failedFiles = results.filter(r => !r.valid);
  const validFiles = results.filter(r => r.valid);
  
  console.log(`✅ Valid audio files: ${validFiles.length}/${results.length}`);
  console.log(`❌ Failed audio files: ${failedFiles.length}/${results.length}`);
  
  if (failedFiles.length > 0) {
    console.error('❌ Failed audio files:', failedFiles);
  }
  
  return {
    results,
    validFiles,
    failedFiles,
    summary: {
      total: results.length,
      valid: validFiles.length,
      failed: failedFiles.length,
      successRate: (validFiles.length / results.length) * 100
    }
  };
};
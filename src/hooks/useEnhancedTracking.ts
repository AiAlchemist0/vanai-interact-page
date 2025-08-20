import { useEffect, useCallback } from 'react';
import { useSongStatistics } from './useSongStatistics';
import { useSessionTracking } from './useSessionTracking';
import { useGeographicTracking } from './useGeographicTracking';

export const useEnhancedTracking = () => {
  const songStats = useSongStatistics();
  const sessionTracking = useSessionTracking();
  const geoTracking = useGeographicTracking();

  // Initialize session when component mounts (only once)
  useEffect(() => {
    const initializeSession = async () => {
      await sessionTracking.startSession();
      // Record geographic location once per session
      await geoTracking.recordSessionLocation();
    };
    
    initializeSession();
    
    // Cleanup function to end session
    return () => {
      sessionTracking.endSession();
    };
  }, []); // Empty dependency array to run only once

  const startPlayTracking = useCallback(async (songId: string, audioLoadSuccess: boolean = true) => {
    // Update session activity
    sessionTracking.updateSessionActivity();
    
    // Geographic tracking is now handled once per session, not per song
    // This reduces API calls and database operations significantly
    
    // Start song play tracking with audio load status
    await songStats.startPlayTracking(songId, audioLoadSuccess);
  }, [sessionTracking, songStats]);

  const endPlayTracking = useCallback(async (songId: string, songDuration?: number, failureReason?: string) => {
    // Update session activity
    sessionTracking.updateSessionActivity();
    
    // End song play tracking with failure reason
    await songStats.endPlayTracking(songId, songDuration, failureReason);
    
    // If it was a valid play (no failure reason and duration check happens in songStats), increment session song count
    // We'll determine this after the fact by checking if the play was marked valid
    if (!failureReason && songDuration && songDuration >= 15) {
      await sessionTracking.incrementSongPlay();
    }
  }, [sessionTracking, songStats]);

  return {
    // Song statistics
    ...songStats,
    
    // Session tracking
    session: sessionTracking.session,
    getSessionId: sessionTracking.getSessionId,
    
    // Geographic tracking
    location: geoTracking.location,
    locationLoading: geoTracking.loading,
    
    // Enhanced tracking functions
    startPlayTracking,
    endPlayTracking,
    
    // Activity updates (optimized - no geographic tracking for general activity)
    updateActivity: useCallback(() => {
      sessionTracking.updateSessionActivity();
      // Geographic activity is now session-based, not per interaction
    }, [sessionTracking])
  };
};
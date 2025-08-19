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

  const startPlayTracking = useCallback(async (songId: string) => {
    // Update session activity
    sessionTracking.updateSessionActivity();
    
    // Geographic tracking is now handled once per session, not per song
    // This reduces API calls and database operations significantly
    
    // Start song play tracking
    await songStats.startPlayTracking(songId);
  }, [sessionTracking, songStats]);

  const endPlayTracking = useCallback(async (songId: string, songDuration?: number, wasValidPlay?: boolean) => {
    // Update session activity
    sessionTracking.updateSessionActivity();
    
    // End song play tracking
    await songStats.endPlayTracking(songId, songDuration);
    
    // If it was a valid play, increment session song count
    if (wasValidPlay) {
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
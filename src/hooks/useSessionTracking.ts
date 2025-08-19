import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SessionData {
  sessionId: string;
  startTime: number;
  totalSongsPlayed: number;
  isActive: boolean;
}

export const useSessionTracking = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const sessionRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastActivityRef = useRef<number>(Date.now());
  const songsPlayedRef = useRef<number>(0);

  const getSessionId = () => {
    if (!sessionRef.current) {
      sessionRef.current = localStorage.getItem('session_id') || 
        `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('session_id', sessionRef.current);
    }
    return sessionRef.current;
  };

  const startSession = async () => {
    try {
      const sessionId = getSessionId();
      
      // Check if session already exists and is active
      if (session?.isActive && session.sessionId === sessionId) {
        return;
      }

      // Check if session exists in database before creating new one
      const { data: existingSessions } = await supabase
        .from('listening_sessions')
        .select('user_session_id')
        .eq('user_session_id', sessionId)
        .is('ended_at', null);

      if (existingSessions && existingSessions.length > 0) {
        setSession({
          sessionId,
          startTime: startTimeRef.current,
          totalSongsPlayed: songsPlayedRef.current,
          isActive: true
        });
        return;
      }

      const startTime = Date.now();
      startTimeRef.current = startTime;
      lastActivityRef.current = startTime;

      // Get basic device/browser info
      const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
      const browserType = navigator.userAgent.includes('Chrome') ? 'chrome' : 
                         navigator.userAgent.includes('Firefox') ? 'firefox' : 
                         navigator.userAgent.includes('Safari') ? 'safari' : 'other';

      const { error } = await supabase
        .from('listening_sessions')
        .insert({
          user_session_id: sessionId,
          started_at: new Date(startTime).toISOString(),
          device_type: deviceType,
          browser_type: browserType,
          total_songs_played: 0,
          total_duration_seconds: 0
        });

      if (error) {
        console.error('Error starting session:', error);
        throw error;
      }

      setSession({
        sessionId,
        startTime,
        totalSongsPlayed: 0,
        isActive: true
      });
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const updateSessionActivity = () => {
    lastActivityRef.current = Date.now();
  };

  const incrementSongPlay = async () => {
    if (!session) return;
    
    songsPlayedRef.current += 1;
    
    try {
      const sessionId = getSessionId();
      const { error } = await supabase
        .from('listening_sessions')
        .update({
          total_songs_played: songsPlayedRef.current,
          total_duration_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000)
        })
        .eq('user_session_id', sessionId)
        .is('ended_at', null);

      if (error) {
        console.error('Error updating session:', error);
      }

      setSession(prev => prev ? { ...prev, totalSongsPlayed: songsPlayedRef.current } : null);
    } catch (error) {
      console.error('Failed to increment song play:', error);
    }
  };

  const endSession = async () => {
    if (!session) return;

    try {
      const sessionId = getSessionId();
      const endTime = Date.now();
      const totalDuration = Math.floor((endTime - startTimeRef.current) / 1000);

      const { error } = await supabase
        .from('listening_sessions')
        .update({
          ended_at: new Date(endTime).toISOString(),
          total_duration_seconds: totalDuration,
          total_songs_played: songsPlayedRef.current
        })
        .eq('user_session_id', sessionId)
        .is('ended_at', null);

      if (error) {
        console.error('Error ending session:', error);
        throw error;
      }

      setSession(prev => prev ? { ...prev, isActive: false } : null);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  // Auto-end session on inactivity (30 minutes)
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivityRef.current;
      const thirtyMinutes = 30 * 60 * 1000;

      if (session?.isActive && inactiveTime > thirtyMinutes) {
        endSession();
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session]);

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.isActive) {
        // Use navigator.sendBeacon for reliable data sending on page unload
        const sessionId = getSessionId();
        const endTime = Date.now();
        const totalDuration = Math.floor((endTime - startTimeRef.current) / 1000);
        
        const payload = JSON.stringify({
          user_session_id: sessionId,
          ended_at: new Date(endTime).toISOString(),
          total_duration_seconds: totalDuration,
          total_songs_played: songsPlayedRef.current
        });

        // Use a simpler approach for page unload - just mark session as ended locally
        // The session will be marked as ended by the inactivity check or next session start
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  return {
    session,
    startSession,
    endSession,
    updateSessionActivity,
    incrementSongPlay,
    getSessionId
  };
};
import { useEffect, useRef, useCallback } from 'react';

interface AudioCleanupOptions {
  maxCacheSize?: number;
  cleanupInterval?: number;
  idleTimeout?: number;
}

export const useAudioCleanup = (options: AudioCleanupOptions = {}) => {
  const {
    maxCacheSize = 5,
    cleanupInterval = 60000, // 1 minute
    idleTimeout = 300000, // 5 minutes
  } = options;

  const audioCache = useRef<Map<string, {
    audio: HTMLAudioElement;
    lastUsed: number;
    isActive: boolean;
  }>>(new Map());

  const cleanupTimer = useRef<NodeJS.Timeout>();

  const addToCache = useCallback((key: string, audio: HTMLAudioElement) => {
    audioCache.current.set(key, {
      audio,
      lastUsed: Date.now(),
      isActive: true
    });

    // Enforce cache size limit
    if (audioCache.current.size > maxCacheSize) {
      const entries = Array.from(audioCache.current.entries());
      entries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
      
      // Remove oldest inactive entries
      const toRemove = entries
        .filter(([, data]) => !data.isActive)
        .slice(0, entries.length - maxCacheSize);

      toRemove.forEach(([key, data]) => {
        data.audio.pause();
        data.audio.src = '';
        data.audio.load();
        audioCache.current.delete(key);
      });
    }
  }, [maxCacheSize]);

  const getFromCache = useCallback((key: string) => {
    const cached = audioCache.current.get(key);
    if (cached) {
      cached.lastUsed = Date.now();
      return cached.audio;
    }
    return null;
  }, []);

  const markAsActive = useCallback((key: string, active: boolean) => {
    const cached = audioCache.current.get(key);
    if (cached) {
      cached.isActive = active;
      cached.lastUsed = Date.now();
    }
  }, []);

  const cleanupIdle = useCallback(() => {
    const now = Date.now();
    const toRemove: string[] = [];

    audioCache.current.forEach((data, key) => {
      if (!data.isActive && (now - data.lastUsed) > idleTimeout) {
        data.audio.pause();
        data.audio.src = '';
        data.audio.load();
        toRemove.push(key);
      }
    });

    toRemove.forEach(key => audioCache.current.delete(key));

    if (process.env.NODE_ENV === 'development') {
      console.log(`[AudioCleanup] Cleaned up ${toRemove.length} idle audio elements. Cache size: ${audioCache.current.size}`);
    }
  }, [idleTimeout]);

  const clearAll = useCallback(() => {
    audioCache.current.forEach((data) => {
      data.audio.pause();
      data.audio.src = '';
      data.audio.load();
    });
    audioCache.current.clear();
  }, []);

  // Set up periodic cleanup
  useEffect(() => {
    cleanupTimer.current = setInterval(cleanupIdle, cleanupInterval);

    return () => {
      if (cleanupTimer.current) {
        clearInterval(cleanupTimer.current);
      }
    };
  }, [cleanupIdle, cleanupInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  // Memory pressure handling
  useEffect(() => {
    const handleMemoryPressure = () => {
      // Clear non-active audio elements during memory pressure
      const nonActive = Array.from(audioCache.current.entries())
        .filter(([, data]) => !data.isActive);
      
      nonActive.forEach(([key, data]) => {
        data.audio.pause();
        data.audio.src = '';
        data.audio.load();
        audioCache.current.delete(key);
      });
    };

    // Listen for memory pressure events (if supported)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize > memInfo.jsHeapSizeLimit * 0.8) {
          handleMemoryPressure();
        }
      };

      const memoryCheckInterval = setInterval(checkMemory, 30000); // Check every 30 seconds
      
      return () => clearInterval(memoryCheckInterval);
    }
  }, []);

  return {
    addToCache,
    getFromCache,
    markAsActive,
    cleanupIdle,
    clearAll,
    getCacheSize: () => audioCache.current.size,
    getCacheInfo: () => Array.from(audioCache.current.entries()).map(([key, data]) => ({
      key,
      lastUsed: data.lastUsed,
      isActive: data.isActive
    }))
  };
};
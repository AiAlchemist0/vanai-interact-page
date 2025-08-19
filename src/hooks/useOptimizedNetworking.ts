import { useCallback, useRef } from 'react';

interface RequestOptions {
  debounceMs?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
}

export const useOptimizedNetworking = () => {
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const requestCache = useRef<Map<string, Promise<any>>>(new Map());
  const retryCounters = useRef<Map<string, number>>(new Map());

  const debouncedRequest = useCallback(
    <T>(
      requestKey: string,
      requestFn: () => Promise<T>,
      options: RequestOptions = {}
    ): Promise<T> => {
      const { debounceMs = 300, retryAttempts = 3, retryDelayMs = 1000 } = options;

      return new Promise((resolve, reject) => {
        // Clear existing timer for this key
        const existingTimer = debounceTimers.current.get(requestKey);
        if (existingTimer) {
          clearTimeout(existingTimer);
        }

        // Set new debounced timer
        const timer = setTimeout(async () => {
          try {
            // Check if request is already in progress
            let existingRequest = requestCache.current.get(requestKey);
            if (existingRequest) {
              const result = await existingRequest;
              resolve(result);
              return;
            }

            // Execute request with retry logic
            const executeWithRetry = async (attemptsLeft: number): Promise<T> => {
              try {
                const requestPromise = requestFn();
                requestCache.current.set(requestKey, requestPromise);
                
                const result = await requestPromise;
                
                // Clear cache and reset retry counter on success
                requestCache.current.delete(requestKey);
                retryCounters.current.delete(requestKey);
                
                return result;
              } catch (error) {
                requestCache.current.delete(requestKey);
                
                if (attemptsLeft > 0) {
                  // Exponential backoff
                  const currentAttempt = retryAttempts - attemptsLeft + 1;
                  const delay = retryDelayMs * Math.pow(2, currentAttempt - 1);
                  
                  await new Promise(resolve => setTimeout(resolve, delay));
                  return executeWithRetry(attemptsLeft - 1);
                } else {
                  retryCounters.current.delete(requestKey);
                  throw error;
                }
              }
            };

            const result = await executeWithRetry(retryAttempts);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            debounceTimers.current.delete(requestKey);
          }
        }, debounceMs);

        debounceTimers.current.set(requestKey, timer);
      });
    },
    []
  );

  const clearCache = useCallback((requestKey?: string) => {
    if (requestKey) {
      requestCache.current.delete(requestKey);
      const timer = debounceTimers.current.get(requestKey);
      if (timer) {
        clearTimeout(timer);
        debounceTimers.current.delete(requestKey);
      }
    } else {
      // Clear all caches
      requestCache.current.clear();
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
      retryCounters.current.clear();
    }
  }, []);

  const isRequestPending = useCallback((requestKey: string): boolean => {
    return requestCache.current.has(requestKey);
  }, []);

  return {
    debouncedRequest,
    clearCache,
    isRequestPending
  };
};
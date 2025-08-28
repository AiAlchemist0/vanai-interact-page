import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useMobile } from '@/contexts/MobileContext';

interface MobileSupabaseOptions {
  enableRealtime?: boolean;
  fallbackPollingInterval?: number;
}

export const useMobileSupabaseClient = (options: MobileSupabaseOptions = {}) => {
  const { enableRealtime = true, fallbackPollingInterval = 30000 } = options;
  const { isMobile } = useMobile();
  const [isRealtimeSupported, setIsRealtimeSupported] = useState(!isMobile);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const createChannel = useCallback((
    channelName: string,
    config: any,
    onData: (payload: any) => void,
    onError?: (error: any) => void
  ) => {
    // If realtime is disabled or not supported, return a mock channel
    if (!enableRealtime || !isRealtimeSupported) {
      console.log(`Realtime disabled for ${channelName}, using polling fallback`);
      return {
        subscribe: () => ({ status: 'SUBSCRIBED' }),
        unsubscribe: () => {},
        send: () => {}
      };
    }

    try {
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', config, (payload) => {
          try {
            onData(payload);
          } catch (error) {
            console.error(`Error processing realtime data for ${channelName}:`, error);
            onError?.(error);
          }
        })
        .subscribe((status, error) => {
          if (error) {
            console.error(`WebSocket connection error for ${channelName}:`, error);
            setConnectionError(error.message);
            setIsRealtimeSupported(false);
            onError?.(error);
          } else if (status === 'SUBSCRIBED') {
            console.log(`Successfully subscribed to ${channelName}`);
            setConnectionError(null);
          }
        });

      return {
        subscribe: () => ({ status: 'SUBSCRIBED' }),
        unsubscribe: () => {
          try {
            supabase.removeChannel(channel);
          } catch (error) {
            console.error(`Error unsubscribing from ${channelName}:`, error);
          }
        },
        send: (payload: any) => {
          try {
            channel.send({
              type: 'broadcast',
              event: 'message',
              payload
            });
          } catch (error) {
            console.error(`Error sending message to ${channelName}:`, error);
          }
        }
      };
    } catch (error) {
      console.error(`Error creating channel ${channelName}:`, error);
      setConnectionError(error instanceof Error ? error.message : 'Unknown connection error');
      setIsRealtimeSupported(false);
      onError?.(error);
      
      // Return mock channel for graceful degradation
      return {
        subscribe: () => ({ status: 'SUBSCRIBED' }),
        unsubscribe: () => {},
        send: () => {}
      };
    }
  }, [enableRealtime, isRealtimeSupported]);

  const createPollingFallback = useCallback((
    fetchFunction: () => Promise<void>,
    interval: number = fallbackPollingInterval
  ) => {
    if (isRealtimeSupported) return null;

    console.log(`Setting up polling fallback with ${interval}ms interval`);
    
    const intervalId = setInterval(() => {
      fetchFunction().catch(error => {
        console.error('Polling fallback error:', error);
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [isRealtimeSupported, fallbackPollingInterval]);

  useEffect(() => {
    // Test WebSocket support on mobile devices
    if (isMobile) {
      const testConnection = () => {
        try {
          // Create a simple test channel to check WebSocket support
          const testChannel = supabase
            .channel('mobile-test-connection')
            .subscribe((status, error) => {
              if (error) {
                console.warn('Mobile WebSocket not supported:', error.message);
                setIsRealtimeSupported(false);
                setConnectionError(error.message);
              } else if (status === 'SUBSCRIBED') {
                console.log('Mobile WebSocket connection successful');
                setIsRealtimeSupported(true);
                setConnectionError(null);
              }
              
              // Clean up test channel
              setTimeout(() => {
                try {
                  supabase.removeChannel(testChannel);
                } catch (cleanupError) {
                  console.warn('Error cleaning up test channel:', cleanupError);
                }
              }, 1000);
            });
        } catch (error) {
          console.warn('WebSocket test failed:', error);
          setIsRealtimeSupported(false);
          setConnectionError(error instanceof Error ? error.message : 'WebSocket test failed');
        }
      };

      // Test connection after a short delay
      const timeout = setTimeout(testConnection, 100);
      return () => clearTimeout(timeout);
    }
  }, [isMobile]);

  return {
    createChannel,
    createPollingFallback,
    isRealtimeSupported,
    connectionError,
    isMobile
  };
};
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface LazyAudioLoaderProps {
  src: string;
  preload?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onLoadError?: (error: string) => void;
  children: (audioElement: HTMLAudioElement | null, isLoading: boolean, error: string | null) => React.ReactNode;
}

const LazyAudioLoader: React.FC<LazyAudioLoaderProps> = ({
  src,
  preload = false,
  onLoadStart,
  onLoadComplete,
  onLoadError,
  children
}) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const { measureAsync } = usePerformanceMonitor('LazyAudioLoader');

  const loadAudio = useCallback(async () => {
    if (loadingRef.current || audioElement) return;
    
    return measureAsync(async () => {
      loadingRef.current = true;
      setIsLoading(true);
      setError(null);
      onLoadStart?.();

      try {
        const audio = new Audio();
        
        await new Promise<void>((resolve, reject) => {
          const handleCanPlay = () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            resolve();
          };

          const handleError = (e: Event) => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
            reject(new Error(`Failed to load audio: ${src}`));
          };

          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
          
          // Set preload attribute for better performance
          audio.preload = preload ? 'auto' : 'metadata';
          audio.src = src;
        });

        setAudioElement(audio);
        onLoadComplete?.();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load audio';
        setError(errorMessage);
        onLoadError?.(errorMessage);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }, 'loadAudio');
  }, [src, preload, audioElement, onLoadStart, onLoadComplete, onLoadError, measureAsync]);

  // Preload audio on mount if specified
  useEffect(() => {
    if (preload) {
      loadAudio();
    }
  }, [preload, loadAudio]);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement.load(); // Properly cleanup
      }
    };
  }, [audioElement]);

  // Intersection Observer for lazy loading
  const intersectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (preload || !intersectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !audioElement && !loadingRef.current) {
          loadAudio();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(intersectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [preload, audioElement, loadAudio]);

  return (
    <div ref={intersectionRef}>
      {children(audioElement, isLoading, error)}
      {isLoading && (
        <div className="flex items-center justify-center p-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Loading audio...</span>
        </div>
      )}
    </div>
  );
};

export default LazyAudioLoader;
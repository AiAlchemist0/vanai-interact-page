import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Play } from 'lucide-react';

interface PlayTrackingIndicatorProps {
  isTracking: boolean;
  songTitle: string;
  currentTime: number;
  isPlaying: boolean;
}

export const PlayTrackingIndicator = ({ 
  isTracking, 
  songTitle, 
  currentTime, 
  isPlaying 
}: PlayTrackingIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  const [hasReachedThreshold, setHasReachedThreshold] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  
  const VALID_PLAY_THRESHOLD = 15; // 15 seconds
  const CONFIRMATION_DISPLAY_DURATION = 4000; // 4 seconds
  
  useEffect(() => {
    if (isTracking && isPlaying) {
      const progressPercent = Math.min((currentTime / VALID_PLAY_THRESHOLD) * 100, 100);
      setProgress(progressPercent);
      
      if (currentTime >= VALID_PLAY_THRESHOLD && !hasReachedThreshold) {
        setHasReachedThreshold(true);
        // Start hide timer after showing confirmation
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, CONFIRMATION_DISPLAY_DURATION);
      }
    } else if (!isPlaying) {
      // Reset when not playing
      setProgress(0);
      setHasReachedThreshold(false);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [currentTime, isTracking, isPlaying, hasReachedThreshold]);

  // Reset visibility when tracking starts for a new song
  useEffect(() => {
    if (isTracking && !hasReachedThreshold) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [isTracking, hasReachedThreshold]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (!isTracking || !isVisible) return null;

  return (
    <Card className={`p-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          {hasReachedThreshold ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : isPlaying ? (
            <Clock className="h-4 w-4 text-orange-500 animate-pulse" />
          ) : (
            <Play className="h-4 w-4 text-slate-400" />
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-200">
                {hasReachedThreshold ? '✅ Valid Play Recorded' : 'Tracking Listen...'}
              </span>
              
              <Badge 
                variant={hasReachedThreshold ? "default" : "secondary"} 
                className="text-xs"
              >
                {Math.floor(currentTime)}s / {VALID_PLAY_THRESHOLD}s
              </Badge>
            </div>
            
            <Progress 
              value={progress} 
              className="h-2" 
            />
            
            <p className="text-xs text-slate-400 mt-1">
              {hasReachedThreshold 
                ? `"${songTitle}" counts as a valid play!` 
                : isPlaying 
                  ? `Listen for ${VALID_PLAY_THRESHOLD - Math.floor(currentTime)} more seconds to count as a play`
                  : 'Paused - resume to continue tracking'
              }
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
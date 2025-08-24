import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, Volume2, MousePointer, Play } from 'lucide-react';

interface LoadingFeedbackProps {
  isLoading: boolean;
  fileAvailable: boolean | null;
  audioError: string | null;
  songTitle: string;
  retryCount: number;
  autoplayBlocked?: boolean;
  needsInteraction?: boolean;
  onInteractionTest?: () => void;
}

export const LoadingFeedback = ({ 
  isLoading, 
  fileAvailable, 
  audioError, 
  songTitle, 
  retryCount,
  autoplayBlocked = false,
  needsInteraction = false,
  onInteractionTest
}: LoadingFeedbackProps) => {
  if (!isLoading && fileAvailable !== false && !audioError && !autoplayBlocked && !needsInteraction) return null;

  const getStatusInfo = () => {
    if (autoplayBlocked) {
      return {
        icon: <MousePointer className="h-4 w-4 text-amber-500" />,
        title: 'Click to Enable Audio',
        message: 'Browser requires user interaction before playing audio. Click the play button to start.',
        variant: 'secondary' as const,
        actionButton: true
      };
    }

    if (needsInteraction) {
      return {
        icon: <Play className="h-4 w-4 text-blue-500" />,
        title: 'Ready to Play',
        message: `Click to start playing "${songTitle}". Browser audio is now enabled.`,
        variant: 'default' as const,
        actionButton: false
      };
    }

    if (audioError) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        title: 'Audio Error',
        message: audioError,
        variant: 'destructive' as const,
        actionButton: false
      };
    }
    
    if (fileAvailable === false) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
        title: 'File Unavailable',
        message: `"${songTitle}" is temporarily unavailable. Try again later.`,
        variant: 'secondary' as const,
        actionButton: false
      };
    }
    
    if (isLoading) {
      return {
        icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
        title: retryCount > 0 ? `Loading... (Retry ${retryCount})` : 'Loading Audio',
        message: `Preparing "${songTitle}" for playback...`,
        variant: 'secondary' as const,
        actionButton: false
      };
    }
    
    return {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      title: 'Ready to Play',
      message: `"${songTitle}" is loaded and ready!`,
      variant: 'default' as const,
      actionButton: false
    };
  };

  const status = getStatusInfo();

  return (
    <Card className="p-3 bg-slate-800/50 border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {status.icon}
          <Volume2 className="h-3 w-3 text-slate-400" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-200">
              {status.title}
            </span>
            <Badge variant={status.variant} className="text-xs">
              Audio Status
            </Badge>
          </div>
          
          <p className="text-xs text-slate-400">
            {status.message}
          </p>
          
          {retryCount > 0 && (
            <p className="text-xs text-orange-400 mt-1">
              Retrying connection... Please wait.
            </p>
          )}
          
          {status.actionButton && onInteractionTest && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onInteractionTest}
              className="mt-2 text-xs h-7"
            >
              <Play className="h-3 w-3 mr-1" />
              Test Audio
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
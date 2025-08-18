import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, Volume2 } from 'lucide-react';

interface LoadingFeedbackProps {
  isLoading: boolean;
  fileAvailable: boolean | null;
  audioError: string | null;
  songTitle: string;
  retryCount: number;
}

export const LoadingFeedback = ({ 
  isLoading, 
  fileAvailable, 
  audioError, 
  songTitle, 
  retryCount 
}: LoadingFeedbackProps) => {
  if (!isLoading && fileAvailable !== false && !audioError) return null;

  const getStatusInfo = () => {
    if (audioError) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        title: 'Audio Error',
        message: audioError,
        variant: 'destructive' as const
      };
    }
    
    if (fileAvailable === false) {
      return {
        icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
        title: 'File Unavailable',
        message: `"${songTitle}" is temporarily unavailable. Try again later.`,
        variant: 'secondary' as const
      };
    }
    
    if (isLoading) {
      return {
        icon: <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />,
        title: retryCount > 0 ? `Loading... (Retry ${retryCount})` : 'Loading Audio',
        message: `Preparing "${songTitle}" for playback...`,
        variant: 'secondary' as const
      };
    }
    
    return {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      title: 'Ready to Play',
      message: `"${songTitle}" is loaded and ready!`,
      variant: 'default' as const
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
        </div>
      </div>
    </Card>
  );
};
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, Music, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UnifiedAudioState } from '@/hooks/useUnifiedAudioControl';

interface UnifiedPlayButtonProps {
  audioState: UnifiedAudioState;
  onPlay: () => void;
  onStop?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'ghost' | 'outline' | 'compact';
  className?: string;
  showProgress?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12', 
  xl: 'w-16 h-16'
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6'
};

export const UnifiedPlayButton: React.FC<UnifiedPlayButtonProps> = ({
  audioState,
  onPlay,
  onStop,
  size = 'md',
  variant = 'default',
  className,
  showProgress = false,
  disabled = false,
  'aria-label': ariaLabel
}) => {
  const { isLoading, isPlaying, isPaused, isCurrent, progress } = audioState;

  const getButtonStyles = () => {
    const baseStyles = 'relative rounded-full transition-all duration-200 touch-manipulation hover-scale';
    
    if (variant === 'compact') {
      return cn(
        baseStyles,
        'hover:bg-primary/20 text-muted-foreground hover:text-primary',
        isPlaying && 'bg-primary/20 text-primary shadow-lg ring-2 ring-primary/30',
        isPaused && 'bg-primary/10 border border-primary/30 text-primary'
      );
    }
    
    if (variant === 'ghost') {
      return cn(
        baseStyles,
        'hover:bg-primary/20 text-muted-foreground hover:text-primary',
        isPlaying && 'bg-primary/20 hover:bg-primary/30 text-primary shadow-lg ring-2 ring-primary/30',
        isPaused && 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30'
      );
    }

    if (variant === 'outline') {
      return cn(
        baseStyles,
        'border border-border hover:bg-primary/10',
        isPlaying && 'border-primary bg-primary/10 text-primary shadow-lg',
        isPaused && 'border-primary/50 bg-primary/5 text-primary'
      );
    }

    // Default variant
    return cn(
      baseStyles,
      'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg',
      isPlaying && 'animate-pulse shadow-xl',
      isPaused && 'opacity-80'
    );
  };

  const getIcon = () => {
    const iconClass = iconSizes[size];
    
    if (isLoading) {
      return <Loader2 className={cn(iconClass, 'animate-spin')} />;
    }
    
    if (isPlaying) {
      return variant === 'compact' ? (
        <Music className={iconClass} />
      ) : (
        <Pause className={iconClass} />
      );
    }
    
    if (isPaused && isCurrent) {
      return <Play className={cn(iconClass, 'text-primary')} />;
    }
    
    return <Play className={cn(iconClass, variant !== 'default' ? '' : 'ml-0.5')} />;
  };

  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (isLoading) return 'Loading song';
    if (isPlaying) return 'Pause song';
    if (isPaused) return 'Resume song';
    return 'Play song';
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlay}
        disabled={disabled || isLoading}
        className={cn(sizeClasses[size], getButtonStyles(), className)}
        aria-label={getAriaLabel()}
      >
        {getIcon()}
        
        {/* Progress Ring for Currently Playing Song */}
        {showProgress && isCurrent && isPlaying && (
          <div className="absolute inset-0 rounded-full">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeOpacity="0.3"
              />
              <path
                d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progress}, 100`}
                className="transition-all duration-300"
              />
            </svg>
          </div>
        )}
      </Button>

      {/* Stop button for active songs */}
      {onStop && (isPlaying || isPaused) && isCurrent && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onStop}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          aria-label="Stop playback"
        >
          <Square className="h-2.5 w-2.5" />
        </Button>
      )}
    </div>
  );
};

export default UnifiedPlayButton;
import React from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { SkipBack, SkipForward, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnifiedAudioControl } from '@/hooks/useUnifiedAudioControl';
import { UnifiedPlayButton } from '@/components/ui/UnifiedPlayButton';

const NowPlayingBanner: React.FC = () => {
  const { currentSong, nextSong, previousSong, stopPlayback } = useAudio();

  if (!currentSong) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-primary/90 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <img 
              src={currentSong.coverArt} 
              alt={currentSong.title}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-primary-foreground font-medium text-xs sm:text-sm truncate">
                {currentSong.title}
              </p>
              <p className="text-primary-foreground/70 text-xs truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20 touch-manipulation"
              onClick={previousSong}
              aria-label="Previous song"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            {/* Unified Play/Pause Button */}
            {(() => {
              const { audioState, handlePlay } = useUnifiedAudioControl(currentSong?.id || '');
              return (
                <UnifiedPlayButton
                  audioState={audioState}
                  onPlay={handlePlay}
                  size="sm"
                  variant="ghost"
                  className="h-9 w-9 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20"
                />
              );
            })()}
            
            <Button
              size="sm" 
              variant="ghost" 
              className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20 touch-manipulation"
              onClick={nextSong}
              aria-label="Next song"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20 touch-manipulation"
              onClick={stopPlayback}
              aria-label="Stop playback"
            >
              <Square className="h-3 w-3" />
            </Button>
          </div>

          {(() => {
            const { audioState } = useUnifiedAudioControl(currentSong?.id || '');
            return audioState.isPlaying && (
              <div className="hidden sm:flex items-center gap-1 ml-4">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary-foreground/60 rounded-full animate-pulse"
                    style={{
                      height: Math.random() * 12 + 8,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '0.8s'
                    }}
                  />
                ))}
              </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBanner;
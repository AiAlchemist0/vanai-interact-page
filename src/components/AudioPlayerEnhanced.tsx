import React from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Headphones } from 'lucide-react';

interface AudioPlayerEnhancedProps {
  className?: string;
  variant?: 'minimal' | 'contextual';
  songId?: string;
}

const AudioPlayerEnhanced: React.FC<AudioPlayerEnhancedProps> = ({ 
  className = '', 
  variant = 'minimal',
  songId 
}) => {
  const { currentSong, isPlaying, playSpecificSong } = useAudio();

  const handlePlay = () => {
    if (songId) {
      playSpecificSong(songId);
    }
  };

  if (variant === 'contextual' && songId) {
    return (
      <Card className={`p-4 bg-card/50 backdrop-blur-sm border-border/50 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              onClick={handlePlay}
              size="lg"
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
            </Button>
            <div className="absolute -inset-1 bg-primary/20 rounded-full animate-pulse opacity-75" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-foreground">
              Listen to Featured Track
            </p>
            <p className="text-xs text-muted-foreground">
              BC AI Hackathon by Rival Tech
            </p>
          </div>
          <Headphones className="h-5 w-5 text-muted-foreground" />
        </div>
      </Card>
    );
  }

  if (!currentSong) return null;

  return (
    <Card className={`p-3 bg-card/80 backdrop-blur-md border-border/50 ${className}`}>
      <div className="flex items-center gap-3">
        <img 
          src={currentSong.coverArt} 
          alt={currentSong.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {currentSong.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentSong.artist}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-center gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-primary rounded-full animate-pulse"
                  style={{
                    height: Math.random() * 8 + 6,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          )}
          <Volume2 className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayerEnhanced;
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

const HeroAudioPlayer = () => {
  const { playSpecificSong, isPlaying, currentSong } = useAudio();
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Simulate audio progress for visual effect
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev + 1) % 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    playSpecificSong("bc-ai-hackathon");
  };

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl p-8 shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Featured Audio</h3>
          <p className="text-muted-foreground text-sm">BC AI Journey Experience</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className="hover:bg-primary/10"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Share className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Album Art & Info */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-primary p-0.5">
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
              <img 
                src="/lovable-uploads/6b65586a-63ba-48f1-9c56-1846ec800f39.png" 
                alt="BC AI Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          {isPlaying && (
            <div className="absolute -inset-2 bg-primary/30 rounded-3xl animate-pulse" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-1">BC AI Hackathon</h4>
          <p className="text-muted-foreground text-sm mb-2">by Rival Tech</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>4:32</span>
            <span>•</span>
            <span>High Quality Audio</span>
            <span>•</span>
            <span>2024</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>1:23</span>
          <span>4:32</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${isPlaying ? progress : 30}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center gap-1 mb-6 h-12">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`w-1 bg-gradient-primary rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
            style={{
              height: `${Math.random() * 40 + 10}px`,
              animationDelay: `${i * 0.1}s`,
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <SkipBack className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button
          onClick={handlePlayPause}
          className="h-16 w-16 rounded-full gradient-primary hover:glow-primary transition-smooth group shadow-lg"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-primary-foreground" />
          ) : (
            <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <SkipForward className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mt-6">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 bg-muted/30 rounded-full h-1">
          <div className="w-3/4 h-full bg-primary rounded-full" />
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <Button
          onClick={handlePlayPause}
          className="w-full gradient-accent hover:glow-accent transition-smooth"
        >
          Start Your BC AI Audio Journey
        </Button>
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
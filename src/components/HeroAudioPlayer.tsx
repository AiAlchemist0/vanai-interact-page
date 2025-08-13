import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Share } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const HeroAudioPlayer = () => {
  const { 
    togglePlay, 
    nextSong, 
    previousSong, 
    isPlaying, 
    currentSong, 
    songs, 
    progress, 
    currentTime, 
    duration,
    playSpecificSong,
    currentSongIndex
  } = useAudio();
  
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl p-8 shadow-elegant">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {isPlaying ? `Now Playing: ${currentSong.title}` : 'BC AI Audio Experience'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {songs.length} tracks • Interactive Playlist
          </p>
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

      {/* Current Song Display */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-primary p-0.5">
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center overflow-hidden">
              <img 
                src={currentSong.coverArt} 
                alt={`${currentSong.title} cover`} 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
          {isPlaying && (
            <div className="absolute -inset-2 bg-primary/30 rounded-3xl animate-pulse" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-1 truncate">{currentSong.title}</h4>
          <p className="text-muted-foreground text-sm mb-2">{currentSong.artist}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>•</span>
            <span>{formatTime(duration)}</span>
            <span>•</span>
            <span>Track {currentSongIndex + 1} of {songs.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full bg-muted/30 rounded-full h-2 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
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

      {/* Playlist and Controls Layout */}
      <div className="flex gap-6 mb-8">
        {/* Song Playlist - Left Side */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-4">Full Playlist</h4>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
            {songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => playSpecificSong(song.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                  index === currentSongIndex 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/20 hover:bg-muted/40 border border-transparent'
                }`}
              >
                <div className="relative">
                  <img 
                    src={song.coverArt} 
                    alt={`${song.title} cover`} 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  {index === currentSongIndex && isPlaying && (
                    <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className={`text-sm font-medium truncate ${
                    index === currentSongIndex ? 'text-primary' : 'text-foreground'
                  }`}>
                    {song.title}
                  </h5>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                {index === currentSongIndex && (
                  <div className="text-xs text-primary font-medium">♪</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls - Right Side */}
        <div className="flex flex-col items-center justify-center gap-4 min-w-fit">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10"
            onClick={previousSong}
          >
            <SkipBack className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button
            onClick={togglePlay}
            className="h-16 w-16 rounded-full gradient-primary hover:glow-primary transition-smooth group shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-primary-foreground" />
            ) : (
              <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/10"
            onClick={nextSong}
          >
            <SkipForward className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 bg-muted/30 rounded-full h-1">
          <div className="w-3/4 h-full bg-primary rounded-full" />
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Button
          onClick={togglePlay}
          className="w-full gradient-accent hover:glow-accent transition-smooth"
        >
          {isPlaying ? 'Pause BC AI Experience' : 'Start Your BC AI Audio Journey'}
        </Button>
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
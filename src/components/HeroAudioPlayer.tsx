import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

const HeroAudioPlayer = () => {
  const { 
    isPlaying, 
    currentSong, 
    songs, 
    progress, 
    playSpecificSong,
    currentSongIndex
  } = useAudio();

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl p-4 shadow-elegant">
      {/* Compact Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isPlaying ? `♪ ${currentSong.title}` : 'BC AI Audio Experience'}
        </h3>
        <div className="w-full bg-muted/30 rounded-full h-1.5 relative overflow-hidden">
          <div 
            className="h-full bg-gradient-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Compact Song Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${
              index === currentSongIndex 
                ? 'bg-primary/10 border-primary/30' 
                : 'bg-muted/20 hover:bg-muted/40 border-border/20'
            }`}
          >
            <div className="relative flex-shrink-0">
              <img 
                src={song.coverArt} 
                alt={`${song.title} cover`} 
                className="w-10 h-10 rounded-lg object-cover"
              />
              {index === currentSongIndex && isPlaying && (
                <div className="absolute inset-0 bg-primary/30 rounded-lg" />
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
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => playSpecificSong(song.id)}
              className="h-8 w-8 flex-shrink-0 hover:bg-primary/20"
            >
              {index === currentSongIndex && isPlaying ? (
                <Pause className="h-4 w-4 text-primary" />
              ) : (
                <Play className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
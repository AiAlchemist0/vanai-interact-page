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

      {/* Detailed Song List */}
      <div className="space-y-3">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border ${
              index === currentSongIndex 
                ? 'bg-primary/10 border-primary/30 shadow-lg' 
                : 'bg-muted/20 hover:bg-muted/40 border-border/20'
            }`}
          >
            {/* Track Number */}
            <div className="flex-shrink-0 w-8 text-center">
              <span className={`text-sm font-medium ${
                index === currentSongIndex ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {index + 1}
              </span>
            </div>

            {/* Album Art */}
            <div className="relative flex-shrink-0">
              <img 
                src={song.coverArt} 
                alt={`${song.title} cover`} 
                className="w-20 h-20 rounded-lg object-cover shadow-md"
              />
              {index === currentSongIndex && isPlaying && (
                <div className="absolute inset-0 bg-primary/30 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Song Details */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className={`text-base font-semibold ${
                index === currentSongIndex ? 'text-primary' : 'text-foreground'
              }`}>
                {song.title}
              </h4>
              <p className="text-sm text-muted-foreground font-medium">
                {song.artist}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Track {index + 1} of {songs.length}</span>
                <span>•</span>
                <span>Audio Experience</span>
              </div>
              
              {/* Mini Progress Bar for Current Song */}
              {index === currentSongIndex && (
                <div className="w-full bg-muted/30 rounded-full h-1 mt-2">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
            
            {/* Play Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => playSpecificSong(song.id)}
              className={`h-12 w-12 flex-shrink-0 rounded-full transition-all duration-200 ${
                index === currentSongIndex 
                  ? 'bg-primary/20 hover:bg-primary/30 text-primary' 
                  : 'hover:bg-primary/20 text-muted-foreground hover:text-primary'
              }`}
            >
              {index === currentSongIndex && isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
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
    isLoadedAndReady,
    currentSong, 
    songs, 
    progress, 
    loadSpecificSong,
    startPlayback,
    togglePlay,
    currentSongIndex
  } = useAudio();

  const handlePlayClick = (songId: string, songIndex: number) => {
    if (songIndex === currentSongIndex && isPlaying) {
      togglePlay();
    } else if (songIndex === currentSongIndex && isLoadedAndReady) {
      startPlayback();
    } else {
      loadSpecificSong(songId);
    }
  };

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl p-3 sm:p-4 shadow-elegant">
      {/* Compact Header */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 truncate">
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
      <div className="space-y-1.5 sm:space-y-2">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200 border touch-manipulation ${
              index === currentSongIndex 
                ? 'bg-primary/10 border-primary/30 shadow-lg' 
                : 'bg-muted/20 hover:bg-muted/40 border-border/20'
            }`}
          >
            {/* Track Number */}
            <div className="flex-shrink-0 w-5 sm:w-6 text-center">
              <span className={`text-xs sm:text-sm font-medium ${
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
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md"
              />
              {index === currentSongIndex && isPlaying && (
                <div className="absolute inset-0 bg-primary/30 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white rounded-full animate-pulse" />
                </div>
              )}
            </div>
            
            {/* Song Details */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                index === currentSongIndex ? 'text-primary' : 'text-foreground'
              }`}>
                {song.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                {song.artist}
              </p>
              
              {/* Status Message for Loaded Song */}
              {index === currentSongIndex && isLoadedAndReady && (
                <div className="text-xs text-green-600 font-medium mt-1">
                  Song loaded and ready to play!
                </div>
              )}
              
              {/* Mini Progress Bar for Current Song */}
              {index === currentSongIndex && isPlaying && (
                <div className="w-full bg-muted/30 rounded-full h-1 mt-1">
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
              onClick={() => handlePlayClick(song.id, index)}
              className={`h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 rounded-full transition-all duration-200 touch-manipulation ${
                index === currentSongIndex && isLoadedAndReady
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-600 border border-green-500/30' 
                  : index === currentSongIndex && isPlaying
                  ? 'bg-primary/20 hover:bg-primary/30 text-primary' 
                  : 'hover:bg-primary/20 text-muted-foreground hover:text-primary'
              }`}
            >
              {index === currentSongIndex && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
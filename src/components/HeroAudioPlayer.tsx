import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, BarChart3, PlayCircle, StopCircle } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useSongStatistics } from '@/hooks/useSongStatistics';

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
    startPlaylistMode,
    stopPlaylistMode,
    isPlaylistMode,
    currentSongIndex
  } = useAudio();
  
  const { getPlayCount, getTotalPlays, loading: statsLoading } = useSongStatistics();

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
         <div className="flex items-center justify-between gap-2 mb-2">
           <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
             <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">
               {isPlaylistMode ? "♪ Playing all songs..." : isPlaying ? `♪ ${currentSong.title}` : 'BC AI Audio Experience'}
             </h3>
             <Button
               onClick={isPlaylistMode ? stopPlaylistMode : startPlaylistMode}
               variant={isPlaylistMode ? "destructive" : "secondary"}
               size="sm"
               className="h-7 px-2 text-xs font-medium flex-shrink-0"
             >
               {isPlaylistMode ? (
                 <>
                   <StopCircle className="h-3 w-3 mr-1" />
                   Stop all
                 </>
               ) : (
                 <>
                   <PlayCircle className="h-3 w-3 mr-1" />
                   Play all
                 </>
               )}
             </Button>
           </div>
           <div className="flex items-center gap-1 text-muted-foreground flex-shrink-0">
             {!statsLoading && getTotalPlays() > 0 && (
               <>
                 <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                 <span className="text-xs font-medium">{getTotalPlays()}</span>
               </>
             )}
             {statsLoading && (
               <>
                 <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                 <span className="text-xs font-medium">Loading...</span>
               </>
             )}
             {!statsLoading && getTotalPlays() === 0 && (
               <>
                 <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                 <span className="text-xs font-medium">0 plays</span>
               </>
             )}
           </div>
         </div>
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
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-colors duration-200 border touch-manipulation min-h-[64px] sm:min-h-[80px] ${
              index === currentSongIndex 
                ? 'bg-primary/10 border-primary/30 shadow-lg' 
                : 'bg-muted/20 hover:bg-muted/40 border-border/20'
            }`}
          >
            {/* Track Number */}
            <div className="flex-shrink-0 w-5 sm:w-6 text-center self-start pt-1">
              <span className={`text-xs sm:text-sm font-medium ${
                index === currentSongIndex ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {index + 1}
              </span>
            </div>

            {/* Album Art */}
            <div className="relative flex-shrink-0 self-start">
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
            <div className="flex-1 min-w-0 overflow-hidden">
               <h4 className={`text-xs sm:text-sm font-semibold truncate leading-tight ${
                 index === currentSongIndex ? 'text-primary' : 'text-foreground'
               }`}>
                 {song.title}
               </h4>
               <div className="flex items-center justify-between gap-2 mt-0.5">
                 <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate flex-1 min-w-0">
                   {song.artist}
                 </p>
                 <span className="text-xs text-muted-foreground/70 font-medium flex-shrink-0 ml-2">
                   {!statsLoading ? `♪ ${getPlayCount(song.id)}` : '♪ ...'}
                 </span>
               </div>
              
              {/* Status Message for Loaded Song - Fixed Height */}
              <div className="h-4 mt-1">
                {index === currentSongIndex && isLoadedAndReady && (
                  <div className="text-xs text-green-600 font-medium truncate">
                    Ready to play!
                  </div>
                )}
              </div>
              
              {/* Mini Progress Bar for Current Song - Fixed Height */}
              <div className="h-1 mt-1">
                {index === currentSongIndex && isPlaying && (
                  <div className="w-full bg-muted/30 rounded-full h-1">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Play Button - Fixed Size */}
            <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 self-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayClick(song.id, index)}
                className={`w-full h-full rounded-full transition-colors duration-200 touch-manipulation ${
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, Heart, PlayCircle, StopCircle } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useSongLikes } from '@/hooks/useSongLikes';

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
  
  const { getLikeCount, getTotalLikes, isLiked, toggleLike, loading: likesLoading } = useSongLikes();

  const handlePlayClick = (songId: string, songIndex: number) => {
    if (songIndex === currentSongIndex && isPlaying) {
      togglePlay();
    } else if (songIndex === currentSongIndex && isLoadedAndReady) {
      startPlayback();
    } else {
      loadSpecificSong(songId);
    }
  };

  const handleLikeClick = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike(songId);
  };

  return (
    <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl px-2 py-3 sm:p-4 shadow-elegant">
      {/* Compact Header */}
       <div className="mb-3 sm:mb-4">
         <div className="flex items-center justify-between gap-2 mb-2 h-6 sm:h-7">
           <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-[calc(100%-120px)] sm:max-w-[calc(100%-200px)]">
             <h3 className="text-base sm:text-lg font-semibold text-foreground truncate min-w-0 flex-1 leading-tight">
               {isPlaylistMode ? "♪ Playing all songs..." : isPlaying ? `♪ ${currentSong?.title || ''}` : 'BC AI Audio Experience'}
             </h3>
           </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-muted-foreground">
                {!likesLoading && getTotalLikes() > 0 && (
                  <>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
                    <span className="text-xs font-medium">{getTotalLikes()}</span>
                  </>
                )}
                {likesLoading && (
                  <>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                    <span className="text-xs font-medium">Loading...</span>
                  </>
                )}
                {!likesLoading && getTotalLikes() === 0 && (
                  <>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs font-medium">0 likes</span>
                  </>
                )}
              </div>
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
              <div className="text-xs text-muted-foreground/70 font-medium mt-0.5 flex items-center justify-center">
                <button
                  onClick={(e) => handleLikeClick(song.id, e)}
                  className="transition-all duration-200 hover:scale-110 touch-manipulation"
                >
                  <Heart 
                    className={`w-3 h-3 ${
                      isLiked(song.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-muted-foreground/50 hover:text-red-400'
                    }`} 
                  />
                </button>
                <span className="ml-1 text-xs">{getLikeCount(song.id)}</span>
              </div>
            </div>

            {/* Play Button - Left of Album Art */}
            <div className="flex-shrink-0 self-start">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayClick(song.id, index)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all duration-200 touch-manipulation hover-scale ${
                  index === currentSongIndex && isLoadedAndReady
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-600 border border-green-500/30 shadow-lg animate-pulse' 
                    : index === currentSongIndex && isPlaying
                    ? 'bg-primary/20 hover:bg-primary/30 text-primary shadow-lg' 
                    : 'hover:bg-primary/20 text-muted-foreground hover:text-primary'
                }`}
              >
                {index === currentSongIndex && isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>

            {/* Album Art */}
            <div className="relative flex-shrink-0 self-start">
              <img 
                src={song.coverArt} 
                alt={`${song.title} cover`} 
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md transition-all duration-200"
              />
              
              {/* Playing Animation Indicator */}
              {index === currentSongIndex && isPlaying && (
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full animate-pulse shadow-lg" />
              )}
            </div>
            
            {/* Song Details */}
            <div className="flex-1 min-w-0 overflow-hidden">
               <h4 className={`text-xs sm:text-sm font-semibold truncate leading-tight ${
                 index === currentSongIndex ? 'text-primary' : 'text-foreground'
               }`}>
                 {song.title}
               </h4>
               <div className="mt-0.5">
                 <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
                   {song.artist}
                 </p>
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
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroAudioPlayer;
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, StopCircle, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/contexts/AudioContext";
import { useSongLikes } from '@/hooks/useSongLikes';
import { useEnhancedTracking } from '@/hooks/useEnhancedTracking';
import { useUnifiedAudioControl } from '@/hooks/useUnifiedAudioControl';
import { UnifiedPlayButton } from '@/components/ui/UnifiedPlayButton';
import PhilippeSpecialEffects from './PhilippeSpecialEffects';

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
    loadSpecificSong,
    togglePlay,
    startPlaylistMode,
    stopPlaylistMode,
    stopPlayback,
    isPlaylistMode,
    currentSongIndex
  } = useAudio();
  
  const { 
    getLikeCount, 
    getTotalLikes, 
    isLiked, 
    toggleLike, 
    loading: likesLoading,
    error: likesError 
  } = useSongLikes();

  const { updateActivity } = useEnhancedTracking();
  const { toast } = useToast();

  // Pre-compute all audio controls to avoid multiple hook calls in render
  const audioControls = useMemo(() => {
    return songs.map((song, index) => ({
      songId: song.id,
      index,
      ...useUnifiedAudioControl(song.id, index)
    }));
  }, [songs]);

  const handleLikeClick = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateActivity(); // Track user interaction
    console.log('Like clicked for song:', songId);
    try {
      await toggleLike(songId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  console.log('HeroAudioPlayer: likesLoading =', likesLoading);
  console.log('HeroAudioPlayer: getTotalLikes =', getTotalLikes);

  // Show error state if likes system fails
  if (likesError) {
    console.error('Likes system error:', likesError);
  }

  return (
    <PhilippeSpecialEffects type="player">
      <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl px-2 py-3 sm:p-4 shadow-elegant lg:max-w-none xl:max-w-7xl lg:w-full">
      {/* Compact Header */}
       <div className="mb-3 sm:mb-4">
         <div className="flex items-center justify-between gap-2 mb-2 h-6 sm:h-7">
           <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-[calc(100%-120px)] sm:max-w-[calc(100%-200px)]">
             <h3 className="text-base sm:text-lg font-semibold text-foreground truncate min-w-0 flex-1 leading-tight">
               {isPlaylistMode ? (
                 <span className="flex items-center gap-2">
                   <span className="animate-pulse">🎵</span>
                   Playlist mode • {currentSong?.title || 'Loading...'}
                 </span>
               ) : isPlaying ? (
                 <span className="flex items-center gap-2">
                   <span className="animate-pulse">♪</span>
                   {currentSong?.title || ''}
                 </span>
               ) : (
                 'BC AI Audio Experience'
               )}
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
              <div className="flex items-center gap-1">
                <Button
                  onClick={async () => {
                    if (isPlaylistMode) {
                      stopPlaylistMode();
                    } else {
                      try {
                        await startPlaylistMode();
                      } catch (error) {
                        toast({
                          title: "Autoplay blocked",
                          description: "Please interact with the page first to enable playlist mode.",
                          variant: "destructive"
                        });
                      }
                    }
                  }}
                  variant={isPlaylistMode ? "destructive" : "secondary"}
                  size="sm"
                  className={`h-7 px-2 text-xs font-medium flex-shrink-0 transition-all duration-200 ${
                    isPlaylistMode ? 'animate-pulse shadow-lg' : ''
                  }`}
                >
                  {isPlaylistMode ? (
                    <>
                      <StopCircle className="h-3 w-3 mr-1" />
                      Stop playlist
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-3 w-3 mr-1" />
                      Play all songs
                    </>
                  )}
                </Button>
                
                {/* Stop Button */}
                {(isPlaying || isPlaylistMode) && (
                  <Button
                    onClick={() => {
                      stopPlayback();
                      if (isPlaylistMode) stopPlaylistMode();
                    }}
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs font-medium flex-shrink-0"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                )}
              </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2">
        {songs.map((song, index) => (
          <div
            key={song.id}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200 border touch-manipulation min-h-[64px] sm:min-h-[80px] ${
              index === currentSongIndex 
                ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
                : 'bg-muted/20 hover:bg-muted/40 border-border/20'
            }`}
          >
            {/* Like Button */}
            <div className="flex-shrink-0 w-8 sm:w-10 text-center self-center">
              <div className="flex flex-col items-center justify-center gap-1">
                <button
                  onClick={(e) => handleLikeClick(song.id, e)}
                  className="transition-all duration-200 hover:scale-110 touch-manipulation p-1"
                >
                  <Heart 
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      isLiked(song.id) 
                        ? 'text-red-500 fill-red-500' 
                        : 'text-muted-foreground/50 hover:text-red-400'
                    }`} 
                  />
                </button>
                <span className="text-xs font-medium text-muted-foreground">{getLikeCount(song.id)}</span>
              </div>
            </div>

            {/* Unified Play Button */}
            <div className="flex-shrink-0 self-start">
              {(() => {
                const control = audioControls.find(c => c.songId === song.id);
                if (!control) return null;
                return (
                  <UnifiedPlayButton
                    audioState={control.audioState}
                    onPlay={control.handlePlay}
                    onStop={control.handleStop}
                    size="lg"
                    variant="ghost"
                    showProgress={true}
                    className="sm:w-12 sm:h-12"
                  />
                );
              })()}
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
              
                 {/* Status Message - Fixed Height */}
                 <div className="h-4 mt-1">
                   {(() => {
                     const control = audioControls.find(c => c.songId === song.id);
                     if (!control) return null;
                     const { audioState } = control;
                     if (audioState.isLoading) {
                       return (
                         <div className="text-xs text-primary font-medium truncate flex items-center gap-1">
                           <span className="animate-spin">♪</span>
                           Loading...
                         </div>
                       );
                     }
                     if (audioState.isPlaying) {
                       return (
                         <div className="text-xs text-primary font-medium truncate">
                           Now playing
                         </div>
                       );
                     }
                     if (audioState.isPaused && audioState.isCurrent) {
                       return (
                         <div className="text-xs text-green-600 font-medium truncate">
                           Ready to play
                         </div>
                       );
                     }
                     return null;
                   })()}
                 </div>
              
               {/* Mini Progress Bar for Current Song - Fixed Height */}
               <div className="h-1 mt-1">
                 {(() => {
                   const control = audioControls.find(c => c.songId === song.id);
                   if (!control) return null;
                   const { audioState } = control;
                   if (audioState.isPlaying) {
                     return (
                       <div className="w-full bg-muted/30 rounded-full h-1">
                         <div 
                           className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                           style={{ width: `${audioState.progress}%` }}
                         />
                       </div>
                     );
                   }
                   return null;
                 })()}
               </div>
            </div>
            
          </div>
        ))}
      </div>
      </div>
    </PhilippeSpecialEffects>
  );
};

export default HeroAudioPlayer;
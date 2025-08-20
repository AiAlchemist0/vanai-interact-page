import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, PlayCircle, StopCircle, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudio } from "@/contexts/AudioContext";
import { useSongLikes } from '@/hooks/useSongLikes';

import PhilippeSpecialEffects from './PhilippeSpecialEffects';
import MemoizedSongItem from './MemoizedSongItem';

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
    currentSongIndex,
    updateActivity
  } = useAudio();
  
  const { 
    getLikeCount, 
    getTotalLikes, 
    isLiked, 
    toggleLike, 
    loading: likesLoading,
    error: likesError 
  } = useSongLikes();

  const { toast } = useToast();

  const handleLikeClick = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateActivity(); // Track user interaction
    try {
      await toggleLike(songId);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <PhilippeSpecialEffects type="player">
      <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl px-2 py-3 sm:p-4 shadow-elegant w-full max-w-none">
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
                {!likesLoading && getTotalLikes > 0 && (
                  <>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-red-500" />
                    <span className="text-xs font-medium">{getTotalLikes}</span>
                  </>
                )}
                {likesLoading && (
                  <>
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                    <span className="text-xs font-medium">Loading...</span>
                  </>
                )}
                {!likesLoading && getTotalLikes === 0 && (
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
                   variant={isPlaylistMode ? "secondary" : "secondary"}
                   size="sm"
                    className={`h-7 px-2 text-xs font-medium flex-shrink-0 transition-all duration-300 ${
                      isPlaylistMode 
                        ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30 backdrop-blur-sm glow-primary' 
                        : 'hover:bg-primary/10'
                    }`}
                 >
                   {isPlaylistMode ? (
                      <>
                        <PlayCircle className="h-3 w-3 mr-1" />
                        <span className="relative text-ai-blue font-semibold">
                          Playlist Active
                        </span>
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
      <PhilippeSpecialEffects type="playlist">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-2 lg:gap-2 relative z-10">
        {songs.map((song, index) => (
          <MemoizedSongItem
            key={song.id}
            song={song}
            index={index}
            currentSongIndex={currentSongIndex}
            isPlaying={isPlaying}
            isPlaylistMode={isPlaylistMode}
            onLikeClick={handleLikeClick}
            getLikeCount={getLikeCount}
            isLiked={isLiked}
            updateActivity={updateActivity}
          />
        ))}
        </div>
      </PhilippeSpecialEffects>
      </div>
    </PhilippeSpecialEffects>
  );
};

export default HeroAudioPlayer;
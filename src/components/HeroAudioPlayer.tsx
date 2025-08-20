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
      <div className="bg-card/20 backdrop-blur-xl border border-border/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-elegant w-full">
      {/* Enhanced Header */}
       <div className="mb-6 sm:mb-8">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
           <div className="flex items-center gap-3 flex-1 min-w-0">
             <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight">
               {isPlaylistMode ? (
                 <span className="flex items-center gap-3">
                   <span className="animate-pulse text-2xl">🎵</span>
                   <span className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                     <span>Playlist mode</span>
                     {currentSong?.title && (
                       <>
                         <span className="hidden sm:inline text-muted-foreground">•</span>
                         <span className="text-lg sm:text-xl text-primary font-medium">{currentSong.title}</span>
                       </>
                     )}
                   </span>
                 </span>
               ) : isPlaying ? (
                 <span className="flex items-center gap-3">
                   <span className="animate-pulse text-2xl">♪</span>
                   <span className="text-primary font-medium">{currentSong?.title || ''}</span>
                 </span>
               ) : (
                 'BC AI Audio Experience'
               )}
             </h3>
           </div>
           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                {!likesLoading && getTotalLikes > 0 && (
                  <>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <span className="text-sm font-medium">{getTotalLikes} total likes</span>
                  </>
                )}
                {likesLoading && (
                  <>
                    <Heart className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium">Loading likes...</span>
                  </>
                )}
                {!likesLoading && getTotalLikes === 0 && (
                  <>
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">No likes yet</span>
                  </>
                )}
              </div>
               <div className="flex items-center gap-3">
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
                   size="default"
                    className={`h-11 px-4 text-sm font-medium transition-all duration-300 ${
                      isPlaylistMode 
                        ? 'bg-ai-blue/20 text-ai-blue border border-ai-blue/30 backdrop-blur-sm glow-primary' 
                        : 'hover:bg-primary/10'
                    }`}
                 >
                   {isPlaylistMode ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        <span className="relative text-ai-blue font-semibold">
                          Playlist Active
                        </span>
                      </>
                   ) : (
                     <>
                       <PlayCircle className="h-4 w-4 mr-2" />
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
                    size="default"
                    className="h-11 px-4 text-sm font-medium"
                  >
                    <Square className="h-4 w-4 mr-2" />
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

       {/* Enhanced Song List */}
      <PhilippeSpecialEffects type="playlist">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 relative z-10">
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
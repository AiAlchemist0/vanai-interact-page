import React, { useState } from 'react';
import { Heart, Info } from "lucide-react";
import { useUnifiedAudioControl } from '@/hooks/useUnifiedAudioControl';
import { UnifiedPlayButton } from '@/components/ui/UnifiedPlayButton';
import { SongInfoModal } from '@/components/SongInfoModal';

interface SongItemProps {
  song: {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
  };
  index: number;
  currentSongIndex: number | null;
  isPlaying: boolean;
  isPlaylistMode: boolean;
  onLikeClick: (songId: string, e: React.MouseEvent) => void;
  getLikeCount: (songId: string) => number;
  isLiked: (songId: string) => boolean;
  updateActivity?: () => void;
}

const SongItem: React.FC<SongItemProps> = ({
  song,
  index,
  currentSongIndex,
  isPlaying,
  isPlaylistMode,
  onLikeClick,
  getLikeCount,
  isLiked,
  updateActivity
}) => {
  // Now hooks are called at the top level of this component
  const { audioState, handlePlay, handleStop } = useUnifiedAudioControl(song.id, index, updateActivity);
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <div
      className={`flex flex-col items-center p-3 sm:p-4 lg:p-3 rounded-xl transition-all duration-200 border touch-manipulation cursor-pointer hover:scale-[1.02] aspect-square ${
        index === currentSongIndex 
          ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
          : 'bg-muted/20 hover:bg-muted/40 border-border/20'
      }`}
      onClick={handlePlay}
    >
      {/* Album Art - Large and Centered */}
      <div className="relative mb-3 sm:mb-4">
        <img 
          src={song.coverArt} 
          alt={`${song.title} cover`} 
          className="w-36 h-36 sm:w-48 sm:h-48 lg:w-44 lg:h-44 rounded-lg object-cover shadow-md transition-all duration-200"
        />
        
        {/* Playing Animation Indicator */}
        {index === currentSongIndex && isPlaying && (
          <div className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full animate-pulse shadow-lg" />
        )}
      </div>
      
      {/* Song Details - Centered Under Image */}
      <div className="text-center mb-3 sm:mb-4 w-full">
         <h4 className={`text-sm sm:text-base font-semibold truncate leading-tight ${
           index === currentSongIndex ? 'text-primary' : 'text-foreground'
         }`}>
           {song.title}
         </h4>
         <p className="text-xs sm:text-sm text-muted-foreground font-medium truncate mt-1">
           {song.artist}
         </p>
        
          {/* Status Message - Fixed Height */}
          <div className="h-4 mt-2">
            {audioState.isLoading && (
              <div className="text-xs text-primary font-medium truncate flex items-center justify-center gap-1">
                <span className="animate-spin">♪</span>
                Loading...
              </div>
            )}
            {audioState.isPlaying && (
              <div className="text-xs text-primary font-medium truncate">
                Now playing
              </div>
            )}
            {audioState.isPaused && audioState.isCurrent && (
              <div className="text-xs text-green-600 font-medium truncate">
                Ready to play
              </div>
            )}
          </div>
        
         {/* Mini Progress Bar for Current Song - Fixed Height */}
         <div className="h-1 mt-2 w-full">
           {audioState.isPlaying && (
             <div className="w-full bg-muted/30 rounded-full h-1">
               <div 
                 className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                 style={{ width: `${audioState.progress}%` }}
               />
             </div>
           )}
          </div>
       </div>

      {/* Controls - Play Button and Action Buttons */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
        {/* Unified Play Button */}
        <UnifiedPlayButton
          audioState={audioState}
          onPlay={handlePlay}
          onStop={handleStop}
          size="lg"
          variant="ghost"
          showProgress={true}
          className="sm:w-14 sm:h-14"
        />

        {/* Action Buttons - Like and Info */}
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={(e) => onLikeClick(song.id, e)}
            className="transition-all duration-200 hover:scale-110 touch-manipulation p-2 relative"
          >
            <Heart 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isLiked(song.id) 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-muted-foreground/50 hover:text-red-400'
              }`} 
            />
            {/* Like count inside the heart */}
            <span className="absolute inset-0 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white drop-shadow-sm pointer-events-none">
              {getLikeCount(song.id)}
            </span>
          </button>
          
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfoModal(true);
            }}
            className="transition-all duration-200 hover:scale-110 touch-manipulation p-2 shadow-[0_0_15px_rgba(0,123,255,0.6)] hover:shadow-[0_0_25px_rgba(0,123,255,0.9)] border border-blue-400 rounded-full bg-blue-500/20 text-blue-400 hover:text-blue-300"
          >
            <Info 
              className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/50 hover:text-primary"
            />
          </button>
        </div>
      </div>
       
       {/* Song Info Modal */}
       <SongInfoModal 
         isOpen={showInfoModal}
         onClose={() => setShowInfoModal(false)}
         songId={song.id}
       />
    </div>
  );
};

export default SongItem;
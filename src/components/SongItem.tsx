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
      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all duration-200 border touch-manipulation min-h-[64px] sm:min-h-[80px] ${
        index === currentSongIndex 
          ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
          : 'bg-muted/20 hover:bg-muted/40 border-border/20'
      }`}
    >
      {/* Action Buttons - Like and Info */}
      <div className="flex-shrink-0 w-8 sm:w-10 text-center self-center">
        <div className="flex flex-col items-center justify-center gap-1">
          {/* Like Button */}
          <button
            onClick={(e) => onLikeClick(song.id, e)}
            className="transition-all duration-200 hover:scale-110 touch-manipulation p-1"
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isLiked(song.id) 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-muted-foreground/50 hover:text-red-400'
              }`} 
            />
          </button>
          
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfoModal(true);
            }}
            className="transition-all duration-200 hover:scale-110 touch-manipulation p-1"
          >
            <Info 
              className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50 hover:text-primary"
            />
          </button>
          
          <span className="text-xs font-medium text-muted-foreground">{getLikeCount(song.id)}</span>
        </div>
      </div>

      {/* Unified Play Button */}
      <div className="flex-shrink-0 self-start">
        <UnifiedPlayButton
          audioState={audioState}
          onPlay={handlePlay}
          onStop={handleStop}
          size="lg"
          variant="ghost"
          showProgress={true}
          className="sm:w-12 sm:h-12"
        />
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
            {audioState.isLoading && (
              <div className="text-xs text-primary font-medium truncate flex items-center gap-1">
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
         <div className="h-1 mt-1">
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
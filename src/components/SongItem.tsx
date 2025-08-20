import React, { useState } from 'react';
import { Heart, Info } from "lucide-react";
import { useUnifiedAudioControl } from '@/hooks/useUnifiedAudioControl';
import { UnifiedPlayButton } from '@/components/ui/UnifiedPlayButton';
import { SongInfoModal } from '@/components/SongInfoModal';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div
      className={`relative ${isMobile ? 'flex flex-row items-center p-2 gap-3' : 'flex flex-col items-center p-3 sm:p-4 lg:p-3 aspect-square'} rounded-xl transition-all duration-200 border touch-manipulation cursor-pointer hover:scale-[1.02] ${
        index === currentSongIndex 
          ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
          : 'bg-muted/20 hover:bg-muted/40 border-border/20'
      }`}
      onClick={handlePlay}
    >
      {/* Album Art - Responsive layout */}
      <div className={`relative ${isMobile ? 'flex-shrink-0' : 'mb-2 sm:mb-3 flex-1'} flex items-center justify-center`}>
        <img 
          src={song.coverArt} 
          alt={`${song.title} cover`} 
          className={`${isMobile ? 'w-16 h-16' : 'w-28 h-28 sm:w-36 sm:h-36 lg:w-32 lg:h-32'} rounded-lg object-cover shadow-md transition-all duration-200`}
        />
        
        {/* Playing Animation Indicator */}
        {index === currentSongIndex && isPlaying && (
          <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-2 h-2' : 'w-3 h-3 sm:w-4 sm:h-4'} bg-primary rounded-full animate-pulse shadow-lg`} />
        )}

        {/* Large Play Button Overlay - Shows on hover */}
        {!isMobile && (
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
            audioState.isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-0 hover:opacity-100'
          }`}>
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-3 transform transition-all duration-200 hover:scale-110 shadow-lg">
              <UnifiedPlayButton
                audioState={audioState}
                onPlay={() => handlePlay()}
                onStop={() => handleStop()}
                size="lg"
                variant="ghost"
                showProgress={false}
                className="w-8 h-8 text-white hover:text-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Responsive */}
      <div className={`${isMobile ? 'flex-1 flex flex-col justify-between min-w-0' : 'w-full text-center'}`}>
        {/* Song Details */}
        <div className={`${isMobile ? 'mb-2' : 'px-1'}`}>
          <h4 className={`${isMobile ? 'text-sm' : 'text-xs sm:text-sm'} font-semibold truncate leading-tight mb-1 ${
            index === currentSongIndex ? 'text-primary' : 'text-foreground'
          }`}>
            {song.title}
          </h4>
          <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground font-medium truncate`}>
            {song.artist}
          </p>
          
          {/* Status Message - Compact */}
          <div className={`${isMobile ? 'h-4 mt-1' : 'h-3 mt-1'}`}>
            {audioState.isLoading && (
              <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-primary font-medium truncate flex items-center ${isMobile ? 'justify-start' : 'justify-center'} gap-1`}>
                <span className="animate-spin">♪</span>
                Loading...
              </div>
            )}
            {audioState.isPlaying && (
              <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-primary font-medium truncate ${isMobile ? 'text-left' : 'text-center'}`}>
                Playing
              </div>
            )}
          </div>
          
          {/* Mini Progress Bar - Thin */}
          <div className={`${isMobile ? 'h-1 mt-2' : 'h-0.5 mt-1'} w-full`}>
            {audioState.isPlaying && (
              <div className={`w-full bg-muted/30 rounded-full ${isMobile ? 'h-1' : 'h-0.5'}`}>
                <div 
                  className={`${isMobile ? 'h-1' : 'h-full'} bg-primary rounded-full transition-all duration-300 ease-out`}
                  style={{ width: `${audioState.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Responsive positioning */}
        <div className={`flex ${isMobile ? 'justify-start' : 'justify-center'} gap-2 ${isMobile ? '' : 'mb-2'}`}>
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick(song.id, e);
            }}
            className={`group relative transition-all duration-300 hover:scale-110 touch-manipulation ${isMobile ? 'p-1.5' : 'p-2'} bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl`}
          >
            <Heart 
              className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} transition-colors duration-200 ${
                isLiked(song.id) 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-muted-foreground group-hover:text-red-400'
              }`} 
            />
            {/* Like count badge */}
            {getLikeCount(song.id) > 0 && (
              <span className={`absolute -top-1 -right-1 bg-red-500 text-white ${isMobile ? 'text-[8px]' : 'text-[9px]'} font-bold rounded-full min-w-[14px] ${isMobile ? 'h-3.5 px-0.5' : 'h-4 px-1'} flex items-center justify-center shadow-md`}>
                {getLikeCount(song.id)}
              </span>
            )}
          </button>
          
          {/* Info Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfoModal(true);
            }}
            className={`group transition-all duration-300 hover:scale-110 touch-manipulation ${isMobile ? 'p-1.5' : 'p-2'} bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl`}
          >
            <Info 
              className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-muted-foreground group-hover:text-primary transition-colors duration-200`}
            />
          </button>

          {/* Mobile Play Button */}
          {isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                audioState.isPlaying ? handleStop() : handlePlay();
              }}
              className="group transition-all duration-300 hover:scale-110 touch-manipulation p-1.5 bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl"
            >
              <UnifiedPlayButton
                audioState={audioState}
                onPlay={() => handlePlay()}
                onStop={() => handleStop()}
                size="sm"
                variant="ghost"
                showProgress={false}
                className="w-3 h-3 text-muted-foreground group-hover:text-primary"
              />
            </button>
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
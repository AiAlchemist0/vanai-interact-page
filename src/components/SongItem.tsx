import React, { useState } from 'react';
import { Heart, Info, Play, Pause } from "lucide-react";
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
      className={`relative group ${isMobile ? 'flex flex-row items-center p-3 gap-3 rounded-lg min-h-[88px]' : 'flex flex-col items-center p-3 sm:p-4 lg:p-3 aspect-square rounded-xl'} transition-all duration-300 border touch-manipulation cursor-pointer ${isMobile ? 'hover:shadow-md active:scale-[0.98]' : 'hover:scale-[1.02]'} ${
        index === currentSongIndex 
          ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
          : 'bg-card/60 hover:bg-card/80 border-border/30 hover:border-border/50'
      }`}
      onClick={isMobile ? (audioState.isPlaying ? handleStop : handlePlay) : handlePlay}
    >
      {/* Album Art - Responsive layout */}
      <div className={`relative ${isMobile ? 'flex-shrink-0' : 'mb-2 sm:mb-3 flex-1'} flex items-center justify-center`}>
        <img 
          src={song.coverArt} 
          alt={`${song.title} cover`} 
          className={`${isMobile ? 'w-16 h-16' : 'w-28 h-28 sm:w-36 sm:h-36 lg:w-32 lg:h-32'} rounded-lg object-cover shadow-sm transition-all duration-300`}
        />
        
        {/* Playing Animation Indicator */}
        {index === currentSongIndex && isPlaying && (
          <div className={`absolute ${isMobile ? '-top-1 -right-1 w-3 h-3' : '-top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4'} bg-primary rounded-full animate-pulse shadow-lg border-2 border-background`} />
        )}

        {/* Play Button Overlay - Desktop: on hover, Mobile: always visible */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          isMobile 
            ? 'opacity-100' 
            : (audioState.isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-0 hover:opacity-100')
        }`}>
          <div className={`bg-black/60 backdrop-blur-sm rounded-full p-3 transform transition-all duration-200 ${isMobile ? '' : 'hover:scale-110'} shadow-lg ${isMobile ? 'min-w-[44px] min-h-[44px]' : ''}`}>
            {audioState.isLoading ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : audioState.isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Responsive */}
      <div className={`${isMobile ? 'flex-1 flex flex-col justify-center min-w-0' : 'w-full text-center'}`}>
        {/* Song Details */}
        <div className={`${isMobile ? 'space-y-1' : 'px-1'}`}>
          <h4 className={`${isMobile ? 'text-lg leading-tight' : 'text-xs sm:text-sm'} font-bold truncate ${
            index === currentSongIndex ? 'text-primary' : 'text-foreground'
          }`}>
            {song.title}
          </h4>
          <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-muted-foreground font-medium truncate`}>
            {song.artist}
          </p>
          
          {/* Status and Progress - Mobile only shows when relevant */}
          {(audioState.isLoading || audioState.isPlaying) && (
            <div className={`${isMobile ? 'space-y-1 mt-2' : 'space-y-1 mt-1'}`}>
              {/* Status Message */}
              {audioState.isLoading && (
                <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-primary font-medium flex items-center ${isMobile ? 'justify-start' : 'justify-center'} gap-1`}>
                  <span className="animate-spin">♪</span>
                  Loading...
                </div>
              )}
              {audioState.isPlaying && !audioState.isLoading && (
                <div className={`${isMobile ? 'text-xs' : 'text-[10px]'} text-primary font-medium ${isMobile ? 'text-left' : 'text-center'}`}>
                  Now Playing
                </div>
              )}
              
              {/* Progress Bar */}
              {audioState.isPlaying && (
                <div className={`w-full bg-muted/30 rounded-full ${isMobile ? 'h-1' : 'h-0.5'}`}>
                  <div 
                    className={`${isMobile ? 'h-1' : 'h-full'} bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out`}
                    style={{ width: `${audioState.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile: positioned absolutely, Desktop: centered */}
        {isMobile ? (
          <div className="absolute top-3 right-3 flex gap-2">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeClick(song.id, e);
              }}
              className="group relative transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation p-2 bg-background/95 backdrop-blur-sm rounded-full border border-border/30 hover:border-border/60 shadow-sm hover:shadow-md"
            >
              <Heart 
                className="w-4 h-4 transition-colors duration-200"
                style={{ 
                  color: isLiked(song.id) ? '#ef4444' : undefined,
                  fill: isLiked(song.id) ? '#ef4444' : 'transparent'
                }}
              />
              {getLikeCount(song.id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-sm">
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
              className="group transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation p-2 bg-background/95 backdrop-blur-sm rounded-full border border-border/30 hover:border-border/60 shadow-sm hover:shadow-md"
            >
              <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-3 mb-2">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeClick(song.id, e);
              }}
              className="group relative transition-all duration-300 hover:scale-110 touch-manipulation p-2 bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl"
            >
              <Heart 
                className="w-4 h-4 transition-colors duration-200"
                style={{ 
                  color: isLiked(song.id) ? '#ef4444' : undefined,
                  fill: isLiked(song.id) ? '#ef4444' : 'transparent'
                }}
              />
              {getLikeCount(song.id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-md">
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
              className="group transition-all duration-300 hover:scale-110 touch-manipulation p-2 bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl"
            >
              <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </button>
          </div>
        )}
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
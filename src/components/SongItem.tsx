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
      className={`relative group ${isMobile ? 'flex flex-row items-center p-4 gap-4 rounded-xl min-h-[100px]' : 'flex flex-col items-center p-4 sm:p-5 lg:p-4 rounded-xl min-h-[280px] sm:min-h-[320px]'} transition-all duration-300 border touch-manipulation cursor-pointer ${isMobile ? 'hover:shadow-lg active:scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-xl'} ${
        index === currentSongIndex 
          ? `bg-primary/10 border-primary/30 shadow-lg ${isPlaylistMode ? 'ring-2 ring-primary/20' : ''}` 
          : 'bg-card/60 hover:bg-card/80 border-border/30 hover:border-border/50'
      }`}
      onClick={isMobile ? (audioState.isPlaying ? handleStop : handlePlay) : handlePlay}
    >
      {/* Album Art - Responsive layout */}
      <div className={`relative ${isMobile ? 'flex-shrink-0' : 'mb-4 sm:mb-5 flex-1'} flex items-center justify-center`}>
        <img 
          src={song.coverArt} 
          alt={`${song.title} cover`} 
          className={`${isMobile ? 'w-20 h-20' : 'w-full max-w-[200px] aspect-square'} rounded-lg object-cover shadow-md transition-all duration-300`}
        />
        
        {/* Playing Animation Indicator */}
        {index === currentSongIndex && isPlaying && (
          <div className={`absolute ${isMobile ? '-top-1 -right-1 w-4 h-4' : '-top-2 -right-2 w-5 h-5'} bg-primary rounded-full animate-pulse shadow-lg border-2 border-background`} />
        )}

        {/* Play Button Overlay - Desktop: on hover, Mobile: always visible */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          isMobile 
            ? 'opacity-100' 
            : (audioState.isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-0 hover:opacity-100')
        }`}>
          <div className={`bg-black/70 backdrop-blur-sm rounded-full p-4 transform transition-all duration-200 ${isMobile ? '' : 'hover:scale-110'} shadow-xl ${isMobile ? 'min-w-[48px] min-h-[48px]' : 'min-w-[56px] min-h-[56px]'}`}>
            {audioState.isLoading ? (
              <div className="w-7 h-7 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : audioState.isPlaying ? (
              <Pause className="w-7 h-7 text-white" />
            ) : (
              <Play className="w-7 h-7 text-white ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Responsive */}
      <div className={`${isMobile ? 'flex-1 flex flex-col justify-center min-w-0' : 'w-full text-center'}`}>
        {/* Song Details */}
        <div className={`${isMobile ? 'space-y-1' : 'px-1'}`}>
          <h4 className={`${isMobile ? 'text-lg leading-tight' : 'text-sm sm:text-base'} font-bold leading-tight ${
            index === currentSongIndex ? 'text-primary' : 'text-foreground'
          }`} style={{ 
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {song.title}
          </h4>
          <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-muted-foreground font-medium leading-tight`} style={{ 
            display: '-webkit-box',
            WebkitLineClamp: isMobile ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
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
          <div className="absolute bottom-4 right-4 flex gap-3">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeClick(song.id, e);
              }}
              className="group relative transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation p-3 bg-background/95 backdrop-blur-sm rounded-full border border-border/30 hover:border-border/60 shadow-md hover:shadow-lg min-w-[48px] min-h-[48px]"
            >
              <Heart 
                className="w-5 h-5 transition-colors duration-200"
                style={{ 
                  color: isLiked(song.id) ? '#ef4444' : undefined,
                  fill: isLiked(song.id) ? '#ef4444' : 'transparent'
                }}
              />
              {getLikeCount(song.id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-5 px-1 flex items-center justify-center shadow-md">
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
              className="group transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation p-3 bg-background/95 backdrop-blur-sm rounded-full border border-border/30 hover:border-border/60 shadow-md hover:shadow-lg min-w-[48px] min-h-[48px]"
            >
              <Info className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-4 mt-auto">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLikeClick(song.id, e);
              }}
              className="group relative transition-all duration-300 hover:scale-110 touch-manipulation p-3 bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl min-w-[48px] min-h-[48px]"
            >
              <Heart 
                className="w-5 h-5 transition-colors duration-200"
                style={{ 
                  color: isLiked(song.id) ? '#ef4444' : undefined,
                  fill: isLiked(song.id) ? '#ef4444' : 'transparent'
                }}
              />
              {getLikeCount(song.id) > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-5 px-1 flex items-center justify-center shadow-md">
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
              className="group transition-all duration-300 hover:scale-110 touch-manipulation p-3 bg-background/90 backdrop-blur-md rounded-full border border-border/50 hover:border-border shadow-lg hover:shadow-xl min-w-[48px] min-h-[48px]"
            >
              <Info className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
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
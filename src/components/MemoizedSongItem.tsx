import React from 'react';
import SongItem from './SongItem';

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

// Memoized version of SongItem to prevent unnecessary re-renders
const MemoizedSongItem = React.memo<SongItemProps>(SongItem, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.song.id === nextProps.song.id &&
    prevProps.index === nextProps.index &&
    prevProps.currentSongIndex === nextProps.currentSongIndex &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.isPlaylistMode === nextProps.isPlaylistMode &&
    prevProps.getLikeCount(prevProps.song.id) === nextProps.getLikeCount(nextProps.song.id) &&
    prevProps.isLiked(prevProps.song.id) === nextProps.isLiked(nextProps.song.id)
  );
});

MemoizedSongItem.displayName = 'MemoizedSongItem';

export default MemoizedSongItem;
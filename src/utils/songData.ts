import { Song } from '@/hooks/useAudioPlayer';
import { SONGS } from '@/components/AudioPlayer';

// Create a song lookup utility
export const getSongById = (songId: string): Song | undefined => {
  return SONGS.find(song => song.id === songId);
};

// Create a song metadata lookup for quick access
export const getSongMetadata = (songId: string) => {
  const song = getSongById(songId);
  if (!song) {
    return {
      title: songId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      artist: 'Unknown Artist',
      coverArt: '/placeholder.svg',
      color: 'from-gray-500 to-gray-600'
    };
  }

  // Create color gradients based on song theme/genre
  const getColorGradient = (title: string, artist: string) => {
    const combined = (title + artist).toLowerCase();
    if (combined.includes('ai') || combined.includes('tech')) return 'from-blue-500 to-cyan-500';
    if (combined.includes('deepfakes') || combined.includes('rain')) return 'from-purple-500 to-pink-500';
    if (combined.includes('circles') || combined.includes('glow')) return 'from-cyan-500 to-blue-500';
    if (combined.includes('space') || combined.includes('alien')) return 'from-orange-500 to-red-500';
    if (combined.includes('consciousness') || combined.includes('mind')) return 'from-indigo-500 to-purple-500';
    if (combined.includes('pixel') || combined.includes('wizard')) return 'from-yellow-500 to-orange-500';
    if (combined.includes('dr') || combined.includes('patrick')) return 'from-green-500 to-teal-500';
    return 'from-pink-500 to-rose-500';
  };

  return {
    title: song.title,
    artist: song.artist,
    coverArt: song.coverArt,
    color: getColorGradient(song.title, song.artist)
  };
};

export { SONGS };
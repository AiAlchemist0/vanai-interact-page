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

  // Create color gradients based on BC AI Survey theme categories and artist/content themes
  const getColorGradient = (title: string, artist: string) => {
    const combined = (title + artist).toLowerCase();
    
    // BC AI Survey Theme Color Mapping
    if (combined.includes('ai') || combined.includes('artificial intelligence') || combined.includes('chatgpt') || combined.includes('tech') || combined.includes('machine learning')) {
      return 'from-[hsl(var(--survey-ai-experience))] to-[hsl(var(--ai-blue))]'; // AI Experience - Blue
    }
    
    if (combined.includes('creative') || combined.includes('art') || combined.includes('music') || combined.includes('pixel') || combined.includes('wizard') || combined.includes('creation') || combined.includes('deepfakes')) {
      return 'from-[hsl(var(--survey-creative-impact))] to-[hsl(var(--ai-purple))]'; // Creative Impact - Purple
    }
    
    if (combined.includes('future') || combined.includes('vision') || combined.includes('innovation') || combined.includes('catalyst') || combined.includes('transformation') || combined.includes('tomorrow')) {
      return 'from-[hsl(var(--survey-future-vision))] to-[hsl(var(--ai-green))]'; // Future Vision - Green
    }
    
    if (combined.includes('relationship') || combined.includes('human') || combined.includes('connection') || combined.includes('love') || combined.includes('family') || combined.includes('circles')) {
      return 'from-[hsl(var(--survey-relationships))] to-[hsl(330_78%_70%)]'; // Relationships - Pink
    }
    
    if (combined.includes('community') || combined.includes('vancouver') || combined.includes('bc') || combined.includes('british columbia') || combined.includes('hackathon') || combined.includes('collective') || combined.includes('coast')) {
      return 'from-[hsl(var(--survey-community))] to-[hsl(var(--ai-orange))]'; // Community - Yellow/Orange
    }
    
    if (combined.includes('consciousness') || combined.includes('mind') || combined.includes('philosophy') || combined.includes('soul') || combined.includes('awareness') || combined.includes('mystery') || combined.includes('mac') || combined.includes('neural') || combined.includes('human')) {
      return 'from-[hsl(var(--survey-creative-impact))] to-[hsl(var(--ai-purple))]'; // Philosophy & Consciousness - Purple
    }
    
    if (combined.includes('identity') || combined.includes('self') || combined.includes('personal') || combined.includes('individual') || combined.includes('indigenous') || combined.includes('cultural') || combined.includes('heritage') || combined.includes('gabriel') || combined.includes('george') || combined.includes('indigenomics') || combined.includes('carol anne hilton') || combined.includes('hesquiaht') || combined.includes('ahousaht') || combined.includes('makah')) {
      return 'from-[hsl(var(--survey-identity))] to-[hsl(var(--survey-future-vision))]'; // Indigenous Identity + Future Vision
    }
    
    // Special cases for specific artists/content
    if (combined.includes('space') || combined.includes('alien') || combined.includes('macmillan')) {
      return 'from-[hsl(var(--survey-future-vision))] to-[hsl(var(--ai-orange))]'; // Space/Alien themes - Future Vision
    }
    
    if (combined.includes('dr') || combined.includes('patrick') || combined.includes('medical') || combined.includes('health')) {
      return 'from-[hsl(var(--survey-identity))] to-[hsl(var(--ai-green))]'; // Medical/Health - Identity to Green
    }
    
    if (combined.includes('gabriel') || combined.includes('george') || combined.includes('eagle') || combined.includes('inlet') || combined.includes('indigenous')) {
      return 'from-[hsl(var(--survey-identity))] to-[hsl(var(--survey-future-vision))]'; // Indigenous themes - Identity to Future Vision
    }
    
    if (combined.includes('darren') || combined.includes('struck') || combined.includes('data') || combined.includes('ceo') || combined.includes('entrepreneur')) {
      return 'from-[hsl(var(--survey-ai-experience))] to-[hsl(var(--survey-future-vision))]'; // Entrepreneurship + AI Experience
    }
    
    // Default fallback
    return 'from-[hsl(var(--primary))] to-[hsl(var(--ai-cyan))]';
  };

  return {
    title: song.title,
    artist: song.artist,
    coverArt: song.coverArt,
    color: getColorGradient(song.title, song.artist)
  };
};

export { SONGS };
import React from 'react';
import { Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSongKeywords } from '@/hooks/useSongKeywords';
import { getSongById } from '@/utils/songData';

interface SongInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
}

export const SongInfoModal: React.FC<SongInfoModalProps> = ({
  isOpen,
  onClose,
  songId
}) => {
  const { getKeywordsForSong, loading: keywordsLoading } = useSongKeywords();
  const song = getSongById(songId);
  
  if (!song) return null;

  const keywords = getKeywordsForSong(songId);
  
  // Group keywords by category
  const keywordsByCategory = keywords.reduce((acc, keyword) => {
    if (!acc[keyword.category]) {
      acc[keyword.category] = [];
    }
    acc[keyword.category].push(keyword);
    return acc;
  }, {} as Record<string, typeof keywords>);

  // Define category colors using BC AI Survey semantic tokens from design system
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      // Primary BC AI Survey Themes
      'AI Experience': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
      'Creative Impact': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]', 
      'Future Vision': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Relationships': 'bg-[hsl(var(--survey-relationships)/0.2)] text-[hsl(var(--survey-relationships))] border-[hsl(var(--survey-relationships)/0.3)]',
      'Community': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'Identity': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      
      // Lionel Ringenbach specific categories mapped to BC AI Survey themes
      'Economic Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]', // Future Vision - economic implications
      'Environmental Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]', // Future Vision - sustainability
      'Innovation': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]', // Creative Impact - innovation
      'Technology Analysis': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]', // AI Experience - tech analysis
      
      // Additional keyword category mappings
      'technology': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
      'concept': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      'location': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'nature': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'organization': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'event': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'person': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      'artist': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      'theme': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]'
    };
    return colors[category] || 'bg-[hsl(var(--muted)/0.2)] text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted)/0.3)]';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 p-6 pb-4">
          <DialogTitle className="sr-only">Song Information</DialogTitle>
          <div className="flex items-start gap-4">
            {/* Song Cover */}
            <img 
              src={song.coverArt} 
              alt={`${song.title} cover`}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
            
            {/* Song Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-1 truncate">
                {song.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium truncate">
                {song.artist}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 px-6">
          <Tabs defaultValue="impact" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0 mb-4">
              <TabsTrigger value="impact" className="text-xs sm:text-sm">Impact on BC + AI Community</TabsTrigger>
              <TabsTrigger value="lyrics" className="text-xs sm:text-sm">Song Lyrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="impact" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[calc(90vh-200px)] sm:h-[calc(90vh-220px)]">
                <div className="space-y-6 pr-4 pb-6">
                  {/* Description */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      This song connects with the BC + AI Survey by exploring themes around artificial intelligence's 
                      impact on creativity, community, and human experience. The artist's work speaks to the evolving 
                      relationship between technology and artistic expression.
                    </p>
                  </div>

                  {/* Keywords by Category */}
                  {keywordsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Loading keywords...</p>
                    </div>
                  ) : keywords.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">Related Themes & Keywords</h3>
                      {Object.entries(keywordsByCategory)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([category, categoryKeywords]) => (
                          <div key={category} className="space-y-3">
                            <h4 className="text-xs sm:text-sm font-medium text-foreground/80 uppercase tracking-wide">
                              {category}
                            </h4>
                            <div className="flex flex-wrap gap-2 max-w-full">
                              {categoryKeywords
                                .sort((a, b) => b.relevance_score - a.relevance_score)
                                .map((keyword) => (
                                  <Badge
                                    key={keyword.keyword}
                                    variant="outline"
                                    className={`text-xs px-2 py-1 break-words max-w-[calc(100%-8px)] ${getCategoryColor(keyword.category)}`}
                                  >
                                    <span className="truncate">{keyword.keyword}</span>
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-muted-foreground">No keywords available for this song.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="lyrics" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[calc(90vh-200px)] sm:h-[calc(90vh-220px)]">
                <div className="space-y-4 pr-4 pb-6">
                  {song.lyrics && song.lyrics.length > 0 ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-foreground/90 leading-relaxed text-sm sm:text-base">
                        {song.lyrics.map((lyric, index) => (
                          <p key={index} className="mb-3">
                            {lyric.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-muted-foreground">No lyrics available for this song.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
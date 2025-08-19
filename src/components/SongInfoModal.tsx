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

  // Define category colors for consistency with EnhancedTopSongs
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI Experience': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Creative Impact': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'Future Vision': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Relationships': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      'Community': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Identity': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="sr-only">Song Information</DialogTitle>
          <div className="flex items-start gap-4 p-2">
            {/* Song Cover */}
            <img 
              src={song.coverArt} 
              alt={`${song.title} cover`}
              className="w-20 h-20 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
            
            {/* Song Details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground leading-tight mb-1">
                {song.title}
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                {song.artist}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="impact" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="impact">Impact on BC + AI Community</TabsTrigger>
            <TabsTrigger value="lyrics">Song Lyrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="impact" className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
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
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Related Themes & Keywords</h3>
                    {Object.entries(keywordsByCategory)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([category, categoryKeywords]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground/80 uppercase tracking-wide">
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {categoryKeywords
                              .sort((a, b) => b.relevance_score - a.relevance_score)
                              .map((keyword) => (
                                <Badge
                                  key={keyword.keyword}
                                  variant="outline"
                                  className={`text-xs px-3 py-1 ${getCategoryColor(keyword.category)}`}
                                >
                                  {keyword.keyword}
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
          
          <TabsContent value="lyrics" className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {song.lyrics && song.lyrics.length > 0 ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-foreground/90 leading-relaxed">
                      {song.lyrics.map((lyric, index) => (
                        <p key={index} className="mb-2">
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
      </DialogContent>
    </Dialog>
  );
};
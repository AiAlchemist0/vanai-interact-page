import React, { useRef } from 'react';
import { Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSongKeywords } from '@/hooks/useSongKeywords';
import { useModalAudioProtection } from '@/hooks/useModalAudioProtection';
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
  
  // Protect audio playback during modal interactions
  const { handleModalClose, handleTabClick, isAudioProtected } = useModalAudioProtection({
    isModalOpen: isOpen,
    onModalStateChange: (modalOpen) => {
      if (!modalOpen) onClose();
    }
  });
  
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
      'Indigenous Culture': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      'Environmental Heritage': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      
      // Lionel Ringenbach specific categories mapped to BC AI Survey themes
      'Economic Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]', // Future Vision - economic implications
      'Environmental Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]', // Future Vision - sustainability
      'Innovation': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]', // Creative Impact - innovation
      'Technology Analysis': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]', // AI Experience - tech analysis
      
      // Darren Nicholls song specific categories
      'Technology & AI': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
      'Business & Entrepreneurship': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Personal Identity': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      'Recreation & Lifestyle': 'bg-[hsl(var(--survey-relationships)/0.2)] text-[hsl(var(--survey-relationships))] border-[hsl(var(--survey-relationships)/0.3)]',
      'Community & Location': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'Career Evolution': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      'Mindset & Philosophy': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      
      // MAC (Mind, AI, & Consciousness) song specific categories  
      'Philosophy & Consciousness': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      'Academic & Research': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
      'Human Identity': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      'Leadership & Vision': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      
      // Indigenomics AI song specific categories
      'Indigenous Identity & Heritage': 'bg-[hsl(var(--survey-identity)/0.2)] text-[hsl(var(--survey-identity))] border-[hsl(var(--survey-identity)/0.3)]',
      'Economic Empowerment & Innovation': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Technology & AI Integration': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
      'Community & Relationships': 'bg-[hsl(var(--survey-relationships)/0.2)] text-[hsl(var(--survey-relationships))] border-[hsl(var(--survey-relationships)/0.3)]',
      'Vision & Future Building': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Leadership & Authority': 'bg-[hsl(var(--survey-community)/0.2)] text-[hsl(var(--survey-community))] border-[hsl(var(--survey-community)/0.3)]',
      'Values & Philosophy': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
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
              <TabsTrigger 
                value="impact" 
                className="text-xs sm:text-sm"
                onClick={handleTabClick}
              >
                Impact on BC + AI Community
              </TabsTrigger>
              <TabsTrigger 
                value="lyrics" 
                className="text-xs sm:text-sm"
                onClick={handleTabClick}
              >
                Song Lyrics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="impact" className="flex-1 min-h-0 mt-0">
              <ScrollArea className="h-[calc(90vh-200px)] sm:h-[calc(90vh-220px)]">
                <div className="space-y-6 pr-4 pb-6">
                  {/* Description */}
                  <div className="prose prose-sm max-w-none">
                     <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                       {song.description ? (
                         <span dangerouslySetInnerHTML={{ __html: song.description }} />
                       ) : songId === "pixel-wizard" ? (
                         <>
                           Kevin Friel's "Mr. Pixel Wizard BC AI" celebrates Vancouver's AI filmmaking 
                           community and the transformative power of AI in creative industries. The song 
                           highlights how AI tools are democratizing film production, breaking down 
                           traditional barriers, and enabling artists to create without massive budgets 
                           or crews. It specifically honors the VanAI community's role in fostering 
                           innovation and collaboration among AI enthusiasts and creators in British Columbia.
                         </>
                       ) : songId === "lionel-ringenbach" ? (
                         <>
                           Lionel Ringenbach's "ChatGPT: Est-ce que ma facture va exploser?" addresses critical questions around AI's environmental and economic impact - themes central to the BC + AI Survey's exploration of technology's broader implications. Through his song, Lionel examines the hidden costs of AI systems, from energy consumption to infrastructure demands. Learn more about his sustainability-focused work at{" "}
                           <a 
                             href="https://wattsup.tech" 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="text-primary hover:underline"
                           >
                             wattsup.tech
                           </a>.
                         </>
                        ) : songId === "dr-patrick" ? (
                          <>
                            "Dr. Patrick Parra Pennefather" by UBC AI Orchestra celebrates the remarkable journey of Dr. Patrick from his leadership role in UBC's Faculty of Arts and the Emerging Media Lab to his influential presence in Vancouver's AI community. As a sound designer, composer, and XR innovation mentor, Dr. Patrick embodies the interdisciplinary bridge between traditional media arts and cutting-edge AI applications. His work with immersive soundscapes, virtual anatomy labs, and Fun Palace carnivals demonstrates how AI collaborations can break down silos and redefine learning experiences. The song honors his vision "There is an AI for that" and his role as a connector who transforms sound into stories while inspiring the next generation of AI innovators.
                          </>
                        ) : songId === "lalala-ai-dilemma" ? (
                          <>
                            A generational anthem exploring the modern dilemma facing young people: pursue traditional university education or dive straight into the AI revolution. Matthew Schwartzman's raw narrative captures the tension between conventional paths and emerging opportunities, featuring mentorship from Dean Shev (Harvard-educated AI strategy leader) and deep connections to Vancouver's AI community including Kris Krug and Surrey meetups. The song authentically portrays the uncertainty of youth navigating job displacement fears (68% statistic), while celebrating the rebellious spirit of a new generation breaking traditional molds. With multilingual elements and references to Teen2Life podcasting, it's both a personal journey and a broader commentary on education's evolving role in the AI era.
                          </>
                          ) : songId === "kris-krug-circles" ? (
                            <>
                              Kris Krug, the visionary founder and philosophical leader of Vancouver's AI community, this song embodies the heart of BC's AI discourse. As founder of the Vancouver AI Community, BC + AI Association, and creator of "Sandboxing AI", Kris bridges traditional media (as a National Geographic photographer) with AI innovation through his "Human++" philosophy. This piece explores deepfake technology, relationship authenticity, and the tension between human touch and code-driven art while celebrating unity in the AI era. It reflects Kris's role as a community connector who facilitates crucial conversations about AI's impact on humanity, creativity, and relationships, addressing fears while promoting optimism about our technological future.
                            </>
                            ) : songId === "gabriel-george-sr-eagles-watch" ? (
                              <>
                                A profound Indigenous cultural teaching that bridges ancient wisdom with modern technology challenges. Gabriel George Sr. welcomes listeners to the sacred inlet village of suh-nak, sharing ancestral stories from the mus-kwee-um, skwaw-mish, and ts-lay-wah-tooth peoples. Through spoken word and traditional eagle songs (kway-tal-us puk-wus), this piece honors Chief Dan George's legacy while exploring themes of environmental stewardship, cultural healing from residential school trauma, and the sacred interconnectedness of all beings. The work masterfully weaves Indigenous place names like sul-ts-munt suh-suh-nuk (Burnaby Mountain) and ceremonial knowledge including regalia, drums, cedar, and prayer, while addressing contemporary calls for unity. Gabriel positions "AI fire" as a modern tool that must honor ancient values of community, respect, and balance with the natural world, bridging traditional hal-ko-may-lum teachings with today's technological discourse.
                              </>
                            ) : songId === "darren-ai-struck" ? (
                              <>
                                This powerful rock anthem embodies the journey of a tech veteran navigating the AI revolution. Darren Nicholls chronicles his evolution from a university coder during the dot-com boom to becoming a visionary CEO and AI community leader in Vancouver. The song masterfully weaves together themes of technological disruption, entrepreneurial resilience, and the importance of family grounding in an increasingly digital world.
                                <br /><br />
                                Through companies like VHT.ai and Bizzer.ai, and his influential Data-guy.ai newsletter reaching hundreds of subscribers, Darren exemplifies the "adapt or perish" mentality that drives innovation in the BC tech ecosystem. The track celebrates the balance between professional ambition and personal fulfillment – from golf courses to campfire adventures, from boardrooms to family gatherings.
                                <br /><br />
                                The anthem's core message resonates deeply within the AI community: embrace change, harness the power of data, and never stop learning. It's a testament to how seasoned professionals can not only survive but thrive in the age of artificial intelligence, becoming leaders who guide others through technological transformation.
                              </>
                            ) : songId === "mac" ? (
                              <>
                                A philosophical anthem celebrating Vancouver's Mind, AI, & Consciousness (MAC) working group, performed by Ziggy Minddust (Loki Jorgenson), a prominent leader in Vancouver's AI community. This deep intellectual exploration examines the fundamental questions at the intersection of artificial intelligence and human consciousness.
                                <br /><br />
                                MAC represents the gold standard for rigorous academic discourse in AI philosophy, moving far beyond superficial "hand-waving chit-chat" to engage with profound scientific papers and philosophical frameworks. The group's methodology involves intensive two-hour syllabus reading sessions, bringing together philosophers, scientists, and AI innovators to tackle consciousness puzzles that challenge our understanding of intelligence, both artificial and human.
                                <br /><br />
                                Under Loki Jorgenson's leadership, MAC has become a cornerstone of Vancouver's AI community, fostering deep conversations about what makes us human in this digital age. The working group bridges the gap between theoretical consciousness studies and practical AI development, inspiring a new generation of thinkers to question everything and break down traditional barriers between mind, technology, and consciousness.
                                <br /><br />
                                This musical tribute captures the essence of MAC's mission: rigorous intellectual pursuit, community-driven learning, and the bold exploration of frontiers where thoughts intertwine with technology. It stands as a testament to Vancouver's role as a hub for consciousness research and AI innovation.
                              </>
                            ) : songId === "indigenomics-ai" ? (
                              <>
                                Carol Anne Hilton's "Indigenomics AI, that's where we start" is a groundbreaking anthem that bridges Indigenous economic sovereignty with artificial intelligence innovation. As founder and CEO of the Indigenomics Institute and author of "Taking a Seat at the Table," Carol Anne brings decades of expertise in Indigenous economic development to the forefront of AI discourse.
                                <br /><br />
                                Her Hesquiaht First Nation heritage from Ahousaht and Makah territories informs her revolutionary approach to data sovereignty and Indigenous-led economic empowerment. Through the Global Centre for Indigenous Economic Healing, Carol Anne champions the integration of traditional Indigenous values with modern technology, ensuring AI development honors Indigenous worldviews of stewardship, community relationships, and multi-generational thinking.
                                <br /><br />
                                The song's central theme of "sovereign data governance" reflects Carol Anne's pioneering work in ensuring Indigenous communities maintain control over their cultural and economic narratives in the digital age. Her vision of "care and commerce" challenges traditional capitalist models by embedding Indigenous values of reciprocity and community wellbeing into economic frameworks.
                                <br /><br />
                                This anthem celebrates the movement from margins to center, positioning Indigenous voices as essential leaders in AI development rather than passive participants. Through her work with corporate boardrooms, policy development, and community building, Carol Anne demonstrates how Indigenous economic philosophies can transform the entire AI ecosystem to be more ethical, sustainable, and inclusive.
                              </>
                            ) : (
                          "This song connects with the BC + AI Survey by exploring themes around artificial intelligence's impact on creativity, community, and human experience. The artist's work speaks to the evolving relationship between technology and artistic expression."
                       )}
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
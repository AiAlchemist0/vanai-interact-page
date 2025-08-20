import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Trophy, Heart, Music, RefreshCw, TrendingUp, Clock, SkipForward, Activity, Info, Tag, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSongMetadata, SONGS } from "@/utils/songData";
import { Progress } from "@/components/ui/progress";
import { useSongKeywords } from "@/hooks/useSongKeywords";
import { useAnalyticsRefresh } from "@/contexts/AnalyticsRefreshContext";

interface ComprehensiveStats {
  song_id: string;
  total_plays: number;
  total_attempts: number;
  avg_duration: number;
  completion_rate: number;
  last_played_at: string;
}

interface SongLikeStats {
  song_id: string;
  total_likes: number;
  last_liked_at: string;
}

interface CombinedSongData {
  song_id: string;
  total_plays: number;
  total_attempts: number;
  avg_duration: number;
  completion_rate: number;
  total_likes: number;
  last_played_at: string;
  last_liked_at: string | null;
  engagement_score: number;
  conversion_rate: number;
}

const EnhancedTopSongsAnalytics = () => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const [songs, setSongs] = useState<CombinedSongData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'plays' | 'likes' | 'engagement'>('plays');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  const { registerRefresh, unregisterRefresh } = useAnalyticsRefresh();

  const {
    getTopKeywordsForSong,
    analytics,
    loading: keywordsLoading
  } = useSongKeywords();

  // Define category colors for consistency using semantic tokens from design system
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
      'Economic Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Environmental Impact': 'bg-[hsl(var(--survey-future-vision)/0.2)] text-[hsl(var(--survey-future-vision))] border-[hsl(var(--survey-future-vision)/0.3)]',
      'Innovation': 'bg-[hsl(var(--survey-creative-impact)/0.2)] text-[hsl(var(--survey-creative-impact))] border-[hsl(var(--survey-creative-impact)/0.3)]',
      'Technology Analysis': 'bg-[hsl(var(--survey-ai-experience)/0.2)] text-[hsl(var(--survey-ai-experience))] border-[hsl(var(--survey-ai-experience)/0.3)]',
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

  const fetchData = async () => {
    try {
      setRefreshing(true);
      console.log('🎵 Fetching Enhanced Top Songs data...');

      // Fetch comprehensive statistics and like statistics
      const [comprehensiveResponse, likesResponse] = await Promise.all([
        supabase.rpc('get_comprehensive_song_statistics'),
        supabase.rpc('get_song_like_statistics')
      ]);

      if (comprehensiveResponse.error) {
        console.error('❌ Error fetching comprehensive stats:', comprehensiveResponse.error);
        throw comprehensiveResponse.error;
      }

      if (likesResponse.error) {
        console.error('❌ Error fetching likes stats:', likesResponse.error);
        throw likesResponse.error;
      }

      const comprehensiveData: ComprehensiveStats[] = comprehensiveResponse.data || [];
      const likesData: SongLikeStats[] = likesResponse.data || [];

      // Create a map of likes for easy lookup
      const likesMap = new Map(likesData.map(like => [like.song_id, like]));

      // Combine data and calculate engagement score
      const combinedData: CombinedSongData[] = comprehensiveData.map(song => {
        const likeData = likesMap.get(song.song_id);
        const likes = likeData?.total_likes || 0;

        // Calculate engagement score (plays weight 60%, likes weight 40%)
        const maxPlays = Math.max(...comprehensiveData.map(s => s.total_plays));
        const maxLikes = Math.max(...likesData.map(l => l.total_likes), 1);
        const playsScore = maxPlays > 0 ? song.total_plays / maxPlays * 60 : 0;
        const likesScore = maxLikes > 0 ? likes / maxLikes * 40 : 0;
        const engagement_score = Math.round(playsScore + likesScore);

        // Calculate conversion rate
        const conversion_rate = song.total_attempts > 0 ? Math.round(song.total_plays / song.total_attempts * 100) : 0;

        return {
          song_id: song.song_id,
          total_plays: song.total_plays,
          total_attempts: song.total_attempts,
          avg_duration: song.avg_duration || 0,
          completion_rate: song.completion_rate || 0,
          total_likes: likes,
          last_played_at: song.last_played_at,
          last_liked_at: likeData?.last_liked_at || null,
          engagement_score,
          conversion_rate
        };
      });

      // Add songs that have likes but no plays
      likesData.forEach(likeData => {
        if (!combinedData.find(song => song.song_id === likeData.song_id)) {
          const maxLikes = Math.max(...likesData.map(l => l.total_likes), 1);
          const likesScore = likeData.total_likes / maxLikes * 40;
          combinedData.push({
            song_id: likeData.song_id,
            total_plays: 0,
            total_attempts: 0,
            avg_duration: 0,
            completion_rate: 0,
            total_likes: likeData.total_likes,
            last_played_at: '',
            last_liked_at: likeData.last_liked_at,
            engagement_score: Math.round(likesScore),
            conversion_rate: 0
          });
        }
      });

      // Ensure all songs from the app catalog are included
      SONGS.forEach(song => {
        if (!combinedData.find(data => data.song_id === song.id)) {
          combinedData.push({
            song_id: song.id,
            total_plays: 0,
            total_attempts: 0,
            avg_duration: 0,
            completion_rate: 0,
            total_likes: 0,
            last_played_at: '',
            last_liked_at: null,
            engagement_score: 0,
            conversion_rate: 0
          });
        }
      });

      console.log('📊 Enhanced Top Songs data updated:', {
        totalSongs: combinedData.length,
        songsWithPlays: combinedData.filter(s => s.total_plays > 0).length,
        songsWithLikes: combinedData.filter(s => s.total_likes > 0).length
      });
      
      setSongs(combinedData);
    } catch (error) {
      console.error('❌ Error fetching song data:', error);
      setError('Failed to fetch song data. Please try refreshing.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchData();
    registerRefresh('enhanced-top-songs', fetchData);
    
    return () => {
      unregisterRefresh('enhanced-top-songs');
    };
  }, [registerRefresh, unregisterRefresh]);

  // Memoize the sorting logic to prevent infinite loops
  const getSortedSongs = useMemo(() => {
    let filtered = [...songs];

    // Filter by selected category if one is chosen
    if (selectedCategory) {
      filtered = filtered.filter(song => {
        const keywords = getTopKeywordsForSong(song.song_id);
        return keywords.some(keyword => keyword.category === selectedCategory);
      });
    }

    const sorted = filtered.sort((a, b) => {
      switch (viewMode) {
        case 'plays':
          return b.total_plays - a.total_plays;
        case 'likes':
          return b.total_likes - a.total_likes;
        case 'engagement':
          return b.engagement_score - a.engagement_score;
        default:
          return b.total_plays - a.total_plays;
      }
    });

    return sorted;
  }, [songs, viewMode, selectedCategory, getTopKeywordsForSong]);

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const sortedSongs = getSortedSongs;
  const maxValue = Math.max(...sortedSongs.map(song => {
    switch (viewMode) {
      case 'plays':
        return song.total_plays;
      case 'likes':
        return song.total_likes;
      case 'engagement':
        return song.engagement_score;
      default:
        return song.total_plays;
    }
  }), 1);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <TooltipProvider>
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="flex items-center space-x-2 text-purple-300">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span>Enhanced Music Leaderboard</span>
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-500 hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                  <div className="space-y-2">
                    <p className="text-sm">Comprehensive song analytics including plays, likes, attempts, completion rates, and engagement scores.</p>
                    <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                      Last updated: {formatTimeAgo(lastRefreshed)}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        
          {/* View Mode Toggles */}
          <div className="flex space-x-1 mt-3">
            {[
              { key: 'plays', label: 'Most Played', icon: Music },
              { key: 'likes', label: 'Most Liked', icon: Heart },
              { key: 'engagement', label: 'Top Engagement', icon: TrendingUp }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={viewMode === key ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(key as any)}
                className={`text-xs ${
                  viewMode === key 
                    ? 'bg-purple-500 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          {analytics.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-400">Filter by BC AI Survey Themes:</span>
              </div>
              <Select 
                value={selectedCategory || "all"} 
                onValueChange={value => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[280px] bg-slate-800/50 border-slate-600 text-slate-300">
                  <SelectValue placeholder="Select a theme..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 z-50">
                  <SelectItem value="all" className="text-slate-300 hover:bg-slate-700">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-2" />
                      All Themes
                    </div>
                  </SelectItem>
                  {analytics.map(({ category }) => (
                    <SelectItem key={category} value={category} className="text-slate-300 hover:bg-slate-700">
                      <div className="flex items-center">
                        <Tag className="h-3 w-3 mr-2" />
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {sortedSongs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No songs available to display</p>
              </div>
            ) : (
              sortedSongs.map((song, index) => {
                const metadata = getSongMetadata(song.song_id);
                const currentValue = viewMode === 'plays' ? song.total_plays : 
                                   viewMode === 'likes' ? song.total_likes : 
                                   song.engagement_score;
                const progressPercentage = currentValue / maxValue * 100;
                const isTop3 = index < 3;

                return (
                  <div 
                    key={song.song_id}
                    className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      isTop3 
                        ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                        : 'bg-slate-800/30'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-black' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {index + 1}
                    </div>

                    {/* Cover Art */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700">
                        <img 
                          src={metadata.coverArt} 
                          alt={`${metadata.title} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-white truncate text-sm">{metadata.title}</h4>
                        {isTop3 && <Trophy className="h-3 w-3 text-yellow-400 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-400 mb-2 truncate">{metadata.artist}</p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            {viewMode === 'plays' ? 'Plays' : 
                             viewMode === 'likes' ? 'Likes' : 
                             'Engagement'}
                          </span>
                          <span className="text-cyan-400 font-medium">{currentValue}</span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={progressPercentage} 
                            className="h-1.5 bg-slate-800"
                          />
                          <div 
                            className={`absolute inset-0 h-1.5 rounded-full bg-gradient-to-r ${metadata.color} opacity-80`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {getTopKeywordsForSong(song.song_id).slice(0, 3).map((keyword, keywordIndex) => (
                          <Badge 
                            key={keywordIndex}
                            variant="outline" 
                            className={`text-xs py-0 px-1.5 ${getCategoryColor(keyword.category)}`}
                          >
                            {keyword.keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Statistics Display */}
                    <div className="flex flex-col items-end space-y-1 text-xs">
                      <div className="text-center space-y-0.5">
                        <div className="text-slate-500">Attempts</div>
                        <div className="text-orange-400 font-medium">{song.total_attempts}</div>
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-slate-500">Success</div>
                        <div className="text-green-400 font-medium">{song.conversion_rate}%</div>
                      </div>
                      <div className="text-center space-y-0.5">
                        <div className="text-slate-500">Avg Duration</div>
                        <div className="text-blue-400 font-medium">{formatDuration(song.avg_duration)}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedTopSongsAnalytics;
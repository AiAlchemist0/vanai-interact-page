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

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (value: number, maxValue: number) => {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    if (percentage >= 80) return { level: 'excellent', color: 'bg-ai-green', textColor: 'text-ai-green' };
    if (percentage >= 60) return { level: 'good', color: 'bg-ai-blue', textColor: 'text-ai-blue' };
    if (percentage >= 40) return { level: 'average', color: 'bg-ai-orange', textColor: 'text-ai-orange' };
    return { level: 'low', color: 'bg-muted', textColor: 'text-muted-foreground' };
  };

  const getStatusBadge = (song: CombinedSongData, index: number) => {
    if (index === 0 && song.total_plays > 0) return { text: 'Top Performer', color: 'bg-ai-green text-background' };
    if (song.total_likes > song.total_plays * 0.3) return { text: 'Rising', color: 'bg-ai-blue text-background' };
    if (song.total_plays === 0 && song.total_likes === 0) return { text: 'New', color: 'bg-muted text-muted-foreground' };
    return null;
  };

  // Define category colors for consistency using semantic tokens from design system
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI Experience': 'bg-ai-blue/20 text-ai-blue border-ai-blue/30',
      'Creative Impact': 'bg-ai-purple/20 text-ai-purple border-ai-purple/30',
      'Future Vision': 'bg-ai-green/20 text-ai-green border-ai-green/30',
      'Relationships': 'bg-accent/20 text-accent border-accent/30',
      'Community': 'bg-ai-orange/20 text-ai-orange border-ai-orange/30',
      'Identity': 'bg-ai-cyan/20 text-ai-cyan border-ai-cyan/30',
      'technology': 'bg-ai-blue/20 text-ai-blue border-ai-blue/30',
      'concept': 'bg-ai-purple/20 text-ai-purple border-ai-purple/30',
      'location': 'bg-ai-orange/20 text-ai-orange border-ai-orange/30',
      'nature': 'bg-ai-green/20 text-ai-green border-ai-green/30',
      'organization': 'bg-ai-orange/20 text-ai-orange border-ai-orange/30',
      'event': 'bg-ai-orange/20 text-ai-orange border-ai-orange/30',
      'person': 'bg-ai-cyan/20 text-ai-cyan border-ai-cyan/30',
      'artist': 'bg-ai-purple/20 text-ai-purple border-ai-purple/30',
      'theme': 'bg-ai-purple/20 text-ai-purple border-ai-purple/30'
    };
    return colors[category] || 'bg-muted/20 text-muted-foreground border-muted/30';
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
      <Card className="bg-card/50 backdrop-blur-xl border-border/50">
        <CardHeader className="border-b border-border/50">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
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
      <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-elegant">
        <CardHeader className="border-b border-border/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-foreground text-xl">
                  Enhanced Music Leaderboard
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Comprehensive analytics with real-time insights
                </p>
              </div>
            </div>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-popover border-border">
                <div className="space-y-2">
                  <p className="text-sm">Performance metrics and engagement analysis</p>
                  <div className="text-xs text-muted-foreground border-t border-border pt-2">
                    Updated: {new Date(lastRefreshed).toLocaleTimeString()}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        
          {/* View Mode Toggles */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { key: 'plays', label: 'Most Played', icon: Music, color: 'ai-blue' },
              { key: 'likes', label: 'Most Liked', icon: Heart, color: 'accent' },
              { key: 'engagement', label: 'Top Engagement', icon: TrendingUp, color: 'ai-green' }
            ].map(({ key, label, icon: Icon, color }) => (
              <Button
                key={key}
                variant={viewMode === key ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode(key as any)}
                className={`transition-all ${
                  viewMode === key 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-muted border-border'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          {analytics.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by themes:</span>
              </div>
              <Select 
                value={selectedCategory || "all"} 
                onValueChange={value => setSelectedCategory(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full max-w-sm bg-background border-border">
                  <SelectValue placeholder="All themes" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-50">
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <Tag className="h-3 w-3 mr-2" />
                      All Themes
                    </div>
                  </SelectItem>
                  {analytics.map(({ category }) => (
                    <SelectItem key={category} value={category}>
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
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}
          
          {sortedSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No songs available to display</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSongs.map((song, index) => {
                const metadata = getSongMetadata(song.song_id);
                const currentValue = viewMode === 'plays' ? song.total_plays : 
                                   viewMode === 'likes' ? song.total_likes : 
                                   song.engagement_score;
                const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);
                const performance = getPerformanceLevel(currentValue, maxValue);
                const status = getStatusBadge(song, index);
                const isTop3 = index < 3;

                return (
                  <div 
                    key={song.song_id}
                    className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                      isTop3 
                        ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-glow-primary' 
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-background ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' :
                      index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100' :
                      'bg-slate-200 text-slate-900 border border-slate-300'
                    }`}>
                      #{index + 1}
                    </div>

                    {/* Status Badge */}
                    {status && (
                      <Badge className={`absolute -top-2 -right-2 ${status.color} text-xs px-2 py-1`}>
                        {status.text}
                      </Badge>
                    )}

                    {/* Song Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <img
                          src={metadata?.coverArt || "/placeholder.svg"}
                          alt={metadata?.title || song.song_id}
                          className="w-16 h-16 rounded-xl object-cover shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        {isTop3 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary rounded-full flex items-center justify-center">
                            <Trophy className="w-2.5 h-2.5 text-background" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg lg:text-xl truncate">
                          {metadata?.title || song.song_id.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-sm lg:text-base text-slate-300 truncate">
                          {metadata?.artist || 'Unknown Artist'}
                        </p>
                      </div>
                    </div>

                    {/* Primary Metric */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm lg:text-base text-slate-300">
                          {viewMode === 'plays' ? 'Total Plays' : 
                           viewMode === 'likes' ? 'Total Likes' : 
                           'Engagement Score'}
                        </span>
                        <span className={`text-3xl lg:text-4xl font-bold text-white`}>
                          {currentValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${performance.color}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-slate-300">
                          {progressPercentage.toFixed(0)}%
                        </span>
                        <span className="text-sm text-slate-300">
                          {performance.level}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Music className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Plays</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {song.total_plays}
                        </p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Likes</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {song.total_likes}
                        </p>
                      </div>
                    </div>

                    {/* Additional Metrics */}
                    {(song.completion_rate > 0 || song.avg_duration > 0) && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {song.completion_rate > 0 && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Activity className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Completion</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {Math.round(song.completion_rate)}%
                            </p>
                          </div>
                        )}
                        {song.avg_duration > 0 && (
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Avg Time</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                              {formatDuration(song.avg_duration)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Keywords */}
                    {getTopKeywordsForSong(song.song_id).length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {getTopKeywordsForSong(song.song_id).slice(0, 3).map((keyword, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className={`text-xs px-2 py-1 ${getCategoryColor(keyword.category)}`}
                            >
                              {keyword.keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EnhancedTopSongsAnalytics;
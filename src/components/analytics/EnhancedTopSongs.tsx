import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Heart, Music, RefreshCw, TrendingUp, Clock, SkipForward, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSongMetadata } from "@/utils/songData";
import { useAudio } from "@/contexts/AudioContext";
import { useUnifiedAudioControl } from "@/hooks/useUnifiedAudioControl";
import { UnifiedPlayButton } from "@/components/ui/UnifiedPlayButton";
import { Progress } from "@/components/ui/progress";

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

const EnhancedTopSongs = () => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const [songs, setSongs] = useState<CombinedSongData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'plays' | 'likes' | 'engagement'>('likes');
  const { currentSong, isPlaying } = useAudio();

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch comprehensive statistics and like statistics
      const [comprehensiveResponse, likesResponse] = await Promise.all([
        supabase.rpc('get_comprehensive_song_statistics'),
        supabase.rpc('get_song_like_statistics')
      ]);

      if (comprehensiveResponse.error) throw comprehensiveResponse.error;
      if (likesResponse.error) throw likesResponse.error;

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
        
        const playsScore = maxPlays > 0 ? (song.total_plays / maxPlays) * 60 : 0;
        const likesScore = maxLikes > 0 ? (likes / maxLikes) * 40 : 0;
        const engagement_score = Math.round(playsScore + likesScore);

        // Calculate conversion rate
        const conversion_rate = song.total_attempts > 0 ? Math.round((song.total_plays / song.total_attempts) * 100) : 0;

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
          const likesScore = (likeData.total_likes / maxLikes) * 40;
          
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

      setSongs(combinedData);
    } catch (error) {
      console.error('Error fetching song data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSortedSongs = () => {
    const sorted = [...songs].sort((a, b) => {
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
    return sorted.slice(0, 10);
  };

  const handleRefresh = () => {
    fetchData();
  };

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

  const sortedSongs = getSortedSongs();
  const maxValue = Math.max(...sortedSongs.map(song => {
    switch (viewMode) {
      case 'plays': return song.total_plays;
      case 'likes': return song.total_likes;
      case 'engagement': return song.engagement_score;
      default: return song.total_plays;
    }
  }), 1);

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <span>Enhanced Music Leaderboard</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
              Live Data
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {sortedSongs.map((song, index) => {
            const metadata = getSongMetadata(song.song_id);
            const currentValue = viewMode === 'plays' ? song.total_plays : 
                               viewMode === 'likes' ? song.total_likes : 
                               song.engagement_score;
            const progressPercentage = (currentValue / maxValue) * 100;
            const isTop3 = index < 3;
            const isCurrentlyPlaying = currentSong?.id === song.song_id && isPlaying;
            
            return (
              <div 
                key={song.song_id}
                className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isCurrentlyPlaying 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 shadow-lg shadow-blue-500/20' 
                    : isTop3 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                    : 'bg-slate-800/30 hover:bg-slate-800/50'
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
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate text-sm">{metadata.title}</h4>
                    {isTop3 && <Trophy className="h-3 w-3 text-yellow-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 mb-2 truncate">{metadata.artist}</p>
                  
                  {/* Primary Stats Row */}
                   <div className="flex items-center space-x-3 text-xs mb-1">
                     <div className="flex items-center space-x-1">
                       <Music className="h-3 w-3 text-cyan-400" />
                       <span className="text-cyan-400">{song.total_plays}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span className="text-pink-400">{song.total_likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-orange-400" />
                      <span className="text-orange-400">{song.total_attempts}</span>
                    </div>
                  </div>
                  
                  {/* Secondary Stats Row */}
                  <div className="flex items-center space-x-3 text-xs mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-purple-400" />
                      <span className="text-purple-400">{formatDuration(song.avg_duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SkipForward className="h-3 w-3 text-yellow-400" />
                      <span className="text-yellow-400">{Math.round(song.completion_rate)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">{song.conversion_rate}%</span>
                    </div>
                  </div>
                  
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
                </div>

                {/* Unified Play Button */}
                <div className="flex flex-col items-center space-y-2">
                  <UnifiedPlayButton
                    audioState={{ 
                      isLoading: false, 
                      isPlaying: isCurrentlyPlaying, 
                      isPaused: false, 
                      isCurrent: currentSong?.id === song.song_id, 
                      progress: 0 
                    }}
                    onPlay={() => window.dispatchEvent(new CustomEvent('audio:play', { detail: { songId: song.song_id } }))}
                    size="md"
                    variant="compact"
                    className="w-10 h-10"
                  />
                  
                  <div className="text-center space-y-0.5">
                    <div className="text-xs text-slate-500 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-0.5" />
                      {song.last_played_at ? 
                        new Date(song.last_played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                        'No plays'
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTopSongs;
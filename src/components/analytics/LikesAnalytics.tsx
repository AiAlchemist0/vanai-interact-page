import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, RefreshCw, TrendingUp, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSongMetadata } from "@/utils/songData";

interface LikeStats {
  song_id: string;
  total_likes: number;
  last_liked_at: string;
}

const LikesAnalytics = () => {
  const [likeStats, setLikeStats] = useState<LikeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLikeStats = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase.rpc('get_song_like_statistics');
      if (error) throw error;
      setLikeStats(data || []);
    } catch (error) {
      console.error('Error fetching like statistics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLikeStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLikeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchLikeStats();
  };

  const totalLikes = likeStats.reduce((sum, song) => sum + song.total_likes, 0);
  const mostLikedSong = likeStats.reduce((prev, current) => 
    prev.total_likes > current.total_likes ? prev : current, 
    { song_id: '', total_likes: 0, last_liked_at: '' }
  );

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Heart className="h-5 w-5 text-pink-400" />
            <span>Song Likes Analytics</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-pink-500/50 text-pink-400 bg-pink-500/10">
              Community Favorites
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
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-4 border border-pink-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-400">Total Likes</span>
            </div>
            <div className="text-2xl font-bold text-white">{totalLikes}</div>
            <p className="text-xs text-slate-400">Across all songs</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">Most Liked</span>
            </div>
            <div className="text-lg font-bold text-white truncate">
              {mostLikedSong.song_id ? getSongMetadata(mostLikedSong.song_id).title : 'N/A'}
            </div>
            <p className="text-xs text-slate-400">{mostLikedSong.total_likes} likes</p>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">Engagement</span>
            </div>
            <div className="text-2xl font-bold text-white">{likeStats.length}</div>
            <p className="text-xs text-slate-400">Songs with likes</p>
          </div>
        </div>

        {/* Top Liked Songs List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="h-4 w-4 text-yellow-400 mr-2" />
            Most Liked Songs
          </h3>
          
          {likeStats
            .sort((a, b) => b.total_likes - a.total_likes)
            .slice(0, 10)
            .map((song, index) => {
              const metadata = getSongMetadata(song.song_id);
              const isTop3 = index < 3;
              
              return (
                <div 
                  key={song.song_id}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    isTop3 
                      ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20' 
                      : 'bg-slate-800/30 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white' :
                    index === 1 ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' :
                    index === 2 ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-white' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Cover Art */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
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
                    <h4 className="font-semibold text-white truncate text-sm">{metadata.title}</h4>
                    <p className="text-xs text-slate-400 truncate">{metadata.artist}</p>
                  </div>

                  {/* Likes Count */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-pink-500/20 px-3 py-1 rounded-full">
                      <Heart className="h-3 w-3 text-pink-400" />
                      <span className="text-sm font-semibold text-pink-400">{song.total_likes}</span>
                    </div>
                  </div>

                  {/* Last Liked */}
                  <div className="text-xs text-slate-500 text-right">
                    <div>Last liked</div>
                    <div>{new Date(song.last_liked_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</div>
                  </div>
                </div>
              );
            })}
        </div>

        {likeStats.length === 0 && (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No likes yet. Be the first to like a song!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LikesAnalytics;
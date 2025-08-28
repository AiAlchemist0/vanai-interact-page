import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Music2, SkipForward, Repeat, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { getSongMetadata } from "@/utils/songData";

interface SongAnalyticsData {
  song_id: string;
  total_plays: number;
  avg_duration: number;
  valid_plays: number;
  avg_completion_rate: number;
  skip_count: number;
  replay_count: number;
  last_played_at: string;
  first_played_at: string;
}

const SongAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<SongAnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSongAnalytics = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_song_analytics');
        
        if (error) throw error;
        setAnalyticsData(data || []);
      } catch (error) {
        console.error('Error fetching song analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongAnalytics();
    
    // Refresh every minute
    const interval = setInterval(fetchSongAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEngagementScore = (song: SongAnalyticsData) => {
    const validPlayRate = (song.valid_plays / song.total_plays) * 100;
    const completionRate = song.avg_completion_rate || 0;
    const replayRate = (song.replay_count / song.total_plays) * 100;
    
    return Math.round((validPlayRate * 0.4 + completionRate * 0.4 + replayRate * 0.2));
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <CardTitle className="flex items-center space-x-2 text-purple-300">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          <span>Detailed Song Analytics</span>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 ml-auto">
            Engagement Metrics
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsData.map((song) => {
            const metadata = getSongMetadata(song.song_id);
            
            const engagementScore = getEngagementScore(song);
            const validPlayRate = (song.valid_plays / song.total_plays) * 100;
            const skipRate = (song.skip_count / song.total_plays) * 100;
            const replayRate = (song.replay_count / song.total_plays) * 100;
            
            return (
              <Card 
                key={song.song_id}
                className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <CardContent className="p-5">
                  {/* Song Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate mb-1">{metadata.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{metadata.artist}</p>
                      <Badge variant="outline" className="text-xs mt-1 border-purple-500/50 text-purple-300">
                        AI Music
                      </Badge>
                    </div>
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${metadata.color} bg-opacity-20`}>
                      <Music2 className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Engagement Score */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-400 font-medium">Engagement Score</span>
                      <span className="text-lg font-bold text-white">{engagementScore}%</span>
                    </div>
                    <Progress value={engagementScore} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-slate-400">Total Plays</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{song.total_plays}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-slate-400">Avg Duration</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatDuration(song.avg_duration || 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SkipForward className="h-3 w-3 text-orange-400" />
                        <span className="text-xs text-slate-400">Skip Rate</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{skipRate.toFixed(1)}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Repeat className="h-3 w-3 text-purple-400" />
                        <span className="text-xs text-slate-400">Replay Rate</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{replayRate.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Completion Rate Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Completion Rate</span>
                      <span className="text-xs font-semibold text-white">
                        {(song.avg_completion_rate || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${metadata.color} transition-all duration-1000`}
                        style={{ width: `${song.avg_completion_rate || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Last Played */}
                  <div className="mt-3 text-xs text-slate-500">
                    Last played: {new Date(song.last_played_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SongAnalytics;
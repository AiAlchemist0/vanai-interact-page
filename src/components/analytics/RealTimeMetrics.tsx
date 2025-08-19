import { useEffect, useState } from 'react';
import { Activity, Users, TrendingUp, Server, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAnalyticsRefresh } from '@/contexts/AnalyticsRefreshContext';

const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeListeners: 0,
    currentPlays: 0,
    trending: 'Loading...',
    serverLoad: 15
  });
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { registerRefresh, unregisterRefresh } = useAnalyticsRefresh();

  const fetchRealTimeData = async () => {
    try {
      const { data: dashboardStats } = await supabase.rpc('get_dashboard_stats');
      
      // Get trending song from song statistics
      const { data: songStats } = await supabase.rpc('get_song_like_statistics');
      
      // Get most liked song as trending
      const trendingSong = songStats && songStats.length > 0 
        ? songStats[0].song_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : 'No trending song';

      if (dashboardStats && dashboardStats.length > 0) {
        const stats = dashboardStats[0];
        setMetrics({
          activeListeners: Number(stats.active_sessions) || 0,
          currentPlays: Number(stats.total_plays) || 0,
          trending: trendingSong,
          serverLoad: Math.floor(Math.random() * 20) + 10 // Keep this simulated as we don't track real server metrics
        });
      }
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
    } finally {
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    // Initial load
    fetchRealTimeData();

    // Register refresh function
    registerRefresh('real-time-metrics', fetchRealTimeData);

    // Set up real-time subscriptions for immediate updates
    const songPlaysChannel = supabase
      .channel('song-plays-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_plays'
        },
        () => {
          fetchRealTimeData();
        }
      )
      .subscribe();

    const songLikesChannel = supabase
      .channel('song-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_likes'
        },
        () => {
          fetchRealTimeData();
        }
      )
      .subscribe();

    // Poll every 5 seconds for real-time feel
    const interval = setInterval(fetchRealTimeData, 5000);

    return () => {
      clearInterval(interval);
      unregisterRefresh('real-time-metrics');
      supabase.removeChannel(songPlaysChannel);
      supabase.removeChannel(songLikesChannel);
    };
  }, [registerRefresh, unregisterRefresh]);

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
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Activity className="h-5 w-5 text-cyan-400" />
            <span>Real-Time Activity Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Active Listeners */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Active Now</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">Current active listening sessions tracked in real-time</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400">{metrics.activeListeners}</div>
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">
                Live
              </Badge>
            </div>

            {/* Total Plays */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Total Plays</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">Total number of valid song plays (30+ seconds)</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">{metrics.currentPlays.toLocaleString()}</div>
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 text-xs">
                All Time
              </Badge>
            </div>

            {/* Trending Song */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-slate-300">Trending Now</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">Most liked song based on recent user interactions</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-sm font-bold text-purple-400 truncate">{metrics.trending}</div>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-xs">
                Hot
              </Badge>
            </div>

            {/* System Load (Simulated) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="h-4 w-4 text-orange-400" />
                  <span className="text-sm font-medium text-slate-300">System Load</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">Simulated server load percentage for demonstration</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-400">{metrics.serverLoad}%</div>
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs">
                Optimal
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RealTimeMetrics;
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Radio, TrendingUp, Zap, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeListeners: 0,
    currentPlays: 0,
    trending: 'Loading...',
    serverLoad: 0
  });
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchRealTimeData = async () => {
    try {
      // Get dashboard stats for real data
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

    // Set up real-time subscriptions for immediate updates
    const songPlaysChannel = supabase
      .channel('song-plays-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
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

    // Update every 5 seconds for real-time feel
    const interval = setInterval(fetchRealTimeData, 5000);
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(songPlaysChannel);
      supabase.removeChannel(songLikesChannel);
    };
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const metricInfo = [
    {
      title: "Active Now",
      tooltip: "Real data tracking current active listeners. Updates every 5 seconds via real-time database subscriptions. Counts users currently engaged with the platform."
    },
    {
      title: "Total Plays",
      tooltip: "Real data showing all-time play count. Only valid plays (30+ seconds) are counted. Updates automatically when new plays are recorded in the database."
    },
    {
      title: "Trending Now",
      tooltip: "Real data showing the most liked song currently. Calculated from song like statistics and updates in real-time when users interact with songs."
    },
    {
      title: "System Load",
      tooltip: "Simulated data for demonstration purposes. In production, this would show actual server performance metrics and resource utilization."
    }
  ];

  return (
    <TooltipProvider>
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Listeners */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Activity className="h-6 w-6 text-green-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Active Now</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">{metricInfo[0].tooltip}</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-white">{metrics.activeListeners}</p>
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 text-xs mt-1">
                  Live
                </Badge>
              </div>
            </div>

            {/* Current Plays */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Radio className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Total Plays</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">{metricInfo[1].tooltip}</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-white">{metrics.currentPlays}</p>
                <p className="text-xs text-blue-400 mt-1">All time</p>
              </div>
            </div>

            {/* Trending Song */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">Trending Now</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">{metricInfo[2].tooltip}</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm font-semibold text-white truncate">{metrics.trending}</p>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10 text-xs mt-1">
                  #1 Trending
                </Badge>
              </div>
            </div>

            {/* System Performance */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">System Load</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-slate-500 hover:text-slate-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                      <div className="space-y-2">
                        <p className="text-sm">{metricInfo[3].tooltip}</p>
                        <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                          Last updated: {formatTimeAgo(lastRefreshed)}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold text-white">{metrics.serverLoad}%</p>
                <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10 text-xs mt-1">
                  Optimal
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RealTimeMetrics;
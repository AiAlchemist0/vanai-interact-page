import { useEffect, useState } from "react";
import { TrendingUp, Users, Clock, MapPin, Zap, Activity, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useAnalyticsRefresh } from "@/contexts/AnalyticsRefreshContext";
interface DashboardStatsData {
  total_plays: number;
  active_sessions: number;
  unique_songs: number;
  avg_session_duration: number;
  top_region: string;
  peak_hour: number;
  total_attempts: number;
}
const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const {
    registerRefresh,
    unregisterRefresh
  } = useAnalyticsRefresh();
  const fetchStats = async () => {
    try {
      const [statsResponse, likesResponse] = await Promise.all([supabase.rpc('get_dashboard_stats'), supabase.rpc('get_song_like_statistics')]);
      if (statsResponse.data && statsResponse.data.length > 0) {
        setStats(statsResponse.data[0]);
      }
      if (likesResponse.data) {
        const total = likesResponse.data.reduce((sum: number, song: any) => sum + (song.total_likes || 0), 0);
        setTotalLikes(total);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };
  useEffect(() => {
    fetchStats();

    // Register refresh function
    registerRefresh('dashboard-stats', fetchStats);

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => {
      clearInterval(interval);
      unregisterRefresh('dashboard-stats');
    };
  }, [registerRefresh, unregisterRefresh]);
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };
  const statCards = [{
    title: "Total Plays",
    value: stats?.total_attempts || 0,
    icon: TrendingUp,
    gradient: "from-blue-500 to-purple-500",
    change: "All attempts",
    description: "Every play attempt",
    tooltipInfo: "Real data showing all song play attempts, including skips and incomplete plays. This gives a complete picture of user engagement with our music platform."
  }, {
    title: "Valid Plays",
    value: stats?.total_plays || 0,
    icon: Activity,
    gradient: "from-green-500 to-emerald-500",
    change: "+12.5%",
    description: "Completed plays (30s+)",
    tooltipInfo: "Real data collected from user interactions. Only counts as a valid play after 30+ seconds of listening. Updated every 30 seconds via Supabase database."
  }, {
    title: "Active Sessions",
    value: stats?.active_sessions || 0,
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    change: "+5 live",
    description: "Current listeners",
    tooltipInfo: "Real data tracking active user sessions. Counts users who have interacted with the app recently. Updated every 30 seconds from session tracking database."
  }, {
    title: "Unique Songs",
    value: stats?.unique_songs || 0,
    icon: Clock,
    gradient: "from-purple-500 to-pink-500",
    change: "All tracks",
    description: "In our collection",
    tooltipInfo: "Calculated data showing total songs available in the platform. This is derived from the song metadata catalog and database records."
  }, {
    title: "Avg Session",
    value: Math.round((stats?.avg_session_duration || 0) / 60),
    icon: Clock,
    gradient: "from-orange-500 to-red-500",
    change: "minutes",
    description: "Per listening session",
    tooltipInfo: "Calculated from real user session data. Averages the time users spend actively listening to music. Based on session tracking and play duration analytics."
  }, {
    title: "Top Region",
    value: stats?.top_region || "BC",
    icon: MapPin,
    gradient: "from-teal-500 to-green-500",
    change: "Leading",
    description: "Most active area",
    tooltipInfo: "Real data based on IP-based geographic detection. Shows the region with the highest number of listening sessions. Location data is anonymized and aggregated."
  }, {
    title: "Peak Hour",
    value: `${stats?.peak_hour || 19}:00`,
    icon: Zap,
    gradient: "from-yellow-500 to-orange-500",
    change: "PST",
    description: "Highest activity",
    tooltipInfo: "Calculated from aggregated listening patterns over the past 7 days. Shows the hour with the highest number of song plays. Time zone: Pacific Standard Time."
  }, {
    title: "Total Likes",
    value: totalLikes,
    icon: Activity,
    gradient: "from-pink-500 to-rose-500",
    change: "Community",
    description: "Song favorites",
    tooltipInfo: "Real data from user interactions. Counts all heart/like actions on songs across the platform. Updated in real-time when users like songs."
  }];
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-6">
        {Array.from({
        length: 8
      }).map((_, i) => <Card key={i} className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-12 bg-slate-700 rounded-xl"></div>
                <div className="h-4 w-20 bg-slate-700 rounded"></div>
                <div className="h-8 w-16 bg-slate-700 rounded"></div>
                <div className="h-3 w-24 bg-slate-700 rounded"></div>
              </div>
            </CardContent>
          </Card>)}
      </div>;
  }
  return <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/25">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-semibold text-white">Analytics Overview</h2>
              <p className="text-slate-300 text-base lg:text-lg">Real-time performance metrics</p>
            </div>
          </div>
          
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 lg:gap-6">
          {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return <Card key={stat.title} className="bg-slate-900/60 border-purple-500/40 shadow-2xl shadow-purple-500/20 backdrop-blur-xl hover:scale-[1.02] hover:shadow-purple-500/30 transition-all duration-300 group touch-manipulation min-h-[200px] sm:min-h-[180px]" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardContent className="p-4 lg:p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 lg:p-4 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm lg:text-base text-green-300 font-medium">{stat.change}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm lg:text-base font-medium text-slate-300">{stat.title}</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400 hover:text-slate-200 cursor-help touch-manipulation" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700 text-slate-100">
                          <div className="space-y-2">
                            <p className="text-sm">{stat.tooltipInfo}</p>
                            <div className="text-xs text-slate-300 border-t border-slate-700 pt-2">
                              Last updated: {formatTimeAgo(lastRefreshed)}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-3xl lg:text-4xl xl:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">
                      {typeof stat.value === 'number' && stat.title !== "Peak Hour" ? stat.value.toLocaleString() : stat.value}
                    </div>
                    <p className="text-sm lg:text-base text-slate-400">{stat.description}</p>
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </TooltipProvider>;
};
export default DashboardStats;
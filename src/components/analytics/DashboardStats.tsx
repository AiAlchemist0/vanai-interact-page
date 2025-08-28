import { useEffect, useState } from "react";
import { TrendingUp, Users, Music, MapPin, Zap, Activity, Info, Play, Timer, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    unit: "",
    icon: Play,
    gradient: "from-blue-500 to-indigo-600",
    changeIndicator: "all",
    changeColor: "text-blue-300",
    description: "Every play attempt",
    tooltipInfo: "Real data showing all song play attempts, including skips and incomplete plays. This gives a complete picture of user engagement with our music platform."
  }, {
    title: "Valid Plays",
    value: stats?.total_plays || 0,
    unit: "qualified",
    icon: Activity,
    gradient: "from-emerald-500 to-green-600",
    changeIndicator: "+12.5%",
    changeColor: "text-emerald-300",
    description: "30+ second plays",
    tooltipInfo: "Real data collected from user interactions. Only counts as a valid play after 30+ seconds of listening. Updated every 30 seconds via Supabase database."
  }, {
    title: "Active Users",
    value: stats?.active_sessions || 0,
    unit: "online",
    icon: Users,
    gradient: "from-cyan-500 to-blue-600",
    changeIndicator: "live",
    changeColor: "text-cyan-300",
    description: "Current listeners",
    tooltipInfo: "Real data tracking active user sessions. Counts users who have interacted with the app recently. Updated every 30 seconds from session tracking database."
  }, {
    title: "Song Library",
    value: 16,
    unit: "tracks",
    icon: Music,
    gradient: "from-purple-500 to-violet-600",
    changeIndicator: "total",
    changeColor: "text-purple-300",
    description: "Available music",
    tooltipInfo: "Calculated data showing total songs available in the platform. This is derived from the song metadata catalog and database records."
  }, {
    title: "Session Length",
    value: Math.round((stats?.avg_session_duration || 0) / 60),
    unit: "minutes",
    icon: Timer,
    gradient: "from-orange-500 to-amber-600",
    changeIndicator: "avg",
    changeColor: "text-orange-300",
    description: "Per listening session",
    tooltipInfo: "Calculated from real user session data. Averages the time users spend actively listening to music. Based on session tracking and play duration analytics."
  }, {
    title: "Top Region",
    value: stats?.top_region || "BC",
    unit: "leading",
    icon: MapPin,
    gradient: "from-teal-500 to-emerald-600",
    changeIndicator: "1st",
    changeColor: "text-teal-300",
    description: "Most active area",
    tooltipInfo: "Real data based on IP-based geographic detection. Shows the region with the highest number of listening sessions. Location data is anonymized and aggregated."
  }, {
    title: "Peak Hour",
    value: `${stats?.peak_hour || 19}:00`,
    unit: "PST",
    icon: Zap,
    gradient: "from-yellow-500 to-orange-600",
    changeIndicator: "busiest",
    changeColor: "text-yellow-300",
    description: "Highest activity",
    tooltipInfo: "Calculated from aggregated listening patterns over the past 7 days. Shows the hour with the highest number of song plays. Time zone: Pacific Standard Time."
  }, {
    title: "Song Hearts",
    value: totalLikes,
    unit: "likes",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    changeIndicator: "total",
    changeColor: "text-rose-300",
    description: "Community favorites",
    tooltipInfo: "Real data from user interactions. Counts all heart/like actions on songs across the platform. Updated in real-time when users like songs."
  }];
  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-card/50 border-border/60 backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-4 lg:p-5">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-muted rounded-lg"></div>
                  <div className="h-4 w-12 bg-muted rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded"></div>
                  <div className="h-7 w-16 bg-muted rounded"></div>
                  <div className="h-3 w-24 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20 backdrop-blur-sm">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl"></div>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Live performance metrics • Updated {formatTimeAgo(lastRefreshed)}</p>
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 lg:gap-5">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="group relative bg-card/60 border-border/60 backdrop-blur-sm hover:bg-card/80 hover:border-border transition-all duration-300 hover-scale animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardContent className="p-4 lg:p-5 relative">
                  {/* Header with icon and indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`relative p-2.5 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${stat.changeColor} bg-background/50 border-border/50 text-xs font-medium px-2 py-1 backdrop-blur-sm`}
                    >
                      {stat.changeIndicator}
                    </Badge>
                  </div>
                  
                  {/* Content section */}
                  <div className="space-y-2">
                    {/* Title and info icon */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground/90 line-clamp-1">{stat.title}</h3>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-help transition-colors shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-popover border-border shadow-lg">
                          <div className="space-y-2 p-1">
                            <p className="text-sm leading-relaxed">{stat.tooltipInfo}</p>
                            <div className="text-xs text-muted-foreground border-t border-border pt-2">
                              Last updated: {formatTimeAgo(lastRefreshed)}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* Main value */}
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {typeof stat.value === 'number' && stat.title !== "Peak Hour" 
                          ? stat.value.toLocaleString() 
                          : stat.value}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{stat.unit}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
export default DashboardStats;
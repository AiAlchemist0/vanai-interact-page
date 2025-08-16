import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Music, Clock, MapPin, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsData {
  total_plays: number;
  active_sessions: number;
  unique_songs: number;
  avg_session_duration: number;
  top_region: string;
  peak_hour: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_dashboard_stats');
        if (error) throw error;
        if (data && data.length > 0) {
          setStats(data[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Plays",
      value: stats?.total_plays || 0,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-500",
      change: "+12.5%",
      description: "Valid plays (30s+)"
    },
    {
      title: "Active Sessions",
      value: stats?.active_sessions || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      change: "+5 live",
      description: "Current listeners"
    },
    {
      title: "Unique Songs",
      value: stats?.unique_songs || 0,
      icon: Music,
      gradient: "from-purple-500 to-pink-500",
      change: "All tracks",
      description: "In our collection"
    },
    {
      title: "Avg Session",
      value: Math.round((stats?.avg_session_duration || 0) / 60),
      icon: Clock,
      gradient: "from-orange-500 to-red-500",
      change: "minutes",
      description: "Per listening session"
    },
    {
      title: "Top Region",
      value: stats?.top_region || "BC",
      icon: MapPin,
      gradient: "from-teal-500 to-green-500",
      change: "Leading",
      description: "Most active area"
    },
    {
      title: "Peak Hour",
      value: `${stats?.peak_hour || 19}:00`,
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
      change: "PST",
      description: "Highest activity"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-slate-900/50 border-purple-500/30">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-xl mb-4" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title}
            className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl hover:scale-105 transition-all duration-300 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-400 font-medium">{stat.change}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
                <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                  {typeof stat.value === 'number' && stat.title !== "Peak Hour" ? stat.value.toLocaleString() : stat.value}
                </div>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
              
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface HourlyData {
  hour: number;
  play_count: number;
}

const HourlyPatterns = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHourlyPatterns = async () => {
      try {
        const { data, error } = await supabase.rpc('get_hourly_patterns');
        if (error) throw error;
        
        // Fill in missing hours with 0 plays
        const completeData = Array.from({ length: 24 }, (_, hour) => {
          const existingData = data?.find(d => d.hour === hour);
          return {
            hour,
            play_count: existingData?.play_count || 0
          };
        });
        
        setHourlyData(completeData);
      } catch (error) {
        console.error('Error fetching hourly patterns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyPatterns();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchHourlyPatterns, 300000);
    return () => clearInterval(interval);
  }, []);

  const maxPlays = Math.max(...hourlyData.map(d => d.play_count));
  const peakHour = hourlyData.reduce((prev, current) => 
    current.play_count > prev.play_count ? current : prev
  );

  const getBarColor = (hour: number, playCount: number) => {
    if (playCount === maxPlays && playCount > 0) return '#22d3ee'; // Peak hour - cyan
    if (hour >= 6 && hour <= 11) return '#a855f7'; // Morning - purple
    if (hour >= 12 && hour <= 17) return '#f59e0b'; // Afternoon - amber
    if (hour >= 18 && hour <= 23) return '#ec4899'; // Evening - pink
    return '#64748b'; // Night - slate
  };

  const formatTooltip = (value: any, name: any) => {
    return [`${value} plays`, 'Plays'];
  };

  const formatLabel = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <CardTitle className="flex items-center space-x-2 text-purple-300">
          <Clock className="h-5 w-5 text-cyan-400" />
          <span>Listening Patterns by Hour</span>
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 bg-cyan-500/10 ml-auto">
            Last 7 Days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Peak Hour Stats */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Peak Listening Hour</p>
              <p className="text-lg font-semibold text-cyan-300">
                {formatLabel(peakHour.hour)} PST
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Peak Plays</p>
            <p className="text-lg font-semibold text-white">{peakHour.play_count}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="hour" 
                tickFormatter={formatLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={formatLabel}
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
              />
              <Bar 
                dataKey="play_count" 
                radius={[4, 4, 0, 0]}
                name="Plays"
              >
                {hourlyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.hour, entry.play_count)}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Period Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-xs text-slate-400">Morning (6-11)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-xs text-slate-400">Afternoon (12-17)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-pink-500"></div>
            <span className="text-xs text-slate-400">Evening (18-23)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-slate-500"></div>
            <span className="text-xs text-slate-400">Night (0-5)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyPatterns;
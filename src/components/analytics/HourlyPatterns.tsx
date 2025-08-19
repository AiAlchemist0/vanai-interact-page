import { useEffect, useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAnalyticsRefresh } from '@/contexts/AnalyticsRefreshContext';

interface HourlyData {
  hour: number;
  play_count: number;
}

const HourlyPatterns = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { registerRefresh, unregisterRefresh } = useAnalyticsRefresh();

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
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchHourlyPatterns();
    
    // Register refresh function
    registerRefresh('hourly-patterns', fetchHourlyPatterns);
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchHourlyPatterns, 300000);
    
    return () => {
      clearInterval(interval);
      unregisterRefresh('hourly-patterns');
    };
  }, [registerRefresh, unregisterRefresh]);

  const maxPlays = hourlyData.length > 0 ? Math.max(...hourlyData.map(d => d.play_count)) : 0;
  const peakHour = hourlyData.length > 0 
    ? hourlyData.reduce((prev, current) => 
        current.play_count > prev.play_count ? current : prev
      )
    : { hour: 19, play_count: 0 }; // Default fallback

  const getBarColor = (hour: number, playCount: number) => {
    if (playCount === maxPlays && playCount > 0) return '#22d3ee'; // Peak hour - cyan
    if (hour >= 6 && hour <= 11) return '#a855f7'; // Morning - purple
    if (hour >= 12 && hour <= 17) return '#f59e0b'; // Afternoon - amber
    if (hour >= 18 && hour <= 23) return '#ec4899'; // Evening - pink
    return '#64748b'; // Night - slate
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
    <TooltipProvider>
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Clock className="h-5 w-5 text-cyan-400" />
            <span>Listening Patterns by Hour</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default HourlyPatterns;
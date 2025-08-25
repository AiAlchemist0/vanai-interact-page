import { useEffect, useState } from 'react';
import { MapPin, Globe, Users, Activity, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAnalyticsRefresh } from '@/contexts/AnalyticsRefreshContext';

interface GeographicData {
  region: string;
  city: string;
  listening_count: number;
  last_activity: string;
}

const GeographicMap = () => {
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { registerRefresh, unregisterRefresh } = useAnalyticsRefresh();

  const fetchGeographicData = async () => {
    try {
      const { data, error } = await supabase.rpc('get_geographic_distribution');
      if (error) throw error;
      setGeoData(data || []);
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      setGeoData([]);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchGeographicData();
    
    // Register refresh function
    registerRefresh('geographic-map', fetchGeographicData);
    
    // Set up real-time subscription for geographic data updates
    const channel = supabase
      .channel('geographic-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_locations'
        },
        () => {
          fetchGeographicData();
        }
      )
      .subscribe();

    // Refresh every 30 seconds
    const interval = setInterval(fetchGeographicData, 30000);

    return () => {
      clearInterval(interval);
      unregisterRefresh('geographic-map');
      supabase.removeChannel(channel);
    };
  }, [registerRefresh, unregisterRefresh]);

  const totalListeners = geoData.reduce((sum, d) => sum + d.listening_count, 0);

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="flex items-center space-x-2 text-white text-xl lg:text-2xl">
            <Globe className="h-6 w-6 lg:h-7 lg:w-7 text-green-300" />
            <span>Global Listening Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {geoData.map((location, index) => (
              <div key={`${location.region}-${location.city}-${index}`} className="flex items-center justify-between p-4 bg-slate-800/60 rounded-lg hover:bg-slate-800/80 transition-colors duration-200 touch-manipulation min-h-[60px]">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 lg:h-6 lg:w-6 text-green-300" />
                  <span className="text-slate-200 text-base lg:text-lg font-medium">{location.city}, {location.region}</span>
                </div>
                <span className="text-green-300 font-semibold text-lg lg:text-xl">{location.listening_count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default GeographicMap;
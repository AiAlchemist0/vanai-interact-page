import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Globe, Users, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  // Sample BC regions with mock coordinates for visualization
  const bcRegions = [
    { name: 'Vancouver', x: 20, y: 70, population: 'Metro', color: 'from-cyan-500 to-blue-500' },
    { name: 'Victoria', x: 15, y: 85, population: 'Capital', color: 'from-purple-500 to-pink-500' },
    { name: 'Surrey', x: 22, y: 68, population: 'Metro', color: 'from-green-500 to-teal-500' },
    { name: 'Burnaby', x: 21, y: 69, population: 'Metro', color: 'from-orange-500 to-red-500' },
    { name: 'Richmond', x: 19, y: 71, population: 'Metro', color: 'from-indigo-500 to-purple-500' },
    { name: 'Kelowna', x: 50, y: 45, population: 'Interior', color: 'from-yellow-500 to-orange-500' },
    { name: 'Abbotsford', x: 25, y: 75, population: 'Fraser Valley', color: 'from-pink-500 to-rose-500' },
    { name: 'Kamloops', x: 55, y: 35, population: 'Interior', color: 'from-teal-500 to-cyan-500' },
    { name: 'Prince George', x: 60, y: 15, population: 'Northern', color: 'from-lime-500 to-green-500' },
    { name: 'Nanaimo', x: 12, y: 65, population: 'Island', color: 'from-violet-500 to-purple-500' }
  ];

  useEffect(() => {
    const fetchGeographicData = async () => {
      try {
        const { data, error } = await supabase.rpc('get_geographic_distribution');
        if (error) throw error;
        setGeoData(data || []);
      } catch (error) {
        console.error('Error fetching geographic data:', error);
        setGeoData([]); // Set empty array instead of mock data
      } finally {
        setLoading(false);
        setLastRefreshed(new Date());
      }
    };

    fetchGeographicData();
    
    // Set up real-time subscription for geographic data updates
    const channel = supabase
      .channel('geographic-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'geographic_data'
        },
        () => {
          fetchGeographicData();
        }
      )
      .subscribe();

    // Refresh every 30 seconds instead of 2 minutes for more real-time feel
    const interval = setInterval(fetchGeographicData, 30000);
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const maxListening = Math.max(...geoData.map(d => d.listening_count));
  const totalListeners = geoData.reduce((sum, d) => sum + d.listening_count, 0);

  const getRegionData = (regionName: string) => {
    return geoData.find(d => d.region === regionName || d.city === regionName);
  };

  const getIntensity = (listening_count: number) => {
    if (listening_count === 0) return 0.1;
    return (listening_count / maxListening) * 0.9 + 0.1;
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="flex items-center space-x-2 text-purple-300">
                <Globe className="h-5 w-5 text-green-400" />
                <span>British Columbia Listening Map</span>
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-500 hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                  <div className="space-y-2">
                    <p className="text-sm">Real geographic data based on IP-based location detection. Shows listening activity across British Columbia regions. Updates every 30 seconds with real-time subscriptions.</p>
                    <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">
                      Last updated: {formatTimeAgo(lastRefreshed)}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
              {totalListeners} Total Listeners
            </Badge>
          </div>
        </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BC Map Visualization */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
              {/* BC Province Outline (simplified) */}
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))' }}
              >
                {/* Simplified BC outline */}
                <path
                  d="M10,60 Q15,40 25,35 L35,30 Q45,25 55,20 L65,15 Q75,12 85,15 L90,20 Q92,30 90,40 L88,50 Q85,60 80,70 L75,80 Q70,85 60,88 L50,90 Q40,88 30,85 L20,80 Q12,70 10,60 Z"
                  fill="rgba(30, 41, 59, 0.5)"
                  stroke="rgba(139, 92, 246, 0.3)"
                  strokeWidth="0.5"
                />
                
                {/* Region points */}
                {bcRegions.map((region) => {
                  const regionData = getRegionData(region.name);
                  const intensity = getIntensity(regionData?.listening_count || 0);
                  const hasData = regionData && regionData.listening_count > 0;
                  
                  return (
                    <g key={region.name}>
                      {/* Glow effect for active regions */}
                      {hasData && (
                        <circle
                          cx={region.x}
                          cy={region.y}
                          r={6 + intensity * 8}
                          fill="url(#glow)"
                          opacity={intensity * 0.3}
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Main point */}
                      <circle
                        cx={region.x}
                        cy={region.y}
                        r={hasData ? 3 + intensity * 4 : 2}
                        fill={hasData ? '#22d3ee' : '#64748b'}
                        opacity={hasData ? 0.9 : 0.4}
                        className={hasData ? 'animate-pulse cursor-pointer' : 'cursor-pointer'}
                        style={{ filter: hasData ? 'drop-shadow(0 0 4px #22d3ee)' : 'none' }}
                      />
                      
                      {/* Label */}
                      <text
                        x={region.x}
                        y={region.y - 8}
                        textAnchor="middle"
                        className="text-xs fill-slate-300 font-medium"
                        style={{ fontSize: hasData ? '4px' : '3px' }}
                      >
                        {region.name}
                      </text>
                      
                      {/* Play count */}
                      {hasData && (
                        <text
                          x={region.x}
                          y={region.y + 12}
                          textAnchor="middle"
                          className="text-xs fill-cyan-400 font-bold"
                          style={{ fontSize: '3px' }}
                        >
                          {regionData.listening_count}
                        </text>
                      )}
                    </g>
                  );
                })}
                
                {/* Gradient definitions */}
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">Activity Level</h4>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-slate-400">Active</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                  <span className="text-slate-400">No Activity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Statistics */}
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Top Regions</span>
              </div>
              <div className="space-y-2">
                {geoData.slice(0, 5).map((region, index) => (
                  <div key={`${region.region}-${region.city}-${index}`} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      <span className="text-sm text-slate-300">{region.region}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{region.listening_count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Coverage Stats</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Regions</span>
                  <span className="text-white font-semibold">{geoData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Listeners</span>
                  <span className="text-white font-semibold">{totalListeners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Top Region</span>
                  <span className="text-white font-semibold">
                    {geoData[0]?.region || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default GeographicMap;
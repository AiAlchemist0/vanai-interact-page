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

interface CityCoordinates {
  [key: string]: [number, number]; // [latitude, longitude]
}

// City coordinates for known locations
const cityCoordinates: CityCoordinates = {
  'Vancouver': [49.2827, -123.1207],
  'Burnaby': [49.2488, -122.9805],
  'Chilliwack': [49.1579, -121.9514],
  'Surrey': [49.1913, -122.8490],
  'Victoria': [48.4284, -123.3656],
  'Richmond': [49.1666, -123.1336],
  'Kelowna': [49.8880, -119.4960],
  'Abbotsford': [49.0580, -122.3258],
  'Kamloops': [50.6745, -120.3273],
  'Prince George': [53.9171, -122.7497],
  'Nanaimo': [49.1659, -123.9401],
  'Toronto': [43.6532, -79.3832],
  'Montreal': [45.5017, -73.5673],
  'Calgary': [51.0447, -114.0719],
  'Edmonton': [53.5461, -113.4938],
  'Ottawa': [45.4215, -75.6972],
  'Winnipeg': [49.8951, -97.1384],
  'Quebec City': [46.8139, -71.2080],
  'Hamilton': [43.2557, -79.8711],
  'Kitchener': [43.4501, -80.4945],
};

const GeographicMap = () => {
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  useEffect(() => {
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

    // Refresh every 30 seconds
    const interval = setInterval(fetchGeographicData, 30000);
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const maxListening = Math.max(...geoData.map(d => d.listening_count));
  const totalListeners = geoData.reduce((sum, d) => sum + d.listening_count, 0);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
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

  return (
    <TooltipProvider>
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="flex items-center space-x-2 text-purple-300">
                <Globe className="h-5 w-5 text-green-400" />
                <span>Global Listening Map</span>
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-slate-500 hover:text-slate-300 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs z-50 bg-slate-800 border-slate-700">
                  <div className="space-y-2">
                    <p className="text-sm">Interactive map showing real listening activity worldwide. Marker size indicates listening intensity. Updates every 30 seconds with real-time data.</p>
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
            {/* Interactive World Map */}
            <div className="lg:col-span-2">
              <div className="relative w-full h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                {/* World Map SVG with real data points */}
                <svg 
                  viewBox="0 0 1000 500" 
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))' }}
                >
                  {/* Simplified world map outline */}
                  <g fill="rgba(30, 41, 59, 0.5)" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1">
                    {/* North America */}
                    <path d="M100,100 Q150,80 200,90 L280,85 Q320,80 350,85 L380,90 Q400,95 420,100 L450,110 Q480,120 500,130 L520,140 Q540,150 550,170 L560,190 Q550,210 540,230 L530,250 Q520,270 500,280 L480,290 Q460,300 440,310 L420,315 Q400,320 380,315 L360,310 Q340,305 320,300 L300,295 Q280,290 260,285 L240,280 Q220,275 200,270 L180,260 Q160,250 140,230 L120,210 Q100,190 95,170 L90,150 Q95,130 100,100 Z" />
                    
                    {/* Europe */}
                    <path d="M450,120 Q470,110 490,115 L510,118 Q530,120 545,125 L560,130 Q575,135 585,140 L595,145 Q605,150 610,160 L615,170 Q610,180 605,190 L600,200 Q595,210 585,215 L575,220 Q565,225 555,220 L545,215 Q535,210 525,205 L515,200 Q505,195 495,190 L485,185 Q475,180 470,170 L465,160 Q470,150 475,140 L480,130 Q485,125 450,120 Z" />
                    
                    {/* Asia */}
                    <path d="M550,80 Q600,70 650,75 L700,80 Q750,85 800,90 L850,95 Q900,100 920,110 L940,120 Q950,130 955,140 L960,150 Q955,160 950,170 L945,180 Q940,190 930,200 L920,210 Q910,220 900,225 L890,230 Q880,235 870,230 L860,225 Q850,220 840,215 L830,210 Q820,205 810,200 L800,195 Q790,190 780,185 L770,180 Q760,175 750,170 L740,165 Q730,160 720,155 L710,150 Q700,145 690,140 L680,135 Q670,130 660,125 L650,120 Q620,110 590,105 L570,100 Q560,95 550,80 Z" />
                  </g>
                  
                  {/* Real data points */}
                  {geoData.map((location, index) => {
                    const coordinates = cityCoordinates[location.city];
                    if (!coordinates) return null;
                    
                    // Convert lat/lng to SVG coordinates
                    const x = ((coordinates[1] + 180) / 360) * 1000; // longitude
                    const y = ((90 - coordinates[0]) / 180) * 500; // latitude
                    const intensity = getIntensity(location.listening_count);
                    const size = 8 + intensity * 12;
                    
                    return (
                      <g key={`${location.city}-${location.region}-${index}`}>
                        {/* Glow effect */}
                        <circle
                          cx={x}
                          cy={y}
                          r={size + 4}
                          fill="url(#glow)"
                          opacity={intensity * 0.4}
                          className="animate-pulse"
                        />
                        
                        {/* Main marker */}
                        <circle
                          cx={x}
                          cy={y}
                          r={size}
                          fill="#22d3ee"
                          opacity={0.9}
                          className="animate-pulse cursor-pointer"
                          style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
                        >
                          <title>{`${location.city}, ${location.region}: ${location.listening_count} listeners`}</title>
                        </circle>
                        
                        {/* City label */}
                        <text
                          x={x}
                          y={y - size - 5}
                          textAnchor="middle"
                          className="text-xs fill-slate-200 font-medium"
                          style={{ fontSize: '12px' }}
                        >
                          {location.city}
                        </text>
                        
                        {/* Count display */}
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          className="text-xs fill-white font-bold"
                          style={{ fontSize: '10px' }}
                        >
                          {location.listening_count}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Gradient definitions */}
                  <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">Activity Level</h4>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span className="text-slate-400">Active Listeners</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Size = Listening Intensity
                  </div>
                </div>
                
                {/* Map info */}
                <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-2">
                  <div className="text-xs text-slate-300">Real-time Global Map</div>
                </div>
              </div>
            </div>

            {/* Regional Statistics */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-400">Top Locations</span>
                </div>
                <div className="space-y-2">
                  {geoData.slice(0, 5).map((location, index) => (
                    <div key={`${location.region}-${location.city}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-sm text-slate-300">{location.city}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{location.listening_count}</span>
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
                    <span className="text-slate-400">Active Cities</span>
                    <span className="text-white font-semibold">{geoData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Listeners</span>
                    <span className="text-white font-semibold">{totalListeners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Top City</span>
                    <span className="text-white font-semibold">
                      {geoData[0]?.city || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Countries</span>
                    <span className="text-white font-semibold">
                      {new Set(geoData.map(d => d.region)).size}
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
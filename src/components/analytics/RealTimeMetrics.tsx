import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Radio, TrendingUp, Zap } from "lucide-react";

const RealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeListeners: 0,
    currentPlays: 0,
    trending: 'BC AI Hackathon',
    serverLoad: 0
  });

  useEffect(() => {
    // Simulate real-time data updates
    const updateMetrics = () => {
      setMetrics(prev => ({
        activeListeners: Math.max(0, prev.activeListeners + Math.floor(Math.random() * 3) - 1),
        currentPlays: prev.currentPlays + Math.floor(Math.random() * 2),
        trending: prev.trending,
        serverLoad: Math.min(100, Math.max(0, prev.serverLoad + Math.floor(Math.random() * 6) - 3))
      }));
    };

    // Initial load
    setMetrics({
      activeListeners: Math.floor(Math.random() * 15) + 5,
      currentPlays: Math.floor(Math.random() * 100) + 50,
      trending: 'BC AI Hackathon',
      serverLoad: Math.floor(Math.random() * 30) + 20
    });

    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Active Listeners */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Activity className="h-6 w-6 text-green-400 animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Now</p>
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
            <div>
              <p className="text-sm text-slate-400">Total Plays</p>
              <p className="text-2xl font-bold text-white">{metrics.currentPlays}</p>
              <p className="text-xs text-blue-400 mt-1">+{Math.floor(Math.random() * 5) + 1} this hour</p>
            </div>
          </div>

          {/* Trending Song */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-400">Trending Now</p>
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
            <div>
              <p className="text-sm text-slate-400">System Load</p>
              <p className="text-2xl font-bold text-white">{metrics.serverLoad}%</p>
              <div className="w-16 h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-orange-400 transition-all duration-1000"
                  style={{ width: `${metrics.serverLoad}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMetrics;
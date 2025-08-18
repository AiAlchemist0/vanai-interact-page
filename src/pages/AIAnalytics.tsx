import { useEffect, useState } from "react";
import { TrendingUp, Users, Clock, MapPin, Zap, BarChart3, Activity, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/analytics/DashboardStats";
import EnhancedTopSongs from "@/components/analytics/EnhancedTopSongs";
import HourlyPatterns from "@/components/analytics/HourlyPatterns";
import GeographicMap from "@/components/analytics/GeographicMap";
import RealTimeMetrics from "@/components/analytics/RealTimeMetrics";
import { EnhancedSongAnalytics } from "@/components/analytics/EnhancedSongAnalytics";
import AudioPlayerProvider from "@/components/AudioPlayerProvider";

const AIAnalytics = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

      {/* Header */}
      <div className="relative z-10 border-b border-purple-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl shadow-lg shadow-purple-500/25">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Music Analytics Dashboard
                </h1>
                <p className="text-slate-400 mt-1">Real-time insights into British Columbia's music landscape</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
              <div className="text-right">
                <div className="text-sm text-slate-400">Current Time</div>
                <div className="font-mono text-cyan-400 font-semibold">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Overview Stats */}
        <DashboardStats />

        {/* Real-time Metrics */}
        <RealTimeMetrics />

        {/* Enhanced Top Songs */}
        <EnhancedTopSongs />

        {/* Hourly Listening Patterns */}
        <HourlyPatterns />

        {/* Geographic Distribution */}
        <GeographicMap />

        {/* Enhanced Song Analytics with Valid Plays vs Attempts */}
        <EnhancedSongAnalytics />

      </div>
    </div>
    </AudioPlayerProvider>
  );
};

export default AIAnalytics;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Clock, MapPin, Zap, BarChart3, Activity, Globe, Home, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DashboardStats from "@/components/analytics/DashboardStats";
import EnhancedTopSongsAnalytics from "@/components/analytics/EnhancedTopSongsAnalytics";
import HourlyPatterns from "@/components/analytics/HourlyPatterns";
import GeographicMap from "@/components/analytics/GeographicMap";

import { AnalyticsRefreshProvider, useAnalyticsRefresh } from "@/contexts/AnalyticsRefreshContext";

const AIAnalyticsContent = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { refreshAll, isRefreshing } = useAnalyticsRefresh();

  const handleRefreshAll = async () => {
    try {
      await refreshAll();
      toast.success("All analytics data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh analytics data");
      console.error('Error refreshing all analytics:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pt-8">
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

      {/* Header */}
      <div className="relative z-10 border-b border-purple-500/20 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl shadow-lg shadow-purple-500/25">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Music Analytics Dashboard
                </h1>
                <p className="text-slate-300 mt-1 text-sm lg:text-base">Real-time insights into British Columbia's music landscape</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  size="default"
                  className="border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:text-white min-h-[44px] px-6"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </Button>
                <Button
                  onClick={handleRefreshAll}
                  disabled={isRefreshing}
                  variant="outline"
                  size="default"
                  className="border-purple-500/50 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 hover:text-white min-h-[44px] px-6"
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh All
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-500/10 px-3 py-1">
                  <Activity className="h-4 w-4 mr-1 animate-pulse" />
                  Live
                </Badge>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Current Time</div>
                  <div className="font-mono text-cyan-300 font-semibold text-lg">
                    {currentTime.toLocaleTimeString()}
                  </div>
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

        {/* Enhanced Top Songs */}
        <EnhancedTopSongsAnalytics />

        {/* Hourly Listening Patterns */}
        <HourlyPatterns />

        {/* Geographic Distribution */}
        <GeographicMap />


      </div>
    </div>
  );
};

const AIAnalytics = () => {
  return (
    <AnalyticsRefreshProvider>
      <AIAnalyticsContent />
    </AnalyticsRefreshProvider>
  );
};

export default AIAnalytics;
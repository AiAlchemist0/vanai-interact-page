import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DataStatus {
  name: string;
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
  count?: number;
}

const DebugDataStatus = () => {
  const [dataStatuses, setDataStatuses] = useState<DataStatus[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const checkDataSources = async () => {
    const statuses: DataStatus[] = [];
    
    try {
      // Check dashboard stats
      const dashboardStatsPromise = supabase.rpc('get_dashboard_stats');
      const comprehensiveStatsPromise = supabase.rpc('get_comprehensive_song_statistics');
      const likeStatsPromise = supabase.rpc('get_song_like_statistics');
      const geoDataPromise = supabase.rpc('get_geographic_distribution');

      // Dashboard stats
      try {
        const result = await dashboardStatsPromise;
        statuses.push({
          name: 'Dashboard Stats',
          status: result.error ? 'error' : 'success',
          data: result.data,
          error: result.error?.message,
          count: result.data?.length || 0
        });
      } catch (error) {
        statuses.push({
          name: 'Dashboard Stats',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Comprehensive song stats
      try {
        const result = await comprehensiveStatsPromise;
        statuses.push({
          name: 'Song Play Stats',
          status: result.error ? 'error' : 'success',
          data: result.data,
          error: result.error?.message,
          count: result.data?.length || 0
        });
      } catch (error) {
        statuses.push({
          name: 'Song Play Stats',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Like stats
      try {
        const result = await likeStatsPromise;
        statuses.push({
          name: 'Song Like Stats',
          status: result.error ? 'error' : 'success',
          data: result.data,
          error: result.error?.message,
          count: result.data?.length || 0
        });
      } catch (error) {
        statuses.push({
          name: 'Song Like Stats',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Geographic data
      try {
        const result = await geoDataPromise;
        statuses.push({
          name: 'Geographic Data',
          status: result.error ? 'error' : 'success',
          data: result.data,
          error: result.error?.message,
          count: result.data?.length || 0
        });
      } catch (error) {
        statuses.push({
          name: 'Geographic Data',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.error('Error checking data sources:', error);
    }

    setDataStatuses(statuses);
    setLastChecked(new Date());
  };

  useEffect(() => {
    checkDataSources();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'loading':
        return <AlertCircle className="h-4 w-4 text-yellow-400 animate-pulse" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Error</Badge>;
      case 'loading':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Loading</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-purple-300">
            <Database className="h-5 w-5" />
            <span>Data Source Status</span>
          </CardTitle>
          <Button onClick={checkDataSources} size="sm" variant="outline">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-xs text-slate-400 mb-4">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
        <div className="space-y-3">
          {dataStatuses.map((source, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
              <div className="flex items-center space-x-3">
                {getStatusIcon(source.status)}
                <div>
                  <div className="font-medium text-white">{source.name}</div>
                  {source.error && (
                    <div className="text-xs text-red-400 mt-1">{source.error}</div>
                  )}
                  {source.count !== undefined && (
                    <div className="text-xs text-slate-400">Records: {source.count}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(source.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugDataStatus;
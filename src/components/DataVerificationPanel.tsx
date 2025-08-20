import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Database, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DataVerificationPanel = () => {
  const [rawData, setRawData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchRawData = async () => {
    setLoading(true);
    try {
      console.log('[DataVerification] Fetching raw data...');
      
      const [dashboardRes, songsRes, likesRes] = await Promise.all([
        supabase.rpc('get_dashboard_stats'),
        supabase.rpc('get_comprehensive_song_statistics'),
        supabase.rpc('get_song_like_statistics')
      ]);

      const data = {
        dashboard: {
          response: dashboardRes,
          hasData: dashboardRes.data?.length > 0,
          data: dashboardRes.data?.[0]
        },
        songs: {
          response: songsRes,
          hasData: songsRes.data?.length > 0,
          count: songsRes.data?.length || 0,
          totalPlays: songsRes.data?.reduce((sum: number, song: any) => sum + (song.total_plays || 0), 0) || 0
        },
        likes: {
          response: likesRes,
          hasData: likesRes.data?.length > 0,
          count: likesRes.data?.length || 0,
          totalLikes: likesRes.data?.reduce((sum: number, song: any) => sum + (song.total_likes || 0), 0) || 0
        }
      };

      console.log('[DataVerification] Raw data fetched:', data);
      setRawData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('[DataVerification] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawData();
  }, []);

  return (
    <Card className="bg-slate-900/50 border-yellow-500/30 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-yellow-500/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-yellow-300">
            <Eye className="h-5 w-5" />
            <span>Raw Data Verification</span>
          </CardTitle>
          <Button onClick={fetchRawData} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Check Data
          </Button>
        </div>
        <div className="text-xs text-slate-400">
          Last checked: {lastUpdated.toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Dashboard Stats */}
        <div className="p-3 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white">Dashboard Stats</span>
            <Badge className={rawData.dashboard?.hasData ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {rawData.dashboard?.hasData ? "Has Data" : "No Data"}
            </Badge>
          </div>
          {rawData.dashboard?.data && (
            <div className="text-xs text-slate-300 space-y-1">
              <div>Total Plays: {rawData.dashboard.data.total_plays}</div>
              <div>Active Sessions: {rawData.dashboard.data.active_sessions}</div>
              <div>Unique Songs: {rawData.dashboard.data.unique_songs}</div>
              <div>Top Region: {rawData.dashboard.data.top_region}</div>
            </div>
          )}
          {rawData.dashboard?.response?.error && (
            <div className="text-xs text-red-400 mt-2">
              Error: {rawData.dashboard.response.error.message}
            </div>
          )}
        </div>

        {/* Song Stats */}
        <div className="p-3 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white">Song Statistics</span>
            <Badge className={rawData.songs?.hasData ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {rawData.songs?.count || 0} songs
            </Badge>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>Total Songs with Data: {rawData.songs?.count || 0}</div>
            <div>Total Plays Across All Songs: {rawData.songs?.totalPlays || 0}</div>
          </div>
          {rawData.songs?.response?.error && (
            <div className="text-xs text-red-400 mt-2">
              Error: {rawData.songs.response.error.message}
            </div>
          )}
        </div>

        {/* Likes Stats */}
        <div className="p-3 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-white">Like Statistics</span>
            <Badge className={rawData.likes?.hasData ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
              {rawData.likes?.count || 0} songs
            </Badge>
          </div>
          <div className="text-xs text-slate-300 space-y-1">
            <div>Songs with Likes: {rawData.likes?.count || 0}</div>
            <div>Total Likes: {rawData.likes?.totalLikes || 0}</div>
          </div>
          {rawData.likes?.response?.error && (
            <div className="text-xs text-red-400 mt-2">
              Error: {rawData.likes.response.error.message}
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="p-3 rounded-lg bg-slate-800/30">
          <div className="text-xs text-slate-400 mb-2">Debug Information:</div>
          <pre className="text-xs text-slate-300 overflow-x-auto max-h-32">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVerificationPanel;
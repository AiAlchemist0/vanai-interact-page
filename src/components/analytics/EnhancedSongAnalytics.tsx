import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { getSongMetadata } from '@/utils/songData';
import { Play, TrendingUp, Clock, SkipForward } from 'lucide-react';

interface ComprehensiveStats {
  song_id: string;
  total_plays: number;
  total_attempts: number;
  avg_duration: number;
  completion_rate: number;
  last_played_at: string;
}

export const EnhancedSongAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<ComprehensiveStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Fetching comprehensive song analytics...');
        const { data, error } = await supabase.rpc('get_comprehensive_song_statistics');
        
        if (error) {
          console.error('Error fetching comprehensive analytics:', error);
          return;
        }
        
        console.log('Comprehensive analytics data:', data);
        setAnalyticsData(data || []);
      } catch (error) {
        console.error('Error in fetchAnalytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Set up real-time subscription
    const channel = supabase
      .channel('song-analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'song_plays'
        },
        () => {
          console.log('Song plays updated, refreshing analytics...');
          fetchAnalytics();
        }
      )
      .subscribe();

    // Refresh every minute
    const interval = setInterval(fetchAnalytics, 60000);
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConversionRate = (validPlays: number, totalAttempts: number) => {
    if (totalAttempts === 0) return 0;
    return Math.round((validPlays / totalAttempts) * 100);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (analyticsData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">No Analytics Data Yet</h3>
        <p className="text-muted-foreground">
          Start playing songs to see detailed analytics including conversion rates and listening patterns.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Note: Valid plays require at least 15 seconds of listening time.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Enhanced Song Analytics</h3>
        <Badge variant="secondary" className="ml-auto">
          {analyticsData.length} Songs Tracked
        </Badge>
      </div>

      <div className="space-y-4">
        {analyticsData.map((song) => {
          const metadata = getSongMetadata(song.song_id);
          const conversionRate = getConversionRate(song.total_plays, Number(song.total_attempts));
          
          return (
            <Card key={song.song_id} className="p-4 bg-gradient-to-r from-background to-muted/30">
              <div className="flex items-start gap-4">
                <img
                  src={metadata.coverArt}
                  alt={metadata.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm">{metadata.title}</h4>
                    <p className="text-xs text-muted-foreground">{metadata.artist}</p>
                  </div>

                  {/* Conversion Rate Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Conversion Rate</span>
                      <span className="font-medium">{conversionRate}%</span>
                    </div>
                    <Progress value={conversionRate} className="h-2" />
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">Valid:</span>
                      <span className="font-medium">{song.total_plays}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">Attempts:</span>
                      <span className="font-medium">{song.total_attempts}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span className="text-muted-foreground">Avg Duration:</span>
                      <span className="font-medium">{formatDuration(song.avg_duration || 0)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <SkipForward className="h-3 w-3 text-purple-500" />
                      <span className="text-muted-foreground">Completion:</span>
                      <span className="font-medium">{Math.round(song.completion_rate || 0)}%</span>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2">
                    {song.total_plays === 0 && song.total_attempts > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        No Valid Plays
                      </Badge>
                    )}
                    {conversionRate >= 80 && (
                      <Badge variant="default" className="text-xs">
                        High Engagement
                      </Badge>
                    )}
                    {song.total_attempts >= 10 && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>

                  {song.last_played_at && (
                    <p className="text-xs text-muted-foreground">
                      Last played: {new Date(song.last_played_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
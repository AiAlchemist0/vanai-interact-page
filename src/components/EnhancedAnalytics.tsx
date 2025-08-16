import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSongStatistics } from '@/hooks/useSongStatistics';
import { BarChart3, Clock, TrendingUp, Users } from 'lucide-react';

const EnhancedAnalytics = () => {
  const { statistics, loading, getTotalPlays } = useSongStatistics();

  if (loading) {
    return (
      <Card className="bg-card/20 backdrop-blur-xl border border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 animate-pulse" />
            Analytics Loading...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const totalPlays = getTotalPlays();
  const topSong = statistics[0];
  const recentlyPlayed = statistics.filter(s => s.last_played_at).length;

  return (
    <Card className="bg-card/20 backdrop-blur-xl border border-border/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Enhanced Analytics
        </CardTitle>
        <CardDescription>
          Real-time song statistics with duration tracking (30+ seconds = valid play)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">Total Plays</div>
              <div className="text-lg font-bold">{totalPlays}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <Users className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">Songs Played</div>
              <div className="text-lg font-bold">{statistics.length}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <Clock className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-sm font-medium">Recent Activity</div>
              <div className="text-lg font-bold">{recentlyPlayed}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-sm font-medium">Top Song</div>
              <div className="text-lg font-bold">{topSong?.total_plays || 0}</div>
            </div>
          </div>
        </div>

        {/* Top Songs */}
        {statistics.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Most Played Songs
            </h4>
            <div className="space-y-2">
              {statistics.slice(0, 5).map((stat, index) => (
                <div 
                  key={stat.song_id}
                  className="flex items-center justify-between p-3 bg-muted/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium text-sm capitalize">
                        {stat.song_id.replace(/-/g, ' ')}
                      </div>
                      {stat.last_played_at && (
                        <div className="text-xs text-muted-foreground">
                          Last played: {new Date(stat.last_played_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      {stat.total_plays} plays
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalPlays === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No plays recorded yet. Start listening to see analytics!</p>
            <p className="text-xs mt-1">Only plays of 30+ seconds are counted as valid</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalytics;
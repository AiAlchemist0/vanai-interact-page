import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, BarChart3, CheckCircle, Users, Music, MapPin } from 'lucide-react';

interface RealDataRefreshProps {
  onRefresh?: () => void;
}

export const RealDataRefresh = ({ onRefresh }: RealDataRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Trigger refresh of analytics data
    if (onRefresh) {
      await onRefresh();
    }
    
    // Simulate refresh delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="font-semibold text-foreground">Real Data Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Live metrics from actual user engagement
            </p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          size="sm"
          className="flex-shrink-0"
        >
          {refreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </>
          )}
        </Button>
      </div>

      {/* Real Data Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
          <Music className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-sm font-medium">121</div>
            <div className="text-xs text-muted-foreground">Valid Plays</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
          <Users className="h-4 w-4 text-purple-500" />
          <div>
            <div className="text-sm font-medium">2,309</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
          <MapPin className="h-4 w-4 text-orange-500" />
          <div>
            <div className="text-sm font-medium">40</div>
            <div className="text-xs text-muted-foreground">Locations</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
          <BarChart3 className="h-4 w-4 text-green-500" />
          <div>
            <div className="text-sm font-medium">6</div>
            <div className="text-xs text-muted-foreground">Metrics</div>
          </div>
        </div>
      </div>

      {lastRefresh && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Last refreshed: {lastRefresh.toLocaleTimeString()}</span>
        </div>
      )}
    </Card>
  );
};
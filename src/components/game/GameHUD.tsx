import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, MapPin, Lightbulb } from 'lucide-react';
import type { Character } from '@/types/game';

interface GameHUDProps {
  character: Character;
  progress: {
    totalDistricts: number;
    unlockedDistricts: number;
    totalInsights: number;
    discoveredInsights: number;
  };
}

const GameHUD = ({ character, progress }: GameHUDProps) => {
  const districtProgress = (progress.unlockedDistricts / progress.totalDistricts) * 100;
  const insightProgress = (progress.discoveredInsights / progress.totalInsights) * 100;
  const overallProgress = (districtProgress + insightProgress) / 2;

  const getProgressLevel = () => {
    if (overallProgress >= 80) return { level: 'Expert Explorer', color: '#10B981' };
    if (overallProgress >= 60) return { level: 'Advanced Navigator', color: '#3B82F6' };
    if (overallProgress >= 40) return { level: 'Experienced Traveler', color: '#F59E0B' };
    if (overallProgress >= 20) return { level: 'Curious Wanderer', color: '#8B5CF6' };
    return { level: 'New Explorer', color: '#6B7280' };
  };

  const currentLevel = getProgressLevel();

  return (
    <div className="absolute top-4 right-4 z-10 w-80">
      <Card className="border-gradient bg-card/95 backdrop-blur-md">
        <CardContent className="p-4 space-y-4">
          {/* Character Info */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">{character.avatar}</div>
            <div className="flex-1">
              <div className="font-semibold">{character.name}</div>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: character.color, color: character.color }}
              >
                {character.title}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Level</div>
              <Badge style={{ backgroundColor: currentLevel.color + '20', color: currentLevel.color }}>
                {currentLevel.level}
              </Badge>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* District Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Districts Explored</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {progress.unlockedDistricts}/{progress.totalDistricts}
              </span>
            </div>
            <Progress value={districtProgress} className="h-2" />
          </div>

          {/* Insights Progress */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Insights Discovered</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {progress.discoveredInsights}/{progress.totalInsights}
              </span>
            </div>
            <Progress value={insightProgress} className="h-2" />
          </div>

          {/* Next Milestone */}
          {overallProgress < 100 && (
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="text-xs font-medium text-muted-foreground mb-1">Next Milestone:</div>
              <div className="text-sm">
                {progress.discoveredInsights < 2 && "Discover 2 insights to unlock Business District"}
                {progress.discoveredInsights >= 2 && progress.discoveredInsights < 4 && "Explore more districts for new insights"}
                {progress.discoveredInsights >= 4 && overallProgress < 100 && "Complete all districts to become an Expert Explorer"}
              </div>
            </div>
          )}

          {/* Controls Hint */}
          <div className="border-t pt-3 text-xs text-muted-foreground text-center space-y-1">
            <div>🎮 WASD/Arrow Keys: Move</div>
            <div>⭐ Space: Interact with buildings</div>
            <div>🗺️ Mini-map: Top right corner</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHUD;
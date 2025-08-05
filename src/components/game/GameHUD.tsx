import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <div className="absolute top-4 right-4 z-10 w-80">
      <Card className="border-gradient bg-card/90 backdrop-blur-md">
        <CardContent className="p-4">
          {/* Character Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">{character.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{character.name}</div>
              <Badge variant="outline" className="text-xs">
                {character.title}
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Districts Explored</span>
                <span>{progress.unlockedDistricts}/{progress.totalDistricts}</span>
              </div>
              <Progress value={districtProgress} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Insights Discovered</span>
                <span>{progress.discoveredInsights}/{progress.totalInsights}</span>
              </div>
              <Progress value={insightProgress} className="h-2" />
            </div>
          </div>

          {/* Controls Hint */}
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Use WASD or Arrow Keys to move • Click to interact
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameHUD;
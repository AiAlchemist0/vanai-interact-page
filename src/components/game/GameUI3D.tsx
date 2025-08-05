import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { GameState } from '@/types/game';

interface GameUI3DProps {
  gameState: GameState;
}

const GameUI3D = ({ gameState }: GameUI3DProps) => {
  const progressPercentage = (gameState.discoveredInsights.length / 24) * 100;
  const unlockedPercentage = (gameState.unlockedDistricts.length / 6) * 100;

  return (
    <div className="absolute top-4 right-4 z-10 space-y-4">
      {/* Character Info */}
      <Card className="p-4 bg-background/90 backdrop-blur-sm border-gradient">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{gameState.selectedCharacter?.avatar}</div>
          <div>
            <h3 className="font-semibold text-sm">{gameState.selectedCharacter?.name}</h3>
            <p className="text-xs text-muted-foreground">{gameState.selectedCharacter?.title}</p>
          </div>
        </div>
      </Card>

      {/* Progress Info */}
      <Card className="p-4 bg-background/90 backdrop-blur-sm border-gradient">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Districts Unlocked</span>
              <span>{gameState.unlockedDistricts.length}/6</span>
            </div>
            <Progress value={unlockedPercentage} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Insights Discovered</span>
              <span>{gameState.discoveredInsights.length}/24</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Controls Info */}
      <Card className="p-4 bg-background/90 backdrop-blur-sm border-gradient">
        <h4 className="font-semibold text-sm mb-2">3D Controls</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Move:</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">WASD</Badge>
          </div>
          <div className="flex justify-between">
            <span>Interact:</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">SPACE</Badge>
          </div>
          <div className="flex justify-between">
            <span>Camera:</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">Mouse</Badge>
          </div>
          <div className="flex justify-between">
            <span>Zoom:</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">Scroll</Badge>
          </div>
        </div>
      </Card>

      {/* Mini Map */}
      <Card className="p-3 bg-background/90 backdrop-blur-sm border-gradient">
        <h4 className="font-semibold text-xs mb-2">District Map</h4>
        <div className="grid grid-cols-3 gap-1">
          {['tech-hub', 'business-quarter', 'medical-campus', 'creative-district', 'government-center', 'education-zone'].map((districtId) => {
            const isUnlocked = gameState.unlockedDistricts.includes(districtId);
            return (
              <div
                key={districtId}
                className={`w-4 h-4 rounded-sm ${
                  isUnlocked 
                    ? 'bg-primary' 
                    : 'bg-muted border border-muted-foreground'
                }`}
                title={districtId.replace('-', ' ')}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default GameUI3D;
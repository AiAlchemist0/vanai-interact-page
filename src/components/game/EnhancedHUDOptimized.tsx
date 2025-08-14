import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GameState } from "@/pages/Game";
import { 
  Play, 
  Pause, 
  Target,
  Volume2,
  VolumeX
} from "lucide-react";

interface EnhancedHUDOptimizedProps {
  score: number;
  combo: number;
  accuracy: number;
  currentTime: number;
  songDuration: number;
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
}

// Memoized components to prevent flickering
const ScoreDisplay = React.memo(({ score }: { score: number }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-primary">
      {score.toLocaleString()}
    </div>
    <div className="text-xs text-muted-foreground">Score</div>
  </div>
));

const ComboDisplay = React.memo(({ combo }: { combo: number }) => (
  <div className="text-center">
    <div className="text-xl font-semibold text-accent">
      {combo}x
    </div>
    <div className="text-xs text-muted-foreground">Combo</div>
  </div>
));

const AccuracyDisplay = React.memo(({ accuracy }: { accuracy: number }) => (
  <div className="text-center">
    <div className="text-lg font-medium">
      {accuracy}%
    </div>
    <div className="text-xs text-muted-foreground">Accuracy</div>
  </div>
));

const TimeProgress = React.memo(({ currentTime, songDuration }: { currentTime: number; songDuration: number }) => {
  const progress = (currentTime / songDuration) * 100;
  
  return (
    <Card className="flex-1 bg-card/80 backdrop-blur-sm border-border/20 p-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{Math.floor(currentTime / 1000)}s</span>
          <span>{Math.floor(songDuration / 1000)}s</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </Card>
  );
});

const EnhancedHUDOptimized = React.memo(({ 
  score, 
  combo, 
  accuracy, 
  currentTime, 
  songDuration, 
  gameState, 
  onGameStateChange
}: EnhancedHUDOptimizedProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 space-y-3">
      {/* Top Stats Bar - No transparency to reduce render cost */}
      <Card className="bg-card border-border p-3">
        <div className="flex items-center justify-between">
          {/* Score Section */}
          <div className="flex items-center gap-4">
            <ScoreDisplay score={score} />
            <div className="h-8 w-px bg-border/50" />
            <ComboDisplay combo={combo} />
            <div className="h-8 w-px bg-border/50" />
            <AccuracyDisplay accuracy={accuracy} />
          </div>

          {/* Simple Control Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGameStateChange(gameState === 'playing' ? 'paused' : 'playing')}
            >
              {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <TimeProgress currentTime={currentTime} songDuration={songDuration} />
    </div>
  );
});

EnhancedHUDOptimized.displayName = "EnhancedHUDOptimized";

export default EnhancedHUDOptimized;
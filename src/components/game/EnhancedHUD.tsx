import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GameState } from "@/pages/Game";
import { useEnhancedFeedback } from "@/hooks/useEnhancedFeedback";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Clock,
  Award,
  BarChart3,
  Smartphone,
  Volume2,
  VolumeX
} from "lucide-react";

interface EnhancedHUDProps {
  score: number;
  combo: number;
  accuracy: number;
  currentTime: number;
  songDuration: number;
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
  hitPrediction?: {
    canHit: boolean;
    grade: string | null;
    confidence: number;
  };
}

const EnhancedHUD = ({ 
  score, 
  combo, 
  accuracy, 
  currentTime, 
  songDuration, 
  gameState, 
  onGameStateChange,
  hitPrediction 
}: EnhancedHUDProps) => {
  const { 
    practiceMode, 
    metronome, 
    stats, 
    togglePracticeMode, 
    toggleMetronome, 
    resetSession,
    getSuggestions 
  } = useEnhancedFeedback();
  
  const { 
    settings: mobileSettings, 
    touchMetrics, 
    getUIScale,
    triggerHapticFeedback 
  } = useMobileOptimization();

  const uiScale = getUIScale();
  const suggestions = getSuggestions();
  const progress = (currentTime / songDuration) * 100;

  const handlePracticeToggle = () => {
    triggerHapticFeedback('light');
    togglePracticeMode();
  };

  const handleMetronomeToggle = () => {
    triggerHapticFeedback('medium');
    toggleMetronome();
  };

  return (
    <div 
      className="absolute top-0 left-0 right-0 z-10 p-4 space-y-3"
      style={{ transform: `scale(${uiScale})`, transformOrigin: 'top left' }}
    >
      {/* Top Stats Bar */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 p-3">
        <div className="flex items-center justify-between">
          {/* Score Section */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {score.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            
            <div className="h-8 w-px bg-border/50" />
            
            <div className="text-center">
              <div className="text-xl font-semibold text-accent">
                {combo}x
              </div>
              <div className="text-xs text-muted-foreground">Combo</div>
            </div>
            
            <div className="h-8 w-px bg-border/50" />
            
            <div className="text-center">
              <div className="text-lg font-medium">
                {accuracy}%
              </div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePracticeToggle}
              className={practiceMode.enabled ? "bg-accent/20" : ""}
            >
              <Target className="w-4 h-4 mr-1" />
              Practice
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleMetronomeToggle}
              className={metronome.enabled ? "bg-accent/20" : ""}
            >
              {metronome.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
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

      {/* Progress and Metronome */}
      <div className="flex gap-3">
        <Card className="flex-1 bg-card/80 backdrop-blur-sm border-border/20 p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{Math.floor(currentTime / 1000)}s</span>
              {practiceMode.enabled && (
                <Badge variant="outline" className="text-xs">
                  {(practiceMode.speed * 100).toFixed(0)}% Speed
                </Badge>
              )}
              <span>{Math.floor(songDuration / 1000)}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>

        {metronome.enabled && (
          <Card className="bg-card/80 backdrop-blur-sm border-border/20 p-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <div className="text-sm font-medium">{metronome.bpm} BPM</div>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((beat) => (
                  <div
                    key={beat}
                    className={`w-2 h-2 rounded-full ${
                      beat === metronome.beat 
                        ? 'bg-accent animate-pulse' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Hit Prediction */}
      {hitPrediction && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 p-2">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${hitPrediction.canHit ? 'text-green-400' : 'text-yellow-400'}`} />
            <span className="text-sm font-medium">
              {hitPrediction.canHit 
                ? `Ready: ${hitPrediction.grade?.toUpperCase()}` 
                : 'Position frets'
              }
            </span>
            <div className="ml-auto">
              <div className="text-xs text-muted-foreground">
                {Math.round(hitPrediction.confidence * 100)}% confidence
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Performance Stats */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/20 p-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold">{stats.streakBest}</span>
            </div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="font-semibold">{stats.streakCurrent}</span>
            </div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              {stats.improvementRate > 0 ? 
                <TrendingUp className="w-4 h-4 text-green-400" /> : 
                <TrendingDown className="w-4 h-4 text-red-400" />
              }
              <span className="font-semibold">
                {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Trend</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="font-semibold">{stats.averageAccuracy.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">Avg Accuracy</div>
          </div>
        </div>
      </Card>

      {/* Mobile Optimization Indicator */}
      {mobileSettings.hapticFeedback && (
        <Card className="bg-card/80 backdrop-blur-sm border-border/20 p-2">
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="w-4 h-4 text-green-400" />
            <span>Mobile Optimized</span>
            <Badge variant="outline" className="text-xs">
              {touchMetrics.averageResponseTime.toFixed(0)}ms response
            </Badge>
          </div>
        </Card>
      )}

      {/* Performance Suggestions */}
      {suggestions.length > 0 && gameState === 'paused' && (
        <Card className="bg-amber-500/10 border-amber-500/30 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-amber-400">Performance Tips</span>
            </div>
            {suggestions.slice(0, 2).map((suggestion, index) => (
              <div key={index} className="text-sm text-amber-200">
                • {suggestion}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedHUD;
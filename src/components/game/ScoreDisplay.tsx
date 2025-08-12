import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Trophy } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  combo: number;
  accuracy: number;
}

const ScoreDisplay = ({ score, combo, accuracy }: ScoreDisplayProps) => {
  const getComboColor = (combo: number) => {
    if (combo >= 50) return "text-ai-purple";
    if (combo >= 30) return "text-ai-orange";
    if (combo >= 15) return "text-ai-cyan";
    if (combo >= 5) return "text-ai-green";
    return "text-muted-foreground";
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return "text-ai-green";
    if (accuracy >= 80) return "text-ai-cyan";
    if (accuracy >= 60) return "text-ai-orange";
    return "text-destructive";
  };

  return (
    <div className="flex items-center gap-4">
      {/* Score */}
      <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/20">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-ai-orange" />
          <div>
            <div className="text-lg font-bold">{score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </Card>

      {/* Combo */}
      <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/20">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-ai-cyan" />
          <div>
            <div className={`text-lg font-bold ${getComboColor(combo)}`}>
              {combo}x
            </div>
            <div className="text-xs text-muted-foreground">Combo</div>
          </div>
        </div>
      </Card>

      {/* Accuracy */}
      <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm border-border/20">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-ai-green" />
          <div>
            <div className={`text-lg font-bold ${getAccuracyColor(accuracy)}`}>
              {accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ScoreDisplay;
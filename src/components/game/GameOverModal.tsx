import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, RotateCcw, Home, Star } from "lucide-react";
import { Song, Difficulty } from "@/pages/Game";

interface GameOverModalProps {
  score: number;
  accuracy: number;
  song: Song;
  difficulty: Difficulty;
  onReturnToMenu: () => void;
  onPlayAgain: () => void;
}

const GameOverModal = ({
  score,
  accuracy,
  song,
  difficulty,
  onReturnToMenu,
  onPlayAgain
}: GameOverModalProps) => {
  const getStarRating = (accuracy: number) => {
    if (accuracy >= 95) return 5;
    if (accuracy >= 85) return 4;
    if (accuracy >= 70) return 3;
    if (accuracy >= 50) return 2;
    return 1;
  };

  const getGrade = (accuracy: number) => {
    if (accuracy >= 95) return { grade: "S", color: "text-ai-purple" };
    if (accuracy >= 90) return { grade: "A+", color: "text-ai-green" };
    if (accuracy >= 85) return { grade: "A", color: "text-ai-cyan" };
    if (accuracy >= 80) return { grade: "B+", color: "text-ai-blue" };
    if (accuracy >= 70) return { grade: "B", color: "text-ai-orange" };
    if (accuracy >= 60) return { grade: "C", color: "text-destructive" };
    return { grade: "D", color: "text-muted-foreground" };
  };

  const stars = getStarRating(accuracy);
  const { grade, color } = getGrade(accuracy);

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 border-gradient glow-primary">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`text-8xl font-bold ${color}`}>
              {grade}
            </div>
          </div>
          
          <CardTitle className="text-2xl text-gradient">Song Complete!</CardTitle>
          
          {/* Star Rating */}
          <div className="flex justify-center gap-1 my-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= stars 
                    ? "text-ai-orange fill-ai-orange" 
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Song Info */}
          <div className="text-center border-b border-border/20 pb-4">
            <h3 className="font-bold text-lg">{song.title}</h3>
            <p className="text-muted-foreground">{song.artist}</p>
            <Badge variant="secondary" className="mt-2 capitalize">
              {difficulty}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {score.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Final Score</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold ${color}`}>
                {accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="text-center">
            {accuracy >= 95 && (
              <p className="text-ai-purple font-semibold">Perfect! You're a rockstar! 🎸</p>
            )}
            {accuracy >= 85 && accuracy < 95 && (
              <p className="text-ai-green font-semibold">Excellent performance! 🔥</p>
            )}
            {accuracy >= 70 && accuracy < 85 && (
              <p className="text-ai-cyan font-semibold">Great job! Keep practicing! 🎵</p>
            )}
            {accuracy >= 50 && accuracy < 70 && (
              <p className="text-ai-orange font-semibold">Good effort! Try again! 🎶</p>
            )}
            {accuracy < 50 && (
              <p className="text-muted-foreground">Keep practicing - you'll get there! 🎤</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onReturnToMenu}
              className="flex-1 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Menu
            </Button>
            
            <Button
              onClick={onPlayAgain}
              className="flex-1 gradient-primary hover:glow-primary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverModal;
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Target, Zap, Trophy } from 'lucide-react';

interface MiniGameProps {
  gameType: 'ai-training' | 'policy-puzzle' | 'creativity-challenge';
  onComplete: (score: number) => void;
  onClose: () => void;
}

const MiniGame = ({ gameType, onComplete, onClose }: MiniGameProps) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const games = {
    'ai-training': {
      title: 'AI Training Simulator',
      description: 'Train an AI model by selecting the best data points',
      icon: '🤖',
      questions: [
        { prompt: 'Which data improves AI accuracy?', options: ['Clean Data', 'Biased Data', 'Random Data'], correct: 0 },
        { prompt: 'Best practice for AI training?', options: ['More Data', 'Diverse Data', 'Fast Training'], correct: 1 },
        { prompt: 'AI bias prevention requires:', options: ['Speed', 'Transparency', 'Complexity'], correct: 1 }
      ]
    },
    'policy-puzzle': {
      title: 'Policy Puzzle',
      description: 'Balance stakeholder needs in AI governance',
      icon: '⚖️',
      questions: [
        { prompt: 'AI regulation priority?', options: ['Innovation', 'Safety', 'Balance'], correct: 2 },
        { prompt: 'Data privacy vs. Progress?', options: ['Privacy First', 'Progress First', 'Find Balance'], correct: 2 },
        { prompt: 'Public AI deployment needs:', options: ['Speed', 'Testing', 'Approval'], correct: 1 }
      ]
    },
    'creativity-challenge': {
      title: 'Creativity Challenge',
      description: 'Help AI enhance human creativity',
      icon: '🎨',
      questions: [
        { prompt: 'AI in art should:', options: ['Replace Artists', 'Assist Artists', 'Copy Styles'], correct: 1 },
        { prompt: 'Creative AI ethics:', options: ['No Rules', 'Attribution', 'Bans'], correct: 1 },
        { prompt: 'AI creativity value:', options: ['Speed', 'Inspiration', 'Copying'], correct: 1 }
      ]
    }
  };

  const currentGame = games[gameType];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      completeGame();
    }
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setScore(0);
    setCurrentQuestion(0);
  };

  const answerQuestion = (answerIndex: number) => {
    const isCorrect = answerIndex === currentGame.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < currentGame.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    setGameState('completed');
    const finalScore = Math.round((score / currentGame.questions.length) * 100);
    setTimeout(() => onComplete(finalScore), 1500);
  };

  if (gameState === 'intro') {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="border-gradient max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <div className="text-6xl mb-4">{currentGame.icon}</div>
              {currentGame.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">{currentGame.description}</p>
            
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="text-sm">30 seconds</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">{currentGame.questions.length} questions</span>
              </div>
            </div>
            
            <Button 
              onClick={startGame} 
              className="gradient-primary w-full"
              size="lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (gameState === 'playing') {
    const question = currentGame.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / currentGame.questions.length) * 100;

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="border-gradient max-w-lg">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-lg">{currentGame.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-4 h-4" />
                <span className={`font-mono ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Question {currentQuestion + 1} of {currentGame.questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Card className="border-gradient">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {question.prompt}
                </h3>
                
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto p-4 hover:border-primary"
                      onClick={() => answerQuestion(index)}
                    >
                      <span className="mr-3 font-bold text-primary">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Completed state
  const finalScore = Math.round((score / currentGame.questions.length) * 100);
  const getPerformanceLevel = () => {
    if (finalScore >= 80) return { level: 'Expert', color: '#10B981', message: 'Outstanding performance!' };
    if (finalScore >= 60) return { level: 'Proficient', color: '#3B82F6', message: 'Great job!' };
    if (finalScore >= 40) return { level: 'Learning', color: '#F59E0B', message: 'Keep practicing!' };
    return { level: 'Beginner', color: '#EF4444', message: 'Good start!' };
  };

  const performance = getPerformanceLevel();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="border-gradient max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            Challenge Complete!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-gradient">{finalScore}%</div>
            <div 
              className="text-lg font-semibold"
              style={{ color: performance.color }}
            >
              {performance.level}
            </div>
            <p className="text-muted-foreground">{performance.message}</p>
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Correct Answers</div>
                <div className="text-lg">{score}/{currentGame.questions.length}</div>
              </div>
              <div>
                <div className="font-semibold">Time Bonus</div>
                <div className="text-lg">{Math.max(0, timeLeft)} pts</div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={onClose} 
            className="gradient-primary w-full"
            size="lg"
          >
            Claim Reward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MiniGame;
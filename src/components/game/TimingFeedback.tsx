import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimingFeedback {
  id: string;
  grade: 'perfect' | 'good' | 'okay' | 'miss' | 'early' | 'late';
  timingDiff: number;
  timestamp: number;
}

interface TimingFeedbackProps {
  lastHit?: {
    grade: 'perfect' | 'good' | 'okay' | 'miss';
    timingDiff: number;
  };
}

const TimingFeedback = ({ lastHit }: TimingFeedbackProps) => {
  const [feedback, setFeedback] = useState<TimingFeedback | null>(null);

  useEffect(() => {
    if (lastHit) {
      let grade: 'perfect' | 'good' | 'okay' | 'miss' | 'early' | 'late' = lastHit.grade;
      
      // Add early/late feedback for learning
      if (lastHit.grade !== 'miss' && lastHit.timingDiff !== 0) {
        if (lastHit.timingDiff < -50) grade = 'early';
        else if (lastHit.timingDiff > 50) grade = 'late';
      }

      const newFeedback: TimingFeedback = {
        id: Math.random().toString(36),
        grade,
        timingDiff: lastHit.timingDiff,
        timestamp: Date.now()
      };

      setFeedback(newFeedback);

      // Clear feedback after delay
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  }, [lastHit]);

  if (!feedback) return null;

  const getGradeConfig = (grade: string) => {
    switch (grade) {
      case 'perfect':
        return { text: 'PERFECT!', color: 'bg-green-500', icon: '★' };
      case 'good':
        return { text: 'GOOD', color: 'bg-blue-500', icon: '♪' };
      case 'okay':
        return { text: 'OKAY', color: 'bg-yellow-500', icon: '♫' };
      case 'early':
        return { text: 'TOO EARLY', color: 'bg-orange-500', icon: '←' };
      case 'late':
        return { text: 'TOO LATE', color: 'bg-orange-500', icon: '→' };
      case 'miss':
        return { text: 'MISS', color: 'bg-red-500', icon: '✗' };
      default:
        return { text: 'HIT', color: 'bg-gray-500', icon: '♪' };
    }
  };

  const config = getGradeConfig(feedback.grade);

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
      <Card className="p-4 border-primary/20 animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white font-bold`}>
            {config.icon}
          </div>
          <div>
            <div className="font-bold text-lg">{config.text}</div>
            {feedback.timingDiff !== 0 && feedback.grade !== 'miss' && (
              <div className="text-sm text-muted-foreground">
                {feedback.timingDiff > 0 ? '+' : ''}{feedback.timingDiff.toFixed(0)}ms
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimingFeedback;
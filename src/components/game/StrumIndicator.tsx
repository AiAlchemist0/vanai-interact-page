import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StrumIndicatorProps {
  pressedFrets: Set<number>;
  lastStrum: number;
}

const StrumIndicator = ({ pressedFrets, lastStrum }: StrumIndicatorProps) => {
  const [showStrumPrompt, setShowStrumPrompt] = useState(false);

  useEffect(() => {
    // Show strum prompt when frets are pressed but no recent strum
    if (pressedFrets.size > 0) {
      const timeSinceStrum = Date.now() - lastStrum;
      if (timeSinceStrum > 1000) { // 1 second without strum
        setShowStrumPrompt(true);
      }
    } else {
      setShowStrumPrompt(false);
    }
  }, [pressedFrets, lastStrum]);

  if (!showStrumPrompt) return null;

  return (
    <div className="absolute left-4 bottom-24 z-40 pointer-events-none">
      <Card className="p-4 bg-yellow-500/95 border-yellow-300 animate-pulse max-w-48">
        <div className="text-center text-black font-bold">
          <div className="text-xl mb-1">🎸</div>
          <div className="text-lg">PRESS SPACE!</div>
          <div className="text-xs">to strum</div>
        </div>
      </Card>
    </div>
  );
};

export default StrumIndicator;
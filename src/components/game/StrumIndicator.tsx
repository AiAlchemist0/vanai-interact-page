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
    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
      <Card className="p-6 bg-yellow-500/90 border-yellow-300 animate-pulse">
        <div className="text-center text-black font-bold">
          <div className="text-2xl mb-2">🎸</div>
          <div className="text-xl">NOW PRESS SPACE!</div>
          <div className="text-sm">to strum the guitar</div>
        </div>
      </Card>
    </div>
  );
};

export default StrumIndicator;
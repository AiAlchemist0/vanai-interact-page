import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Bug } from 'lucide-react';

interface GameDebugPanelProps {
  currentTime: number;
  activeNotes: any[];
  pressedFrets: Set<number>;
  hitStats: {
    totalNotesHit: number;
    perfectHits: number;
    goodHits: number;
    okayHits: number;
    missedNotes: number;
    accuracy: number;
  };
  inputMethod: 'keyboard' | 'touch' | 'none';
  contextLost: boolean;
  contextRecovered: boolean;
  onForceRecovery: () => void;
}

export const GameDebugPanel = ({
  currentTime,
  activeNotes,
  pressedFrets,
  hitStats,
  inputMethod,
  contextLost,
  contextRecovered,
  onForceRecovery
}: GameDebugPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-black/50 text-white hover:bg-black/70"
        >
          <Bug className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-50 max-w-sm">
      <Card className="p-3 bg-black/80 text-white border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Debug Panel
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            <EyeOff className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-2 text-xs">
          {/* Timing Info */}
          <div>
            <div className="font-medium">Time: {Math.floor(currentTime / 1000)}s</div>
            <div>Active Notes: {activeNotes.length}</div>
          </div>

          {/* Input Status */}
          <div>
            <div className="flex items-center gap-2">
              <span>Input:</span>
              <Badge variant={inputMethod === 'none' ? 'destructive' : 'default'}>
                {inputMethod}
              </Badge>
            </div>
            <div>Pressed Frets: [{Array.from(pressedFrets).join(', ')}]</div>
          </div>

          {/* Hit Statistics */}
          <div className="border-t border-gray-600 pt-2">
            <div className="font-medium">Hit Stats:</div>
            <div className="grid grid-cols-2 gap-1">
              <div>Perfect: {hitStats.perfectHits}</div>
              <div>Good: {hitStats.goodHits}</div>
              <div>Okay: {hitStats.okayHits}</div>
              <div>Miss: {hitStats.missedNotes}</div>
            </div>
            <div className="mt-1">
              <div>Accuracy: {hitStats.accuracy}%</div>
              <Progress value={hitStats.accuracy} className="h-1 mt-1" />
            </div>
          </div>

          {/* WebGL Status */}
          <div className="border-t border-gray-600 pt-2">
            <div className="flex items-center gap-2">
              <span>WebGL:</span>
              <Badge variant={contextLost ? 'destructive' : 'default'}>
                {contextLost ? 'LOST' : contextRecovered ? 'RECOVERED' : 'OK'}
              </Badge>
            </div>
            {contextLost && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onForceRecovery}
                className="mt-1 text-xs h-6"
              >
                Force Recovery
              </Button>
            )}
          </div>

          {/* Active Notes Details */}
          {activeNotes.length > 0 && (
            <div className="border-t border-gray-600 pt-2">
              <div className="font-medium">Next Notes:</div>
              {activeNotes.slice(0, 3).map((note, i) => (
                <div key={i} className="text-xs">
                  {note.time}ms: [{note.frets.join(',')}] ({note.type})
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
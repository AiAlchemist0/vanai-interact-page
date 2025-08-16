import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FretVisualizerProps {
  pressedFrets: Set<number>;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

const FretVisualizer = ({ pressedFrets, inputMethod }: FretVisualizerProps) => {
  const fretColors = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316'];
  const fretNames = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];
  const keyboardKeys = ['A', 'S', 'D', 'F', 'G'];

  return (
    <div className="absolute top-4 left-4 z-30">
      <Card className="p-3 bg-card/80 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {inputMethod === 'keyboard' ? 'Keyboard' : inputMethod === 'touch' ? 'Touch' : 'No Input'}
          </Badge>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((fret) => {
            const isPressed = pressedFrets.has(fret);
            return (
              <div
                key={fret}
                className={`
                  w-8 h-8 rounded-lg border-2 flex items-center justify-center text-xs font-bold
                  transition-all duration-100
                  ${isPressed 
                    ? 'border-white shadow-lg scale-110' 
                    : 'border-muted-foreground/30'
                  }
                `}
                style={{
                  backgroundColor: isPressed ? fretColors[fret] : 'transparent',
                  color: isPressed ? 'white' : fretColors[fret]
                }}
              >
                {inputMethod === 'keyboard' ? keyboardKeys[fret] : fret + 1}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Press frets + SPACE to strum
        </div>
      </Card>
    </div>
  );
};

export default FretVisualizer;
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
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <Card className="p-3 bg-card/90 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {inputMethod === 'keyboard' ? 'Keyboard' : inputMethod === 'touch' ? 'Touch' : 'No Input'}
          </Badge>
        </div>
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4].map((fret) => {
            const isPressed = pressedFrets.has(fret);
            return (
              <div
                key={fret}
                className={`
                  w-12 h-12 rounded-full border-3 flex items-center justify-center text-sm font-bold
                  transition-all duration-100
                  ${isPressed 
                    ? 'border-white shadow-lg scale-110 animate-pulse' 
                    : 'border-muted-foreground/50'
                  }
                `}
                style={{
                  backgroundColor: isPressed ? fretColors[fret] : 'transparent',
                  color: isPressed ? 'white' : fretColors[fret],
                  boxShadow: isPressed ? `0 0 20px ${fretColors[fret]}` : 'none'
                }}
              >
                {inputMethod === 'keyboard' ? keyboardKeys[fret] : fret + 1}
              </div>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground mt-2 font-bold text-center">
          Hold frets ↑ then press SPACE to strum!
        </div>
      </Card>
    </div>
  );
};

export default FretVisualizer;
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface FretVisualizerProps {
  pressedFrets: Set<number>;
  inputMethod: 'keyboard' | 'touch' | 'none';
}
const FretVisualizer = ({
  pressedFrets,
  inputMethod
}: FretVisualizerProps) => {
  const fretColors = ['#22c55e', '#ef4444', '#eab308', '#3b82f6', '#f97316'];
  const fretNames = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];
  const keyboardKeys = ['A', 'S', 'D', 'F', 'G'];
  return (
    <Card className="p-4 bg-background/80 backdrop-blur-sm border-border/50">
      <div className="flex gap-2 items-center">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          Frets ({inputMethod}):
        </div>
        <div className="flex gap-1">
          {fretColors.map((color, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                pressedFrets.has(index)
                  ? 'scale-110 shadow-lg'
                  : 'scale-100 opacity-60'
              }`}
              style={{
                backgroundColor: pressedFrets.has(index) ? color : 'transparent',
                borderColor: color,
                color: pressedFrets.has(index) ? '#000' : color
              }}
            >
              {inputMethod === 'keyboard' ? keyboardKeys[index] : index + 1}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
export default FretVisualizer;
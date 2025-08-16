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
  return;
};
export default FretVisualizer;
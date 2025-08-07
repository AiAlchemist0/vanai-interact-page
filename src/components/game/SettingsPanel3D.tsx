import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SettingsPanel3DProps {
  isRaining: boolean;
  onToggleRaining: () => void;
  cycleSpeed: number;
  onChangeCycleSpeed: (v: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  className?: string;
}

const SettingsPanel3D = ({
  isRaining,
  onToggleRaining,
  cycleSpeed,
  onChangeCycleSpeed,
  showGrid,
  onToggleGrid,
  className
}: SettingsPanel3DProps) => {
  return (
    <Card className={cn('w-72 p-4 bg-background/80 backdrop-blur border shadow-sm text-foreground', className)}>
      <h2 className="text-sm font-medium mb-3">World Settings</h2>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="rain-toggle" className="text-sm">Rain</Label>
        <Switch id="rain-toggle" checked={isRaining} onCheckedChange={onToggleRaining} />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label htmlFor="grid-toggle" className="text-sm">Grid</Label>
        <Switch id="grid-toggle" checked={showGrid} onCheckedChange={onToggleGrid} />
      </div>

      <div className="py-2">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm">Day/Night Speed</Label>
          <span className="text-xs opacity-70">{cycleSpeed.toFixed(2)}x</span>
        </div>
        <Slider
          value={[cycleSpeed]}
          min={0}
          max={2}
          step={0.01}
          onValueChange={(v) => onChangeCycleSpeed(v[0] ?? 1)}
        />
      </div>
    </Card>
  );
};

export default SettingsPanel3D;

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PauseMenu3DProps {
  paused: boolean;
  onResume: () => void;
  onExit?: () => void;
  onReset?: () => void;
}

const PauseMenu3D = ({ paused, onResume, onExit, onReset }: PauseMenu3DProps) => {
  if (!paused) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <Card className="relative z-10 w-[min(92vw,560px)] p-6 text-foreground bg-background/95 border shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Paused</h2>
          <div className="flex gap-2">
            {onExit && (
              <Button size="sm" variant="outline" onClick={onExit}>
                Exit
              </Button>
            )}
            <Button size="sm" onClick={onResume}>
              Resume
            </Button>
          </div>
        </div>
        <Separator className="my-4" />

        <div className="space-y-4 text-sm">
          <p className="opacity-80">Controls</p>
          <ul className="grid grid-cols-2 gap-2">
            <li><span className="opacity-70">Move</span> — WASD / Arrow Keys</li>
            <li><span className="opacity-70">Jump</span> — Space</li>
            <li><span className="opacity-70">Interact</span> — Space near building</li>
            <li><span className="opacity-70">Pause</span> — Esc</li>
          </ul>
          <p className="opacity-80">Tip</p>
          <p className="opacity-70">Visit all buildings in a district to unlock the next area. Use the World Settings (top right) to adjust weather and time.</p>
        </div>

        <div className="mt-6 flex justify-between">
          {onReset && (
            <Button variant="destructive" onClick={onReset}>
              Reset Progress
            </Button>
          )}
          <div className="ml-auto">
            <Button onClick={onResume}>
              Back to Game
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PauseMenu3D;

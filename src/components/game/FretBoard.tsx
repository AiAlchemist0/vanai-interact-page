import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTouchControls } from "@/hooks/useTouchControls";
import { useEffect } from "react";

interface FretBoardProps {
  pressedFrets: Set<number>;
  onStrum: () => void;
  onFretChange?: (pressedFrets: Set<number>) => void;
}

const FretBoard = ({ pressedFrets, onStrum, onFretChange }: FretBoardProps) => {
  const touchControls = useTouchControls(onStrum);
  
  // Use touch controls on mobile, keyboard controls on desktop
  const currentPressedFrets = touchControls.isTouch ? touchControls.pressedFrets : pressedFrets;
  
  // Notify parent of fret changes from touch controls
  useEffect(() => {
    if (touchControls.isTouch && onFretChange) {
      onFretChange(touchControls.pressedFrets);
    }
  }, [touchControls.pressedFrets, touchControls.isTouch, onFretChange]);

  const fretColors = ['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-orange-500'];
  const fretLabels = ['Green (A)', 'Red (S)', 'Yellow (D)', 'Blue (F)', 'Orange (G)'];
  const touchLabels = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/20">
      <div className="space-y-4">
        {/* Fret Buttons */}
        <div className="flex justify-center gap-2">
          {fretColors.map((color, index) => {
            const isPressed = currentPressedFrets.has(index);
            
            return (
              <div
                key={index}
                ref={(el) => {
                  if (touchControls.fretRefs.current) {
                    touchControls.fretRefs.current[index] = el;
                  }
                }}
                className={`
                  relative w-16 h-16 rounded-full border-4 border-white/20 cursor-pointer
                  ${color} ${isPressed ? 'scale-110 shadow-lg' : 'scale-100'}
                  transition-all duration-150 select-none
                  ${touchControls.isTouch ? 'active:scale-95' : ''}
                `}
                style={{
                  boxShadow: isPressed 
                    ? `0 0 20px ${color.includes('green') ? '#22c55e' : 
                        color.includes('red') ? '#ef4444' :
                        color.includes('yellow') ? '#eab308' :
                        color.includes('blue') ? '#3b82f6' : '#f97316'}`
                    : 'none'
                }}
              >
                {/* Fret indicator */}
                <div className="absolute inset-2 rounded-full bg-white/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    {touchControls.isTouch ? touchLabels[index].charAt(0) : String.fromCharCode(65 + index)}
                  </span>
                </div>
                
                {/* Press indicator */}
                {isPressed && (
                  <div className="absolute inset-0 rounded-full bg-white/40 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Strum Button */}
        <div className="flex justify-center">
          <div
            ref={touchControls.strumAreaRef}
            className="relative"
          >
            <Button
              onClick={touchControls.isTouch ? undefined : onStrum}
              size="lg"
              className={`
                px-8 py-4 text-lg font-bold bg-gradient-to-b from-purple-500 to-purple-700 
                hover:from-purple-400 hover:to-purple-600 text-white shadow-lg
                transition-all duration-150 select-none
                ${touchControls.isTouch ? 'pointer-events-none' : ''}
              `}
            >
              {touchControls.isTouch ? 'TAP TO STRUM' : 'STRUM (SPACE)'}
            </Button>
            
            {/* Touch area overlay for mobile */}
            {touchControls.isTouch && (
              <div className="absolute inset-0 rounded-lg bg-transparent" />
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            {touchControls.isTouch 
              ? 'Hold fret buttons and tap strum area to play'
              : 'Hold fret keys (A, S, D, F, G) and press SPACE to strum'
            }
          </p>
          {!touchControls.isTouch && (
            <p className="text-xs text-muted-foreground/70">
              Tip: You can hold multiple frets for chords
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FretBoard;
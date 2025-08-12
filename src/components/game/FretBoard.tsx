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
                data-fret={index}
                className={`fret-button fret-${index}`}
                ref={(el) => {
                  if (touchControls.fretRefs.current) {
                    touchControls.fretRefs.current[index] = el;
                  }
                }}
                style={{
                  position: 'relative',
                  width: touchControls.isTouch ? '80px' : '64px',
                  height: touchControls.isTouch ? '80px' : '64px',
                  borderRadius: '50%',
                  border: '4px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  transform: isPressed ? 'scale(1.1)' : 'scale(1)',
                  touchAction: 'none',
                  userSelect: 'none',
                  boxShadow: isPressed 
                    ? `0 0 20px ${color.includes('green') ? '#22c55e' : 
                        color.includes('red') ? '#ef4444' :
                        color.includes('yellow') ? '#eab308' :
                        color.includes('blue') ? '#3b82f6' : '#f97316'}`
                    : 'none',
                  backgroundColor: color.includes('green') ? '#22c55e' : 
                    color.includes('red') ? '#ef4444' :
                    color.includes('yellow') ? '#eab308' :
                    color.includes('blue') ? '#3b82f6' : '#f97316'
                }}
              >
                {/* Fret indicator */}
                <div 
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {touchControls.isTouch ? touchLabels[index].charAt(0) : String.fromCharCode(65 + index)}
                  </span>
                </div>
                
                {/* Press indicator */}
                {isPressed && (
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    animation: 'pulse 1s infinite'
                  }} />
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
              data-strum="true"
              className="strum-button"
              onClick={touchControls.isTouch ? undefined : onStrum}
              size="lg"
              style={{
                width: touchControls.isTouch ? '200px' : '160px',
                height: touchControls.isTouch ? '60px' : '48px',
                fontSize: touchControls.isTouch ? '18px' : '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(to bottom, #8b5cf6, #7c3aed)',
                color: 'white',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: 'all 150ms ease',
                userSelect: 'none',
                touchAction: 'manipulation',
                pointerEvents: touchControls.isTouch ? 'none' : 'auto'
              }}
            >
              {touchControls.isTouch ? 'TAP TO STRUM' : 'STRUM (SPACE)'}
            </Button>
            
            {/* Touch area overlay for mobile */}
            {touchControls.isTouch && (
              <div 
                className="absolute inset-0 rounded-lg bg-transparent"
                style={{ touchAction: 'manipulation' }}
              />
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
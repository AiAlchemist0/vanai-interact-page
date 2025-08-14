import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FretBoardProps {
  pressedFrets: Set<number>;
  onStrum: () => void;
  inputMethod: 'keyboard' | 'touch' | 'none';
  nextNote?: { frets: number[]; canHit: boolean; grade: string | null };
  showHitPrediction?: boolean;
}

const FretBoard = ({ pressedFrets, onStrum, inputMethod, nextNote, showHitPrediction = true }: FretBoardProps) => {
  const isTouch = inputMethod === 'touch' || 'ontouchstart' in window;

  const fretColors = ['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-orange-500'];
  const fretLabels = ['Green (A)', 'Red (S)', 'Yellow (D)', 'Blue (F)', 'Orange (G)'];
  const touchLabels = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-border/20">
      <div className="space-y-4">
        {/* Fret Buttons */}
        <div className="flex justify-center gap-2">
          {fretColors.map((color, index) => {
            const isPressed = pressedFrets.has(index);
            const isNextNoteRequired = showHitPrediction && nextNote?.frets.includes(index);
            const canHitNextNote = showHitPrediction && nextNote?.canHit && isNextNoteRequired;
            
            const baseColor = color.includes('green') ? '#22c55e' : 
              color.includes('red') ? '#ef4444' :
              color.includes('yellow') ? '#eab308' :
              color.includes('blue') ? '#3b82f6' : '#f97316';
            
            // Enhanced visual feedback
            let backgroundColor = baseColor;
            let borderColor = 'rgba(255, 255, 255, 0.2)';
            let boxShadow = 'none';
            
            if (isPressed) {
              boxShadow = `0 0 20px ${baseColor}`;
              borderColor = 'rgba(255, 255, 255, 0.6)';
            }
            
            if (isNextNoteRequired && showHitPrediction) {
              borderColor = canHitNextNote ? '#00ff00' : '#ffff00';
              if (!isPressed) {
                boxShadow = `0 0 15px ${canHitNextNote ? '#00ff00' : '#ffff00'}`;
              }
            }
            
            return (
              <div
                key={index}
                data-fret={index}
                className={`fret-button fret-${index}`}
                style={{
                  position: 'relative',
                  width: isTouch ? '80px' : '64px',
                  height: isTouch ? '80px' : '64px',
                  borderRadius: '50%',
                  border: `4px solid ${borderColor}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  transform: isPressed ? 'scale(1.1)' : 'scale(1)',
                  touchAction: 'none',
                  userSelect: 'none',
                  boxShadow,
                  backgroundColor
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
                    {isTouch ? touchLabels[index].charAt(0) : String.fromCharCode(65 + index)}
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
          <Button
            data-strum="true"
            className="strum-button"
            onClick={!isTouch ? onStrum : undefined}
            size="lg"
            style={{
              width: isTouch ? '200px' : '160px',
              height: isTouch ? '60px' : '48px',
              fontSize: isTouch ? '18px' : '16px',
              fontWeight: 'bold',
              background: 'linear-gradient(to bottom, #8b5cf6, #7c3aed)',
              color: 'white',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 150ms ease',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            {isTouch ? 'TAP TO STRUM' : 'STRUM (SPACE)'}
          </Button>
        </div>

        {/* Enhanced Instructions with Hit Prediction */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            {isTouch 
              ? 'Hold fret buttons and tap strum area to play'
              : 'Hold fret keys (A, S, D, F, G) and press SPACE to strum'
            }
          </p>
          {showHitPrediction && nextNote && (
            <p className="text-xs font-medium" style={{
              color: nextNote.canHit ? '#00ff00' : '#ffff00'
            }}>
              {nextNote.canHit 
                ? `Ready to hit! (${nextNote.grade?.toUpperCase()})` 
                : `Hold frets: ${nextNote.frets.map(f => ['Green', 'Red', 'Yellow', 'Blue', 'Orange'][f]).join(', ')}`
              }
            </p>
          )}
          {!isTouch && (
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
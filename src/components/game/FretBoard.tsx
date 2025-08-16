import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FretBoardProps {
  pressedFrets: Set<number>;
  onStrum: () => void;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

const FretBoard = ({ pressedFrets, onStrum, inputMethod }: FretBoardProps) => {
  const isTouch = inputMethod === 'touch' || 'ontouchstart' in window;

  const fretColors = ['bg-green-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-orange-500'];
  const fretLabels = ['Green (A)', 'Red (S)', 'Yellow (D)', 'Blue (F)', 'Orange (G)'];
  const touchLabels = ['Green', 'Red', 'Yellow', 'Blue', 'Orange'];

  return (
    <div className="relative border-t border-border/30 pb-safe">
      <Card className="p-3 md:p-6 bg-transparent border-none shadow-none">
        <div className="space-y-3 md:space-y-6">
          {/* Fret Buttons - Mobile Optimized */}
          <div className="flex justify-center gap-2 md:gap-4">
            {fretColors.map((color, index) => {
              const isPressed = pressedFrets.has(index);
              
              return (
                <div
                  key={index}
                  data-fret={index}
                  className={`fret-button fret-${index}`}
                  style={{
                    position: 'relative',
                    width: isTouch ? '70px' : '60px',
                    height: isTouch ? '70px' : '60px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    transform: isPressed ? 'scale(1.1)' : 'scale(1)',
                    touchAction: 'none',
                    userSelect: 'none',
                    boxShadow: isPressed 
                      ? `0 0 15px ${color.includes('green') ? '#22c55e' : 
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
                      inset: '6px',
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

          {/* Mobile-Optimized Strum Button */}
          <div className="flex justify-center">
            <Button
              data-strum="true"
              className="strum-button"
              onClick={!isTouch ? onStrum : undefined}
              size="lg"
              style={{
                width: isTouch ? '200px' : '180px',
                height: isTouch ? '60px' : '50px',
                fontSize: isTouch ? '16px' : '14px',
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

        </div>
      </Card>
    </div>
  );
};

export default FretBoard;
import { Button } from "@/components/ui/button";

interface FretBoardProps {
  pressedFrets: Set<number>;
  onStrum: () => void;
}

const FRET_COLORS = [
  "bg-ai-green",     // Green
  "bg-destructive",  // Red  
  "bg-ai-orange",    // Yellow
  "bg-ai-blue",      // Blue
  "bg-ai-purple"     // Orange/Purple
];

const FRET_LABELS = ["A", "S", "D", "F", "G"];

const FretBoard = ({ pressedFrets, onStrum }: FretBoardProps) => {
  return (
    <div className="relative z-20 p-6 bg-card/50 backdrop-blur-sm border-t border-border/20">
      <div className="flex items-center justify-center gap-8">
        {/* Fret Buttons */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((fret) => (
            <div key={fret} className="flex flex-col items-center gap-2">
              <div
                className={`w-16 h-16 rounded-full border-4 transition-all duration-150 flex items-center justify-center font-bold text-lg ${
                  pressedFrets.has(fret)
                    ? `${FRET_COLORS[fret]} border-white/50 glow-primary scale-110`
                    : `${FRET_COLORS[fret]}/20 border-${FRET_COLORS[fret].replace('bg-', '')}/50`
                }`}
              >
                {FRET_LABELS[fret]}
              </div>
              <span className="text-xs text-muted-foreground">
                {FRET_LABELS[fret]}
              </span>
            </div>
          ))}
        </div>

        {/* Strum Button */}
        <div className="ml-8">
          <Button
            size="lg"
            onClick={onStrum}
            className="w-20 h-20 rounded-full gradient-primary hover:glow-primary transition-all duration-150 text-xl font-bold"
          >
            STRUM
          </Button>
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground">SPACE</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Hold fret keys (A, S, D, F, G) and hit SPACEBAR to strum!
        </p>
      </div>
    </div>
  );
};

export default FretBoard;
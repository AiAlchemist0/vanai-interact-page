import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Gamepad2, Zap } from "lucide-react";

interface GameInstructionsProps {
  isVisible: boolean;
  onClose: () => void;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

const GameInstructions = ({ isVisible, onClose, inputMethod }: GameInstructionsProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="max-w-md mx-4 border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              How to Play
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-primary">Controls</h3>
            {inputMethod === 'keyboard' || inputMethod === 'none' ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Frets:</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">A</Badge>
                    <Badge variant="outline" className="text-xs">S</Badge>
                    <Badge variant="outline" className="text-xs">D</Badge>
                    <Badge variant="outline" className="text-xs">F</Badge>
                    <Badge variant="outline" className="text-xs">G</Badge>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Strum:</span>
                  <Badge variant="outline" className="text-xs">SPACE</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Star Power:</span>
                  <Badge variant="outline" className="text-xs">SHIFT</Badge>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <p>• Tap the colored fret buttons</p>
                <p>• Tap the strum area to play</p>
                <p>• Hold frets + strum when notes reach the hit line</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-primary">Gameplay</h3>
            <div className="text-sm space-y-1">
              <p>• Hold the correct fret(s) when notes reach the hit line</p>
              <p>• Press SPACE (or tap strum) to play the note</p>
              <p>• Hit notes perfectly to build your combo</p>
              <p>• Build star power and activate with SHIFT</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-primary">Scoring</h3>
            <div className="flex justify-between items-center text-sm">
              <span>Perfect Hit:</span>
              <Badge className="bg-green-500">×4 Points</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Good Hit:</span>
              <Badge className="bg-yellow-500">×2 Points</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Okay Hit:</span>
              <Badge className="bg-orange-500">×1 Points</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Watch the notes fall and hit them when they reach the bright hit line!</span>
          </div>

          <Button onClick={onClose} className="w-full">
            Got it! Let's play
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInstructions;
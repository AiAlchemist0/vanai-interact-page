import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gamepad2, Target, Zap, Trophy, Music, Clock } from "lucide-react";

interface GameInstructionsPanelProps {
  inputMethod: 'keyboard' | 'touch' | 'none';
}

const GameInstructionsPanel = ({ inputMethod }: GameInstructionsPanelProps) => {
  return (
    <div className="w-80 h-full bg-card/95 backdrop-blur-sm border-l border-border/30 p-4 overflow-y-auto">
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gamepad2 className="w-5 h-5 text-primary" />
            How to Play
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Controls */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              Controls
            </h3>
            {inputMethod === 'keyboard' || inputMethod === 'none' ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Fret Keys:</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs bg-green-500/20 text-green-300">A</Badge>
                    <Badge variant="outline" className="text-xs bg-red-500/20 text-red-300">S</Badge>
                    <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-300">D</Badge>
                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300">F</Badge>
                    <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-300">G</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Strum:</span>
                  <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300">SPACE</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Star Power:</span>
                  <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-300">SHIFT</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pause:</span>
                  <Badge variant="outline" className="text-xs">ESC</Badge>
                </div>
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p>• Tap the colored fret buttons</p>
                <p>• Tap the purple strum button</p>
                <p>• Hold frets + strum when notes reach the hit line</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Gameplay */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Music className="w-4 h-4 text-blue-500" />
              Gameplay
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Watch the Notes</p>
                  <p className="text-muted-foreground">Colored notes fall down the highway toward the hit line</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Hold the Frets</p>
                  <p className="text-muted-foreground">Press and hold the matching colored fret key(s)</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Strum at the Right Time</p>
                  <p className="text-muted-foreground">Press SPACE when the note reaches the bright hit line</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">4</div>
                <div>
                  <p className="font-medium">Build Your Combo</p>
                  <p className="text-muted-foreground">Hit consecutive notes to increase your multiplier</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Scoring */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Scoring
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  Perfect Hit
                </span>
                <Badge className="bg-green-500">×4 Points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Good Hit
                </span>
                <Badge className="bg-blue-500">×2 Points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  Okay Hit
                </span>
                <Badge className="bg-yellow-500">×1 Points</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  Miss
                </span>
                <Badge className="bg-red-500">0 Points</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Star Power */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Star Power
            </h3>
            <div className="space-y-2 text-sm">
              <p>• Build star power by hitting perfect notes</p>
              <p>• Activate with SHIFT when meter is 50%+ full</p>
              <p>• Doubles your score multiplier for 10 seconds</p>
              <p>• Golden visual effects when active</p>
            </div>
          </div>

          <Separator />

          {/* Tips */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Pro Tips
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Watch the timing feedback to improve</p>
              <p>• Use the practice mode for difficult songs</p>
              <p>• Multiple frets = chords (hold several keys)</p>
              <p>• Missing notes breaks your combo</p>
              <p>• Hit line is the bright white line in 3D view</p>
            </div>
          </div>

          {/* Visual Indicators */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Visual Indicators</h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>🎸 Bottom center: Shows which frets you're pressing</p>
              <p>🔥 Combo effects: Appear around hit zones at high combos</p>
              <p>⚡ Yellow prompt: Reminds you to strum when holding frets</p>
              <p>🎯 Timing feedback: Shows if you're early, late, or perfect</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameInstructionsPanel;
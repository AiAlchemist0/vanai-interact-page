import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Volume2, Eye, Zap, RotateCcw } from 'lucide-react';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCalibrationChange: (settings: {
    audioOffset: number;
    visualOffset: number;
    noteSpeed: number;
  }) => void;
  currentSettings: {
    audioOffset: number;
    visualOffset: number;
    noteSpeed: number;
  };
}

const CalibrationModal = ({
  isOpen,
  onClose,
  onCalibrationChange,
  currentSettings
}: CalibrationModalProps) => {
  const [audioOffset, setAudioOffset] = useState(currentSettings.audioOffset);
  const [visualOffset, setVisualOffset] = useState(currentSettings.visualOffset);
  const [noteSpeed, setNoteSpeed] = useState(currentSettings.noteSpeed);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Create test audio
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dvr2UfCCuL0fPUfS4IBH/M7+OZRQ0PU6zj26hUGAg+ltryxnkpBSl+zPLCdSEDI3zK3tOALwgLY6vn45VLDwxOo+Do';
      audioRef.current = audio;
    }
  }, [isOpen]);

  const playTestBeat = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      
      // Play test beats every 600ms for 3 seconds
      let beatCount = 0;
      intervalRef.current = setInterval(() => {
        if (audioRef.current && beatCount < 5) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          beatCount++;
        } else {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 600);
    }
  };

  const applySettings = () => {
    onCalibrationChange({
      audioOffset,
      visualOffset,
      noteSpeed
    });
    onClose();
  };

  const resetSettings = () => {
    setAudioOffset(0);
    setVisualOffset(0);
    setNoteSpeed(1.0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Game Calibration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Offset */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">Audio Offset</span>
              </div>
              <Badge variant="outline">{audioOffset}ms</Badge>
            </div>
            <Slider
              value={[audioOffset]}
              onValueChange={([value]) => setAudioOffset(value)}
              min={-200}
              max={200}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Positive values delay audio, negative values advance it
            </p>
          </div>

          {/* Visual Offset */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Visual Offset</span>
              </div>
              <Badge variant="outline">{visualOffset}ms</Badge>
            </div>
            <Slider
              value={[visualOffset]}
              onValueChange={([value]) => setVisualOffset(value)}
              min={-200}
              max={200}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust if notes appear too early or late
            </p>
          </div>

          {/* Note Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Note Speed</span>
              </div>
              <Badge variant="outline">{noteSpeed.toFixed(1)}x</Badge>
            </div>
            <Slider
              value={[noteSpeed]}
              onValueChange={([value]) => setNoteSpeed(value)}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How fast notes move toward the hit line
            </p>
          </div>

          {/* Test Beat */}
          <div className="space-y-3">
            <Button
              onClick={playTestBeat}
              disabled={isPlaying}
              variant="outline"
              className="w-full"
            >
              {isPlaying ? 'Playing Test...' : 'Play Test Beat'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Use this to test your audio sync settings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={onClose} variant="ghost" className="flex-1">
              Cancel
            </Button>
            <Button onClick={applySettings} className="flex-1">
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalibrationModal;
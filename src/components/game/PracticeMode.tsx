import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, RotateCcw, Volume2, Zap } from 'lucide-react';
import { Song, Difficulty } from '@/pages/Game';

interface PracticeModeProps {
  song: Song;
  difficulty: Difficulty;
  onClose: () => void;
  onStartGame: (settings: PracticeSettings) => void;
}

export interface PracticeSettings {
  speed: number; // 0.5 to 1.5
  startTime: number; // in seconds
  endTime: number; // in seconds
  loopEnabled: boolean;
  metronomeEnabled: boolean;
  difficulty: Difficulty;
}

const PracticeMode = ({ song, difficulty, onClose, onStartGame }: PracticeModeProps) => {
  const [settings, setSettings] = useState<PracticeSettings>({
    speed: 0.8,
    startTime: 0,
    endTime: Math.floor(song.duration / 1000),
    loopEnabled: true,
    metronomeEnabled: false,
    difficulty
  });

  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const handleSpeedChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, speed: value[0] }));
  };

  const handleStartTimeChange = (value: number[]) => {
    setSettings(prev => ({ 
      ...prev, 
      startTime: value[0],
      endTime: Math.max(value[0] + 10, prev.endTime) // Ensure at least 10 seconds
    }));
  };

  const handleEndTimeChange = (value: number[]) => {
    setSettings(prev => ({ 
      ...prev, 
      endTime: Math.max(prev.startTime + 10, value[0])
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePreview = () => {
    setIsPreviewPlaying(!isPreviewPlaying);
    // TODO: Implement audio preview with settings
  };

  const handleStart = () => {
    onStartGame(settings);
  };

  const resetSettings = () => {
    setSettings({
      speed: 0.8,
      startTime: 0,
      endTime: Math.floor(song.duration / 1000),
      loopEnabled: true,
      metronomeEnabled: false,
      difficulty
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Practice Mode
            </div>
            <Badge variant="outline">{song.title}</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Speed Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Playback Speed</label>
              <Badge variant="outline">{Math.round(settings.speed * 100)}%</Badge>
            </div>
            <Slider
              value={[settings.speed]}
              onValueChange={handleSpeedChange}
              min={0.5}
              max={1.5}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>50% (Very Slow)</span>
              <span>100% (Normal)</span>
              <span>150% (Fast)</span>
            </div>
          </div>

          {/* Difficulty Override */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Practice Difficulty</label>
            <Select 
              value={settings.difficulty} 
              onValueChange={(value: Difficulty) => 
                setSettings(prev => ({ ...prev, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy (2 frets, forgiving timing)</SelectItem>
                <SelectItem value="medium">Medium (3 frets, normal timing)</SelectItem>
                <SelectItem value="hard">Hard (4 frets, tight timing)</SelectItem>
                <SelectItem value="expert">Expert (5 frets, precise timing)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Range Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Practice Section</label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Start Time</span>
                <Badge variant="outline">{formatTime(settings.startTime)}</Badge>
              </div>
              <Slider
                value={[settings.startTime]}
                onValueChange={handleStartTimeChange}
                min={0}
                max={Math.floor(song.duration / 1000) - 10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">End Time</span>
                <Badge variant="outline">{formatTime(settings.endTime)}</Badge>
              </div>
              <Slider
                value={[settings.endTime]}
                onValueChange={handleEndTimeChange}
                min={settings.startTime + 10}
                max={Math.floor(song.duration / 1000)}
                step={1}
                className="w-full"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Practice Duration: {formatTime(settings.endTime - settings.startTime)}
            </div>
          </div>

          {/* Practice Options */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Practice Options</label>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm">Loop Section</span>
                <p className="text-xs text-muted-foreground">
                  Automatically restart when reaching the end
                </p>
              </div>
              <Switch
                checked={settings.loopEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, loopEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-sm">Metronome</span>
                <p className="text-xs text-muted-foreground">
                  Add click track to help with timing
                </p>
              </div>
              <Switch
                checked={settings.metronomeEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, metronomeEnabled: checked }))
                }
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Preview</label>
            <div className="flex justify-center">
              <Button
                onClick={togglePreview}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPreviewPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Stop Preview
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Preview Section
                  </>
                )}
              </Button>
            </div>
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
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStart}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeMode;
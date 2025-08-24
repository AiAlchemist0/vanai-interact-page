import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Volume2, CheckCircle2, MousePointer, Headphones } from 'lucide-react';

interface AudioInteractionPrimerProps {
  isOpen: boolean;
  onClose: () => void;
  onTestAudio: () => Promise<boolean>;
}

export const AudioInteractionPrimer: React.FC<AudioInteractionPrimerProps> = ({
  isOpen,
  onClose,
  onTestAudio
}) => {
  const [audioTested, setAudioTested] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleTestAudio = async () => {
    setTesting(true);
    try {
      const success = await onTestAudio();
      setAudioTested(success);
      if (success) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Audio test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  const resetState = () => {
    setAudioTested(false);
    setTesting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            Enable Audio Experience
          </DialogTitle>
          <DialogDescription>
            Modern browsers require user interaction before playing audio. Let's set that up!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Browser Audio Policy</span>
                <Badge variant="secondary" className="text-xs">Required</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Browsers prevent automatic audio playback until you interact with the page. 
                This protects against unwanted sounds and respects your preferences.
              </p>
            </div>
          </Card>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Test Audio Playback
            </h4>
            
            {!audioTested ? (
              <Button 
                onClick={handleTestAudio}
                disabled={testing}
                className="w-full"
                size="lg"
              >
                {testing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Testing Audio...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Test Audio Playback
                  </>
                )}
              </Button>
            ) : (
              <Card className="p-3 bg-green-500/10 border-green-500/20">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Audio Ready!</span>
                </div>
                <p className="text-xs text-green-600/80 mt-1">
                  Your browser can now play audio. Enjoy the music!
                </p>
              </Card>
            )}
          </div>

          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              {audioTested ? 'Start Listening' : 'Skip for Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioInteractionPrimer;
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import type { InsightData, Character } from '@/types/game';

interface InsightModalProps {
  insight: InsightData;
  character: Character;
  onClose: () => void;
}

const InsightModal = ({ insight, character, onClose }: InsightModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-gradient">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gradient">
            <Sparkles className="w-5 h-5" />
            New Insight Discovered!
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Character Perspective */}
          <Card className="border-gradient">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{character.avatar}</div>
                <div>
                  <h3 className="font-semibold">{character.name}'s Perspective</h3>
                  <Badge variant="outline">{character.title}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                {getCharacterPerspective(insight, character)}
              </p>
            </CardContent>
          </Card>

          {/* Insight Data */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-gradient">{insight.title}</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{insight.description}</p>
              
              {insight.quote && (
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
                  "{insight.quote}"
                </blockquote>
              )}

              {/* Sample Data Visualization */}
              <div className="bg-muted/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Survey Data Point</h4>
                <div className="flex justify-between items-center">
                  <span>Response Rate:</span>
                  <Badge variant="secondary" className="gradient-primary text-white">
                    {Math.round(insight.data.value)}%
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">AI Survey Data</Badge>
                <Badge variant="outline">BC Residents</Badge>
                <Badge variant="outline">{character.specialization}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button onClick={onClose} className="gradient-primary">
              Continue Exploring
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getCharacterPerspective = (insight: InsightData, character: Character): string => {
  const perspectives = {
    'cyberpunk': `As someone deeply embedded in tech culture, this data confirms what I've been seeing in Vancouver's startup scene. The adoption patterns make perfect sense from a developer's perspective.`,
    'noob': `This is fascinating! As someone just starting to learn about AI, this insight helps me understand how other people like me are thinking about these technologies. It's reassuring to see I'm not alone in my curiosity.`,
    'scientist': `From a research standpoint, this data point is crucial for understanding the broader implications of AI adoption in BC. The methodology behind this finding aligns with current academic consensus.`,
    'policy': `This insight directly impacts how we should be crafting AI governance policies for British Columbia. The public sentiment here will be key for regulatory frameworks.`
  };
  
  return perspectives[character.id as keyof typeof perspectives] || 
         `This insight provides valuable context for understanding AI perspectives across BC.`;
};

export default InsightModal;
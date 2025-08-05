import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Medal, Crown, Zap, Target } from 'lucide-react';

interface AchievementSystemProps {
  gameState: any;
  onClose: () => void;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  condition: (gameState: any) => boolean;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const achievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Start your AI exploration journey',
    icon: '👣',
    color: '#10B981',
    condition: (gs) => gs.gameStarted,
    points: 10,
    rarity: 'common'
  },
  {
    id: 'district-explorer',
    name: 'District Explorer',
    description: 'Unlock 3 districts',
    icon: '🗺️',
    color: '#3B82F6',
    condition: (gs) => gs.unlockedDistricts.length >= 3,
    points: 25,
    rarity: 'rare'
  },
  {
    id: 'insight-collector',
    name: 'Insight Collector',
    description: 'Discover 5 AI insights',
    icon: '💡',
    color: '#F59E0B',
    condition: (gs) => gs.discoveredInsights.length >= 5,
    points: 30,
    rarity: 'rare'
  },
  {
    id: 'tech-enthusiast',
    name: 'Tech Enthusiast',
    description: 'Complete all Tech Hub insights',
    icon: '💻',
    color: '#06B6D4',
    condition: (gs) => gs.visitedBuildings.filter(b => b.includes('tech-hub')).length >= 2,
    points: 40,
    rarity: 'epic'
  },
  {
    id: 'policy-expert',
    name: 'Policy Expert',
    description: 'Master government district insights',
    icon: '⚖️',
    color: '#8B5CF6',
    condition: (gs) => gs.visitedBuildings.filter(b => b.includes('government')).length >= 2,
    points: 40,
    rarity: 'epic'
  },
  {
    id: 'ai-master',
    name: 'AI Master',
    description: 'Discover all insights across BC',
    icon: '🎓',
    color: '#EF4444',
    condition: (gs) => gs.discoveredInsights.length >= 10,
    points: 100,
    rarity: 'legendary'
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Unlock 3 districts in under 5 minutes',
    icon: '⚡',
    color: '#F59E0B',
    condition: (gs) => gs.unlockedDistricts.length >= 3, // Would need timestamp tracking
    points: 50,
    rarity: 'epic'
  },
  {
    id: 'completionist',
    name: 'BC AI Expert',
    description: 'Achieve 100% completion',
    icon: '👑',
    color: '#FFD700',
    condition: (gs) => gs.unlockedDistricts.length >= 6 && gs.discoveredInsights.length >= 12,
    points: 200,
    rarity: 'legendary'
  }
];

const AchievementSystem = ({ gameState, onClose }: AchievementSystemProps) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const previouslyUnlocked = JSON.parse(localStorage.getItem('bc-ai-quest-achievements') || '[]');
    const currentlyUnlocked = achievements.filter(achievement => 
      achievement.condition(gameState)
    );
    
    const newlyUnlocked = currentlyUnlocked.filter(achievement =>
      !previouslyUnlocked.includes(achievement.id)
    );

    setUnlockedAchievements(currentlyUnlocked);
    setNewAchievements(newlyUnlocked);

    if (newlyUnlocked.length > 0) {
      localStorage.setItem(
        'bc-ai-quest-achievements', 
        JSON.stringify(currentlyUnlocked.map(a => a.id))
      );
    }
  }, [gameState]);

  const getTotalPoints = () => {
    return unlockedAchievements.reduce((total, achievement) => total + achievement.points, 0);
  };

  const getRarityIcon = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4 text-gray-400" />;
      case 'rare': return <Medal className="w-4 h-4 text-blue-500" />;
      case 'epic': return <Trophy className="w-4 h-4 text-purple-500" />;
      case 'legendary': return <Crown className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-300';
      case 'rare': return 'bg-blue-500/20 text-blue-300';
      case 'epic': return 'bg-purple-500/20 text-purple-300';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  if (newAchievements.length > 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="border-gradient max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-gradient">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              Achievement Unlocked!
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {newAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-gradient animate-scale-in">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{achievement.name}</h3>
                        {getRarityIcon(achievement.rarity)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          <Zap className="w-3 h-3 mr-1" />
                          {achievement.points} pts
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center pt-4">
              <div className="text-sm text-muted-foreground mb-2">
                Total Achievement Points
              </div>
              <div className="text-2xl font-bold text-gradient">
                {getTotalPoints()} pts
              </div>
            </div>
            
            <Button onClick={onClose} className="gradient-primary w-full" size="lg">
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default AchievementSystem;
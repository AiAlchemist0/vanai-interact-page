import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import CharacterCard from '@/components/game/CharacterCard';
import { useGameState } from '@/hooks/useGameState';
import type { Character } from '@/types/game';

const characters: Character[] = [
  {
    id: 'cyberpunk',
    name: 'Alex Chen',
    title: 'BC CyberPunk',
    description: 'Tech-savvy urbanite from Vancouver. Lives and breathes cutting-edge AI technology.',
    avatar: '🦾',
    aiExperience: 'high',
    specialization: 'Advanced AI Implementation',
    color: 'hsl(var(--ai-cyan))'
  },
  {
    id: 'noob',
    name: 'Sarah Miller',
    title: 'AI Curious',
    description: 'Small business owner from Victoria. New to AI but eager to learn its potential.',
    avatar: '🤔',
    aiExperience: 'low',
    specialization: 'Practical AI Applications',
    color: 'hsl(var(--ai-green))'
  },
  {
    id: 'scientist',
    name: 'Dr. Raj Patel',
    title: 'Data Scientist',
    description: 'Research analyst from UBC. Passionate about AI ethics and responsible development.',
    avatar: '👨‍🔬',
    aiExperience: 'high',
    specialization: 'AI Research & Analytics',
    color: 'hsl(var(--ai-purple))'
  },
  {
    id: 'policy',
    name: 'Maria Santos',
    title: 'Policy Maker',
    description: 'Government liaison from Victoria. Focused on AI governance and public policy.',
    avatar: '👩‍💼',
    aiExperience: 'medium',
    specialization: 'AI Governance & Regulation',
    color: 'hsl(var(--ai-orange))'
  }
];

const CharacterSelect = () => {
  const navigate = useNavigate();
  const { gameState, updateGameState } = useGameState();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleStartGame = async () => {
    console.log('handleStartGame called with character:', selectedCharacter);
    
    if (selectedCharacter) {
      console.log('Updating game state...');
      const newState = {
        selectedCharacter,
        gameStarted: true,
        unlockedDistricts: ['tech-hub'], // Start with Tech Hub unlocked
        playerPosition: { x: 400, y: 300 }
      };
      
      // Update state and save directly to localStorage to ensure it's persisted before navigation
      updateGameState(newState);
      localStorage.setItem('bc-ai-quest-state', JSON.stringify({
        ...gameState,
        ...newState
      }));
      
      console.log('Navigating to /game...');
      // Small delay to ensure state is saved
      setTimeout(() => navigate('/game'), 10);
    } else {
      console.log('No character selected!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-background">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="outline"
              size="sm"
              className="mb-6 border-gradient"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Survey
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 text-gradient">
                Choose Your Explorer
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select a character to begin your journey through BC's AI landscape. 
                Each explorer brings unique perspectives to the data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Character Selection */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={selectedCharacter?.id === character.id}
              onClick={() => handleCharacterSelect(character)}
            />
          ))}
        </div>

        {/* Start Game Button */}
        {selectedCharacter && (
          <div className="text-center animate-fade-in">
            <div className="mb-6 p-6 bg-card rounded-lg border-gradient max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">Ready to explore as:</h3>
              <p className="text-2xl font-bold text-gradient">{selectedCharacter.name}</p>
              <p className="text-muted-foreground">{selectedCharacter.title}</p>
            </div>
            <Button
              size="lg"
              className="gradient-primary hover:opacity-90 transition-smooth text-lg px-8 py-4"
              onClick={() => {
                console.log('Start Your Journey button clicked!');
                console.log('Current selectedCharacter:', selectedCharacter);
                handleStartGame();
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelect;
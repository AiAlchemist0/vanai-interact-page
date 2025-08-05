import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Character } from '@/types/game';

interface CharacterCardProps {
  character: Character;
  selected: boolean;
  onClick: () => void;
}

const CharacterCard = ({ character, selected, onClick }: CharacterCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-smooth hover:scale-105 hover:shadow-elegant ${
        selected ? 'border-gradient glow-primary' : 'border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="text-6xl mb-4">{character.avatar}</div>
        
        <h3 className="text-xl font-bold mb-2 text-gradient">
          {character.name}
        </h3>
        
        <Badge 
          variant="secondary" 
          className="mb-4"
          style={{ backgroundColor: character.color + '20', borderColor: character.color }}
        >
          {character.title}
        </Badge>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {character.description}
        </p>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">AI Experience:</span>
            <Badge variant={
              character.aiExperience === 'high' ? 'default' : 
              character.aiExperience === 'medium' ? 'secondary' : 
              'outline'
            }>
              {character.aiExperience.toUpperCase()}
            </Badge>
          </div>
          
          <div className="text-left">
            <span className="text-muted-foreground">Specialization:</span>
            <div className="text-foreground font-medium">
              {character.specialization}
            </div>
          </div>
        </div>
        
        {selected && (
          <div className="mt-4 text-primary font-medium animate-fade-in">
            ✓ Selected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Music, Zap } from "lucide-react";
import { Song, Difficulty } from "@/pages/Game";

interface GameMenuProps {
  songs: Song[];
  selectedSong: Song | null;
  difficulty: Difficulty;
  onSongSelect: (song: Song) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartGame: () => void;
}

const DIFFICULTY_COLORS = {
  easy: "text-ai-green",
  medium: "text-ai-cyan",
  hard: "text-ai-orange",
  expert: "text-destructive"
};

const DIFFICULTY_DESCRIPTIONS = {
  easy: "Perfect for beginners",
  medium: "Moderate challenge",
  hard: "For experienced players",
  expert: "Ultimate challenge"
};

const GameMenu = ({
  songs,
  selectedSong,
  difficulty,
  onSongSelect,
  onDifficultyChange,
  onStartGame
}: GameMenuProps) => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
          BC AI Guitar Hero
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Rock out to AI-generated music from the BC AI Survey project
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-ai-cyan" />
            <span>Use A, S, D, F, G keys</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-ai-orange" />
            <span>Hit Spacebar to strum</span>
          </div>
        </div>
      </div>

      {/* Song Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Music className="w-6 h-6 text-primary" />
          Select Your Track
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
          {songs.map((song) => (
            <Card
              key={song.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant ${
                selectedSong?.id === song.id
                  ? "border-primary glow-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSongSelect(song)}
            >
              <CardHeader className="p-3 md:p-2">
                <div className="flex items-center gap-3 md:block">
                  <div className="w-16 h-16 md:w-full md:aspect-square bg-gradient-primary rounded-lg md:mb-2 overflow-hidden flex-shrink-0">
                    <img 
                      src={song.coverArt} 
                      alt={`${song.title} cover art`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center">
                      <Music className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 md:block">
                    <CardTitle className="text-sm md:text-sm line-clamp-2 leading-tight">{song.title}</CardTitle>
                    <p className="text-xs md:text-xs text-muted-foreground line-clamp-1 md:mb-1">{song.artist}</p>
                    <div className="flex justify-between items-center text-xs md:text-xs text-muted-foreground mt-1 md:mt-1">
                      <span>{song.bpm} BPM</span>
                      <span>{Math.floor(song.duration / 60000)}:{(Math.floor(song.duration / 1000) % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Choose Difficulty
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((diff) => (
            <Card
              key={diff}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                difficulty === diff
                  ? "border-primary glow-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onDifficultyChange(diff)}
            >
              <CardContent className="p-6 text-center">
                <h3 className={`text-xl font-bold mb-2 capitalize ${DIFFICULTY_COLORS[diff]}`}>
                  {diff}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {DIFFICULTY_DESCRIPTIONS[diff]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Start Game Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={onStartGame}
          disabled={!selectedSong}
          className="gradient-primary hover:glow-primary transition-smooth group text-xl px-12 py-6"
        >
          <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
          Start Rocking!
        </Button>
      </div>
    </div>
  );
};

export default GameMenu;
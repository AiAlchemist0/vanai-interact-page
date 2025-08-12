import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameMenu from "@/components/game/GameMenu";
import GameBoard from "@/components/game/GameBoard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export type GameState = "menu" | "playing" | "paused" | "gameOver";
export type Difficulty = "easy" | "medium" | "hard" | "expert";

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioFile: string;
  coverArt: string;
  bpm: number;
  duration: number;
}

export interface NotePattern {
  time: number; // in milliseconds
  frets: number[]; // [0-4] for each fret (Green, Red, Yellow, Blue, Orange)
  type: "single" | "chord";
}

const SONGS: Song[] = [
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK/BCAI",
    audioFile: "/Deepfakes in the Rain_KK_BCAI.mp3",
    coverArt: "/src/assets/deepfakes-cover.jpg",
    bpm: 120,
    duration: 180000, // 3 minutes in ms
  },
  {
    id: "pixel-wizard-bc",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    audioFile: "/Mr_Pixel_Wizard BC AI.mp3",
    coverArt: "/src/assets/pixel-wizard-bc-ai-cover.jpg",
    bpm: 140,
    duration: 200000,
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "AI Generated",
    audioFile: "/Dr. Patrick Parra Pennefather.mp3",
    coverArt: "/src/assets/dr-patrick-cover.jpg",
    bpm: 110,
    duration: 190000,
  },
];

const Game = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  const handleStartGame = () => {
    if (selectedSong) {
      setGameState("playing");
      setScore(0);
      setCombo(0);
    }
  };

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    setGameState("gameOver");
  };

  const handleReturnToMenu = () => {
    setGameState("menu");
    setSelectedSong(null);
  };

  useEffect(() => {
    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameState === "playing") {
        setGameState("paused");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="p-4 flex items-center justify-between border-b border-border/20">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Survey
          </Button>
          <h1 className="text-2xl font-bold">BC AI Guitar Hero</h1>
          <div />
        </header>

        <GameMenu
          songs={SONGS}
          selectedSong={selectedSong}
          difficulty={difficulty}
          onSongSelect={handleSongSelect}
          onDifficultyChange={setDifficulty}
          onStartGame={handleStartGame}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Game Header - Fixed Height */}
      <div className="h-16 bg-card/50 backdrop-blur-sm border-b border-border/20 flex items-center justify-between px-4 z-50 relative">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="font-bold">{selectedSong?.title}</h1>
          <p className="text-sm text-muted-foreground">{selectedSong?.artist}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <span>Score: {score.toLocaleString()}</span>
          <span>Combo: {combo}x</span>
        </div>
      </div>

      {/* Game Board - Takes remaining space */}
      <div className="h-[calc(100vh-4rem)]">
        {selectedSong && (
          <GameBoard
            song={selectedSong}
            difficulty={difficulty}
            gameState={gameState}
            score={score}
            combo={combo}
            onGameStateChange={setGameState}
            onScoreChange={setScore}
            onComboChange={setCombo}
            onGameOver={handleGameOver}
            onReturnToMenu={handleReturnToMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Game;
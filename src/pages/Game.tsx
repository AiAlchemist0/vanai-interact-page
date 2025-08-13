import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameMenu from "@/components/game/GameMenu";
import GameBoard from "@/components/game/GameBoard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Helper function to get audio URL from Supabase Storage
const getAudioUrl = (filename: string) => {
  return `https://oojckbecymzrrdtvcmqi.supabase.co/storage/v1/object/public/audio-files/${filename}`;
};

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
    id: "bc-ai-hackathon",
    title: "BC AI Hackathon by Rival Tech",
    artist: "Digital BC AI Girl aka Brittney S.",
    audioFile: getAudioUrl("BC AI Hackathon by Rival Tech.mp3"),
    coverArt: "/lovable-uploads/2f51d7bb-96fc-4f06-b7f6-fc9abbbceb32.png",
    bpm: 128,
    duration: 210000,
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    audioFile: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: "/lovable-uploads/b705b1df-f820-44d3-bff0-05699a6d1462.png",
    bpm: 95,
    duration: 180000,
  },
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK / BCAI",
    audioFile: getAudioUrl("Deepfakes in the Rain_KK_BCAI.mp3"),
    coverArt: "/lovable-uploads/2a6f9f46-8a29-4c56-aec2-3279635b85f0.png",
    bpm: 120,
    duration: 180000,
  },
  {
    id: "hr-macmillan",
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
    audioFile: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png",
    bpm: 95,
    duration: 220000,
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    audioFile: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: "/src/assets/pixel-wizard-bc-ai-cover.jpg",
    bpm: 140,
    duration: 200000,
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "Academic Orchestra",
    audioFile: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png",
    bpm: 110,
    duration: 190000,
  },
  {
    id: "my-arts-all-human",
    title: "My art's all human, soul-deep and true",
    artist: "Michelle Diamond",
    audioFile: getAudioUrl("My art's all human, soul-deep and true.mp3"),
    coverArt: "/lovable-uploads/e52951f3-74b4-4f95-8ac4-6f6eaf3027ad.png",
    bpm: 110,
    duration: 249000,
  },
  {
    id: "indigenomics-ai",
    title: "Indigenomics AI, that's where we start",
    artist: "Carol Anne Hilton",
    audioFile: getAudioUrl("Indigenomics AI, that's where we start.mp3"),
    coverArt: "/lovable-uploads/2b274fdd-00f6-41b1-ba3d-5f21d65f87ab.png",
    bpm: 120,
    duration: 210000,
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
        
        <div className="flex items-center gap-3">
          {selectedSong?.coverArt && (
            <img 
              src={selectedSong.coverArt} 
              alt={`${selectedSong.title} cover`}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div className="text-center">
            <h1 className="font-bold">{selectedSong?.title}</h1>
            <p className="text-sm text-muted-foreground">{selectedSong?.artist}</p>
          </div>
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
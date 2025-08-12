import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Song, Difficulty, GameState, NotePattern } from "@/pages/Game";
import FretBoard from "./FretBoard";
import ScoreDisplay from "./ScoreDisplay";
import GameOverModal from "./GameOverModal";
import GameBoard3D from "./GameBoard3D";
import { HitEffect } from "./HitEffects";
import { FloatingTextItem } from "./FloatingText";
import { useHitDetection } from "@/hooks/useHitDetection";
import { Pause, Play, Square, Home } from "lucide-react";

interface GameBoardProps {
  song: Song;
  difficulty: Difficulty;
  gameState: GameState;
  score: number;
  combo: number;
  onGameStateChange: (state: GameState) => void;
  onScoreChange: (score: number) => void;
  onComboChange: (combo: number) => void;
  onGameOver: (finalScore: number) => void;
  onReturnToMenu: () => void;
}

// Generate simple note patterns based on difficulty
const generateNotePattern = (song: Song, difficulty: Difficulty): NotePattern[] => {
  const patterns: NotePattern[] = [];
  const noteInterval = {
    easy: 2000,     // 2 seconds
    medium: 1500,   // 1.5 seconds
    hard: 1000,     // 1 second
    expert: 750     // 0.75 seconds
  }[difficulty];

  const maxFrets = {
    easy: 2,        // Only green and red
    medium: 3,      // Green, red, yellow
    hard: 4,        // Green, red, yellow, blue
    expert: 5       // All frets
  }[difficulty];

  // Generate notes throughout the song
  for (let time = 3000; time < song.duration - 5000; time += noteInterval) {
    const isChord = difficulty === "expert" && Math.random() < 0.2; // 20% chance for chords on expert
    
    if (isChord) {
      // Generate chord (2-3 frets)
      const numFrets = Math.random() < 0.5 ? 2 : 3;
      const frets: number[] = [];
      while (frets.length < numFrets) {
        const fret = Math.floor(Math.random() * maxFrets);
        if (!frets.includes(fret)) {
          frets.push(fret);
        }
      }
      patterns.push({ time, frets: frets.sort(), type: "chord" });
    } else {
      // Single note
      const fret = Math.floor(Math.random() * maxFrets);
      patterns.push({ time, frets: [fret], type: "single" });
    }
  }

  console.log(`Generated ${patterns.length} notes for ${song.title}:`, patterns.slice(0, 5));
  return patterns;
};

const GameBoard = ({
  song,
  difficulty,
  gameState,
  score,
  combo,
  onGameStateChange,
  onScoreChange,
  onComboChange,
  onGameOver,
  onReturnToMenu
}: GameBoardProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<NotePattern[]>([]);
  const [activeNotes, setActiveNotes] = useState<NotePattern[]>([]);
  const [pressedFrets, setPressedFrets] = useState<Set<number>>(new Set());
  const [accuracy, setAccuracy] = useState(100);
  const [notesHit, setNotesHit] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  // Hit detection system
  const { processHit, processMiss, resetStats, getStats } = useHitDetection();

  // Initialize game
  useEffect(() => {
    const audio = new Audio(song.audioFile);
    audioRef.current = audio;
    
    const generatedNotes = generateNotePattern(song, difficulty);
    setNotes(generatedNotes);
    setTotalNotes(generatedNotes.length);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [song, difficulty]);

  // Handle game state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (gameState === "playing") {
      audio.play().catch(console.error);
    } else if (gameState === "paused") {
      audio.pause();
    }
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const time = audio.currentTime * 1000;
      setCurrentTime(time);

      // Check if song ended
      if (audio.ended) {
        onGameOver(score);
        return;
      }

      // Update active notes (notes that should be visible on screen)
      const upcoming = notes.filter(note => 
        note.time > time - 1000 && note.time < time + 5000 // 6 second window
      );
      
      if (upcoming.length !== activeNotes.length) {
        console.log(`Time: ${time.toFixed(0)}ms, Active notes: ${upcoming.length}`);
      }
      
      setActiveNotes(upcoming);

      // Check for missed notes (increased window to 150ms)
      const missedNotes = notes.filter(note => 
        note.time < time - 150 && note.time > time - 200
      );
      
      if (missedNotes.length > 0) {
        missedNotes.forEach(note => {
          // Add miss effect
          const fretPositions = [-1.5, -0.75, 0, 0.75, 1.5];
          note.frets.forEach(fret => {
            addHitEffect('miss', [fretPositions[fret], 0, 0]);
            addFloatingText('MISS', 'miss', [fretPositions[fret], 1, 0], 0);
          });
          processMiss();
        });
        
        onComboChange(0);
        setNotes(prev => prev.filter(note => !missedNotes.includes(note)));
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [gameState, notes, score, onGameOver, onComboChange, activeNotes.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      const fretMap: { [key: string]: number } = {
        'a': 0, 'A': 0,  // Green
        's': 1, 'S': 1,  // Red
        'd': 2, 'D': 2,  // Yellow
        'f': 3, 'F': 3,  // Blue
        'g': 4, 'G': 4   // Orange
      };

      if (fretMap[e.key] !== undefined) {
        setPressedFrets(prev => new Set([...prev, fretMap[e.key]]));
      }

      // Spacebar to strum
      if (e.code === 'Space') {
        e.preventDefault();
        handleStrum();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const fretMap: { [key: string]: number } = {
        'a': 0, 'A': 0,
        's': 1, 'S': 1,
        'd': 2, 'D': 2,
        'f': 3, 'F': 3,
        'g': 4, 'G': 4
      };

      if (fretMap[e.key] !== undefined) {
        setPressedFrets(prev => {
          const newSet = new Set(prev);
          newSet.delete(fretMap[e.key]);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Helper functions for effects
  const addHitEffect = (grade: 'perfect' | 'good' | 'okay' | 'miss', position: [number, number, number]) => {
    const effect: HitEffect = {
      id: Math.random().toString(36),
      position: { x: position[0], y: position[1], z: position[2] },
      grade,
      age: 0,
      maxAge: grade === 'miss' ? 800 : 600
    };
    setHitEffects(prev => [...prev, effect]);
  };

  const addFloatingText = (text: string, grade: 'perfect' | 'good' | 'okay' | 'miss', position: [number, number, number], points: number) => {
    const floatingText: FloatingTextItem = {
      id: Math.random().toString(36),
      text: points > 0 ? `+${points} ${text.toUpperCase()}` : text,
      grade,
      position,
      age: 0,
      maxAge: 1500
    };
    setFloatingTexts(prev => [...prev, floatingText]);
  };

  const handleStrum = () => {
    const currentTimeMs = currentTime;

    // Find notes within extended hit window for detection
    const hittableNotes = notes.filter(note => 
      Math.abs(note.time - currentTimeMs) <= 100 // 100ms max window
    );

    if (hittableNotes.length === 0) return;

    // Get the closest note
    const closestNote = hittableNotes.reduce((closest, note) => 
      Math.abs(note.time - currentTimeMs) < Math.abs(closest.time - currentTimeMs) ? note : closest
    );

    // Check if pressed frets match the note
    const requiredFrets = new Set(closestNote.frets);
    const pressedFretsArray = Array.from(pressedFrets);
    
    const isCorrect = requiredFrets.size === pressedFrets.size && 
                     pressedFretsArray.every(fret => requiredFrets.has(fret));

    const fretPositions = [-1.5, -0.75, 0, 0.75, 1.5];

    if (isCorrect) {
      // Calculate timing and hit grade
      const timingDiff = closestNote.time - currentTimeMs;
      const isChord = closestNote.type === "chord";
      const hitResult = processHit(timingDiff, isChord, combo);

      if (hitResult.grade !== 'miss') {
        // Successful hit
        const newCombo = combo + 1;
        onComboChange(newCombo);
        onScoreChange(score + hitResult.points);
        setNotesHit(prev => prev + 1);

        // Add visual effects for each fret
        closestNote.frets.forEach(fret => {
          addHitEffect(hitResult.grade, [fretPositions[fret], 0, 0]);
          addFloatingText(hitResult.grade, hitResult.grade, [fretPositions[fret], 1, 0], hitResult.points);
        });

        // Remove hit note
        setNotes(prev => prev.filter(n => n !== closestNote));
      } else {
        // Miss due to bad timing
        onComboChange(0);
        closestNote.frets.forEach(fret => {
          addHitEffect('miss', [fretPositions[fret], 0, 0]);
          addFloatingText('MISS', 'miss', [fretPositions[fret], 1, 0], 0);
        });
      }
    } else {
      // Wrong frets pressed
      onComboChange(0);
      // Show miss effect on the note's frets
      closestNote.frets.forEach(fret => {
        addHitEffect('miss', [fretPositions[fret], 0, 0]);
        addFloatingText('MISS', 'miss', [fretPositions[fret], 1, 0], 0);
      });
    }

    // Update accuracy using hit detection stats
    const stats = getStats();
    setAccuracy(stats.accuracy);
  };

  // Effect cleanup handlers
  const handleEffectComplete = (id: string) => {
    setHitEffects(prev => prev.filter(effect => effect.id !== id));
  };

  const handleTextComplete = (id: string) => {
    setFloatingTexts(prev => prev.filter(text => text.id !== id));
  };

  const handlePauseToggle = () => {
    onGameStateChange(gameState === "playing" ? "paused" : "playing");
  };

  const handleStop = () => {
    onGameOver(score);
  };

  const progress = (currentTime / song.duration) * 100;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background via-background/95 to-background">
      {/* Game Controls - Fixed Height */}
      <div className="h-16 bg-card/30 backdrop-blur-sm border-b border-border/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePauseToggle}
            className="flex items-center gap-2"
          >
            {gameState === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {gameState === "playing" ? "Pause" : "Resume"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReturnToMenu}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Menu
          </Button>
        </div>

        <ScoreDisplay 
          score={score}
          combo={combo}
          accuracy={accuracy}
        />
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 shrink-0">
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1 text-center">
          {Math.floor(currentTime / 1000)}s / {Math.floor(song.duration / 1000)}s
        </div>
      </div>

      {/* 3D Game Area - Takes remaining space */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <GameBoard3D 
            activeNotes={activeNotes}
            currentTime={currentTime}
            pressedFrets={pressedFrets}
            hitEffects={hitEffects}
            floatingTexts={floatingTexts}
            onEffectComplete={handleEffectComplete}
            onTextComplete={handleTextComplete}
          />
        </div>
        
        {/* Debug overlay */}
        <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-xs">
          <div>Time: {currentTime.toFixed(0)}ms</div>
          <div>Active Notes: {activeNotes.length}</div>
          <div>Pressed: [{Array.from(pressedFrets).join(', ')}]</div>
        </div>
      </div>

      {/* Fret Board - Fixed Height */}
      <div className="h-32 shrink-0">
        <FretBoard 
          pressedFrets={pressedFrets}
          onStrum={handleStrum}
        />
      </div>

      {/* Pause Overlay */}
      {gameState === "paused" && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Game Paused</h2>
            <Button onClick={handlePauseToggle} size="lg">
              <Play className="mr-2 w-5 h-5" />
              Resume
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === "gameOver" && (
        <GameOverModal
          score={score}
          accuracy={accuracy}
          song={song}
          difficulty={difficulty}
          onReturnToMenu={onReturnToMenu}
          onPlayAgain={() => {
            onGameStateChange("playing");
            onScoreChange(0);
            onComboChange(0);
            setCurrentTime(0);
            setNotesHit(0);
            setAccuracy(100);
            setHitEffects([]);
            setFloatingTexts([]);
            resetStats();
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
            }
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;
import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
import deepfakesCover from "@/assets/deepfakes-cover.jpg";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";

const SONGS = [
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK / BCAI",
    src: "/Deepfakes in the Rain_KK_BCAI.mp3",
    coverArt: deepfakesCover,
    lyrics: [
      { time: 0, text: "In the digital rain we fall" },
      { time: 3.5, text: "Where reality bends and breaks" },
      { time: 7, text: "Synthetic faces on the wall" },
      { time: 10.5, text: "Nothing here is what it takes" },
      { time: 14, text: "" },
      { time: 16, text: "AI dreams in neon light" },
      { time: 19.5, text: "Deepfakes dancing in the storm" },
      { time: 23, text: "Binary tears fall through the night" },
      { time: 26.5, text: "Truth and lies begin to swarm" },
      { time: 30, text: "" },
      { time: 32, text: "Deepfakes in the rain" },
      { time: 35.5, text: "Washing truth away" },
      { time: 39, text: "In this digital domain" },
      { time: 42.5, text: "Nothing's real today" },
      { time: 46, text: "" },
      { time: 48, text: "The algorithms learn to lie" },
      { time: 51.5, text: "Creating faces from thin air" },
      { time: 55, text: "While we watch our world collide" },
      { time: 58.5, text: "With the artificial nightmare" }
    ] as LyricLine[]
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard",
    artist: "Unknown Artist",
    src: "/Mr_Pixel_Wizard.mp3",
    coverArt: pixelWizardCover,
    lyrics: [
      { time: 0, text: "In a land of ones and zeros" },
      { time: 3.5, text: "Lives a wizard made of light" },
      { time: 7, text: "Casting spells with pixel heroes" },
      { time: 10.5, text: "Through the endless digital night" },
      { time: 14, text: "" },
      { time: 16, text: "Mr. Pixel Wizard stands" },
      { time: 19.5, text: "With his staff of glowing code" },
      { time: 23, text: "Magic flows from 8-bit hands" },
      { time: 26.5, text: "Down the retro data road" },
      { time: 30, text: "" },
      { time: 32, text: "Pixel magic in the air" },
      { time: 35.5, text: "Sprites and bits everywhere" },
      { time: 39, text: "In his castle made of squares" },
      { time: 42.5, text: "Mr. Wizard always cares" },
      { time: 46, text: "" },
      { time: 48, text: "Level up and power through" },
      { time: 51.5, text: "Pixelated dreams come true" },
      { time: 55, text: "In this world of retro hue" },
      { time: 58.5, text: "Magic waits for me and you" }
    ] as LyricLine[]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "Academic Orchestra",
    src: "/Dr. Patrick Parra Pennefather.mp3",
    coverArt: "/lovable-uploads/fc226621-2faf-4a33-8885-28d7dc934861.png",
    lyrics: [
      { time: 0, text: "In the halls of learning high" },
      { time: 3.5, text: "Dr. Patrick leads the way" },
      { time: 7, text: "With his wisdom reaching sky" },
      { time: 10.5, text: "Teaching truth both night and day" },
      { time: 14, text: "" },
      { time: 16, text: "Parra Pennefather stands tall" },
      { time: 19.5, text: "In his office lined with books" },
      { time: 23, text: "Knowledge flowing to us all" },
      { time: 26.5, text: "From his scholarly looks" },
      { time: 30, text: "" },
      { time: 32, text: "Doctor Patrick, wise and true" },
      { time: 35.5, text: "Sharing all that he has learned" },
      { time: 39, text: "Every lesson something new" },
      { time: 42.5, text: "Every page that has been turned" },
      { time: 46, text: "" },
      { time: 48, text: "In the classroom, by the fire" },
      { time: 51.5, text: "Students gather round to hear" },
      { time: 55, text: "Words that lift our spirits higher" },
      { time: 58.5, text: "Making complex concepts clear" }
    ] as LyricLine[]
  }
];

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

const AudioPlayer: React.FC = () => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0-100
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = React.useState(false);
  const [lyricsOpen, setLyricsOpen] = React.useState(false);
  
  const currentSong = SONGS[currentSongIndex];

  React.useEffect(() => {
    const audio = new Audio(currentSong.src);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(pct);
    };
    const onEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next song
      if (currentSongIndex < SONGS.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1);
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    // Reset states when song changes
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setAutoplayBlocked(false);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [currentSong, currentSongIndex]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch (e) {
        setAutoplayBlocked(true);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const onSeek = (vals: number[]) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = vals[0];
    const newTime = (pct / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(pct);
  };

  const onSongChange = (songId: string) => {
    const songIndex = SONGS.findIndex(s => s.id === songId);
    if (songIndex !== -1) {
      setCurrentSongIndex(songIndex);
    }
  };

  const goToPreviousSong = () => {
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : SONGS.length - 1;
    setCurrentSongIndex(newIndex);
  };

  const goToNextSong = () => {
    const newIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-[520px]">
      <div className="rounded-xl border bg-card text-card-foreground shadow-md">
        <div className="p-4 space-y-4">
          {/* Song Selection */}
          <div className="flex items-center gap-3">
            <Select value={currentSong.id} onValueChange={onSongChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a song" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {SONGS.map((song) => (
                  <SelectItem key={song.id} value={song.id}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={song.coverArt} 
                        alt={`${song.title} cover`} 
                        className="w-8 h-8 object-cover rounded" 
                      />
                      <span>{song.title} — {song.artist}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Player Layout */}
          <div className="flex items-center gap-4">
            {/* Larger Cover Art */}
            <div className="flex-shrink-0">
              <img 
                src={currentSong.coverArt} 
                alt={`${currentSong.title} cover`} 
                className="w-20 h-20 object-cover rounded-lg border shadow-sm" 
              />
            </div>

            {/* Controls and Info */}
            <div className="flex-1 space-y-3">
              {/* Song Info */}
              <div className="text-center">
                <h3 className="font-semibold text-sm truncate">{currentSong.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
              </div>

              {/* Navigation and Play Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Previous Song"
                  onClick={goToPreviousSong}
                >
                  <SkipBack size={16} />
                </button>

                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Next Song"
                  onClick={goToNextSong}
                >
                  <SkipForward size={16} />
                </button>

                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  aria-label="Stop"
                  onClick={stop}
                >
                  <StopCircle size={16} />
                </button>
              </div>

              {/* Progress and Time */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider value={[progress]} max={100} step={0.1} onValueChange={onSeek} aria-label="Seek" />
                {autoplayBlocked && (
                  <p className="text-xs text-muted-foreground text-center">Autoplay blocked. Press play to start.</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Dialog open={lyricsOpen} onOpenChange={setLyricsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText size={14} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{currentSong.title} - Lyrics</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-2">
                      {currentSong.lyrics.map((line, index) => (
                        <p key={index} className="text-sm leading-relaxed">
                          {line.text || "\u00A0"}
                        </p>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Button variant="secondary" size="sm" asChild>
                <a href={currentSong.src} download aria-label="Download MP3">
                  <Download size={14} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import deepfakesCover from "@/assets/deepfakes-cover.jpg";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";

const SONGS = [
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK / BCAI",
    src: "/Deepfakes in the Rain_KK_BCAI.mp3",
    coverArt: deepfakesCover,
    lyrics: `In the digital rain we fall
Where reality bends and breaks
Synthetic faces on the wall
Nothing here is what it takes

AI dreams in neon light
Deepfakes dancing in the storm
Binary tears fall through the night
Truth and lies begin to swarm

Chorus:
Deepfakes in the rain
Washing truth away
In this digital domain
Nothing's real today

The algorithms learn to lie
Creating faces from thin air
While we watch our world collide
With the artificial nightmare`
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard",
    artist: "Unknown Artist",
    src: "/Mr_Pixel_Wizard.mp3",
    coverArt: pixelWizardCover,
    lyrics: `In a land of ones and zeros
Lives a wizard made of light
Casting spells with pixel heroes
Through the endless digital night

Mr. Pixel Wizard stands
With his staff of glowing code
Magic flows from 8-bit hands
Down the retro data road

Chorus:
Pixel magic in the air
Sprites and bits everywhere
In his castle made of squares
Mr. Wizard always cares

Level up and power through
Pixelated dreams come true
In this world of retro hue
Magic waits for me and you`
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText size={14} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{currentSong.title} - Lyrics</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-80">
                    <div className="whitespace-pre-line text-sm leading-relaxed p-4">
                      {currentSong.lyrics}
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

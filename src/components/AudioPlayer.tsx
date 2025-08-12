import React from "react";
import { Play, Pause, StopCircle, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SONGS = [
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK / BCAI",
    src: "/Deepfakes in the Rain_KK_BCAI.mp3",
    coverArt: null
  },
  {
    id: "pixel-wizard",
    title: "Mr. Pixel Wizard",
    artist: "Unknown Artist",
    src: "/Mr_Pixel_Wizard.mp3",
    coverArt: null
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
  const [currentSong, setCurrentSong] = React.useState(SONGS[0]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0-100
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = React.useState(false);

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
    const onEnded = () => setIsPlaying(false);

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
  }, [currentSong]);

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
    const song = SONGS.find(s => s.id === songId);
    if (song) {
      setCurrentSong(song);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-[480px]">
      <div className="rounded-xl border bg-card text-card-foreground shadow-md">
        <div className="p-3 space-y-3">
          {/* Song Selection */}
          <div className="flex items-center gap-3">
            <Select value={currentSong.id} onValueChange={onSongChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a song" />
              </SelectTrigger>
              <SelectContent>
                {SONGS.map((song) => (
                  <SelectItem key={song.id} value={song.id}>
                    {song.title} — {song.artist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-3">
            {/* Cover Art */}
            <div className="flex-shrink-0 w-12 h-12 rounded-md border bg-muted flex items-center justify-center">
              {currentSong.coverArt ? (
                <img src={currentSong.coverArt} alt={`${currentSong.title} cover`} className="w-full h-full object-cover rounded-md" />
              ) : (
                <Music className="w-6 h-6 text-muted-foreground" />
              )}
            </div>

            {/* Play/Stop Controls */}
            <div className="flex gap-2">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Stop"
                onClick={stop}
              >
                <StopCircle size={18} />
              </button>
            </div>

            {/* Song Info and Progress */}
            <div className="flex min-w-0 grow flex-col">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate font-medium">{currentSong.title} — {currentSong.artist}</span>
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
              <div className="pt-1">
                <Slider value={[progress]} max={100} step={0.1} onValueChange={onSeek} aria-label="Seek" />
              </div>
              {autoplayBlocked && (
                <p className="pt-1 text-xs text-muted-foreground">Autoplay was blocked by your browser. Press play to start.</p>
              )}
            </div>

            {/* Download Button */}
            <Button variant="secondary" size="sm" asChild>
              <a href={currentSong.src} download aria-label="Download MP3">
                <Download size={16} className="mr-1" /> Download
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

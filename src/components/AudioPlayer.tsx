import React from "react";
import { Play, Pause, StopCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const AUDIO_SRC = "/Deepfakes in the Rain_KK_BCAI.mp3";

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
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0-100
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = React.useState(false);

  React.useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
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

    // Try to autoplay on mount
    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        // Most browsers block autoplay with sound without user gesture
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    };

    tryPlay();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, []);

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

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:w-[420px]">
      <div className="rounded-xl border bg-card text-card-foreground shadow-md">
        <div className="flex items-center gap-3 p-3">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Stop"
            onClick={stop}
          >
            <StopCircle />
          </button>

          <div className="flex min-w-0 grow flex-col">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate font-medium">Deepfakes in the Rain — KK / BCAI</span>
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
            <div className="pt-1">
              <Slider value={[progress]} max={100} step={0.1} onValueChange={onSeek} aria-label="Seek" />
            </div>
            {autoplayBlocked && (
              <p className="pt-1 text-xs text-muted-foreground">Autoplay was blocked by your browser. Press play to start.</p>
            )}
          </div>

          <Button variant="secondary" size="sm" asChild>
            <a href={AUDIO_SRC} download aria-label="Download MP3">
              <Download className="mr-1" /> Download
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

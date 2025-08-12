import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, Repeat, Repeat1, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
import deepfakesCover from "@/assets/deepfakes-cover.jpg";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";
import pixelWizardBcCover from "@/assets/pixel-wizard-bc-ai-cover.jpg";
import macCover from "@/assets/mac-cover.jpg";
import hrMacMillanCover from "@/assets/hr-macmillan-alien-cover.jpg";
import bcAiHackathonCover from "@/assets/bc-ai-hackathon-cover.jpg";

// Supabase Storage URLs for audio files and cover images
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${filename}`;
const getCoverUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/cover-images/${filename}`;

const SONGS = [
  {
    id: "bc-ai-hackathon",
    title: "BC AI Hackathon by Rival Tech",
    artist: "Digital BC AI Girl",
    src: getAudioUrl("BC AI Hackathon by Rival Tech.mp3"),
    coverArt: getCoverUrl("bc-ai-hackathon-cover.jpg"),
    lyrics: [
      { time: 0, text: "Code flows through the digital night" },
      { time: 4, text: "BC AI hackathon has begun" },
      { time: 8, text: "Rival Tech brings innovation bright" },
      { time: 12, text: "Building futures, one by one" },
      { time: 16, text: "" },
      { time: 18, text: "Digital minds collaborate" },
      { time: 22, text: "In Vancouver's tech-filled halls" },
      { time: 26, text: "Creating what we innovate" },
      { time: 30, text: "As inspiration calls" },
      { time: 34, text: "" },
      { time: 36, text: "BC AI hackathon dreams" },
      { time: 40, text: "Technology meets art" },
      { time: 44, text: "Building tomorrow's schemes" },
      { time: 48, text: "With a digital heart" }
    ] as LyricLine[]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Loki Jörgenson",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: getCoverUrl("mac-cover.jpg"),
    lyrics: [
      { time: 0, text: "What is consciousness in the age of AI?" },
      { time: 4, text: "Questions that keep us awake at night" },
      { time: 8, text: "Mind and machine begin to tie" },
      { time: 12, text: "The future burning ever bright" },
      { time: 16, text: "" },
      { time: 18, text: "MAC - the mystery unfolds" },
      { time: 22, text: "In neural networks deep and wide" },
      { time: 26, text: "Stories that have never been told" },
      { time: 30, text: "Where human and AI collide" },
      { time: 34, text: "" },
      { time: 36, text: "Consciousness flows like data streams" },
      { time: 40, text: "Through silicon and flesh alike" },
      { time: 44, text: "The boundary blurs in AI dreams" },
      { time: 48, text: "What it means to be alive" }
    ] as LyricLine[]
  },
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "KK / BCAI",
    src: getAudioUrl("Deepfakes in the Rain_KK_BCAI.mp3"),
    coverArt: getCoverUrl("deepfakes-cover.jpg"),
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
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: getCoverUrl("pixel-wizard-cover.jpg"),
    lyrics: [
      { time: 0, text: "In the realm of digital art" },
      { time: 3.5, text: "Mr. Pixel Wizard stands" },
      { time: 7, text: "Creating magic, bit by part" },
      { time: 10.5, text: "With his algorithmic hands" },
      { time: 14, text: "" },
      { time: 16, text: "Pixels dance at his command" },
      { time: 19.5, text: "Colors flow like liquid light" },
      { time: 23, text: "In this artificial land" },
      { time: 26.5, text: "Beauty born from code so bright" },
      { time: 30, text: "" },
      { time: 32, text: "Mr. Pixel Wizard weaves" },
      { time: 35.5, text: "Dreams in binary streams" },
      { time: 39, text: "What the digital mind believes" },
      { time: 42.5, text: "Nothing's quite what it seems" }
    ] as LyricLine[]
  },
  {
    id: "dr-patrick",
    title: "Dr. Patrick Parra Pennefather",
    artist: "Academic Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: getCoverUrl("dr-patrick-cover.jpg"),
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
  const [hasUserInteracted, setHasUserInteracted] = React.useState(false);
  const [audioError, setAudioError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fileAvailable, setFileAvailable] = React.useState<boolean | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);
  const [showLyricsOnly, setShowLyricsOnly] = React.useState(false);
  const [playbackMode, setPlaybackMode] = React.useState<"off" | "next" | "repeat" | "repeat-all">("next");
  
  const currentSong = SONGS[currentSongIndex];
  
  // Check file availability with retry mechanism
  React.useEffect(() => {
    const checkFileAvailability = async (attempt = 1) => {
      setIsLoading(true);
      setFileAvailable(null);
      setAudioError(null);
      
      try {
        const response = await fetch(currentSong.src, { 
          method: 'HEAD',
          cache: 'no-cache' // Ensure fresh check
        });
        if (response.ok) {
          setFileAvailable(true);
          setRetryCount(0);
          setShowLyricsOnly(false);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Audio file check failed (attempt ${attempt}):`, error);
        
        if (attempt < 3) {
          // Retry up to 3 times with exponential backoff
          setTimeout(() => {
            setRetryCount(attempt);
            checkFileAvailability(attempt + 1);
          }, Math.pow(2, attempt) * 1000);
        } else {
          setFileAvailable(false);
          setRetryCount(attempt);
          setAudioError(`Unable to load "${currentSong.title}" after ${attempt} attempts. File may not be available.`);
          // Offer lyrics-only mode as fallback
          setShowLyricsOnly(true);
        }
      } finally {
        if (attempt >= 3 || fileAvailable !== false) {
          setIsLoading(false);
        }
      }
    };
    
    checkFileAvailability();
  }, [currentSong.src]);

  React.useEffect(() => {
    // Don't create audio element if file is not available
    if (fileAvailable === false) {
      return;
    }
    
    const audio = new Audio(currentSong.src);
    audioRef.current = audio;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
      setIsLoading(false);
    };
    
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProgress(pct);
    };
    
    const onError = () => {
      setAudioError(`Failed to load "${currentSong.title}". The audio file may not be available.`);
      setIsPlaying(false);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      
      // Only auto-advance if user has interacted with the player
      if (!hasUserInteracted) return;
      
      // Handle different playback modes
      switch (playbackMode) {
        case "next":
          if (currentSongIndex < SONGS.length - 1) {
            setCurrentSongIndex(currentSongIndex + 1);
            // Auto-play will be handled in useEffect
            setTimeout(() => {
              const newAudio = audioRef.current;
              if (newAudio) {
                newAudio.play().then(() => {
                  setIsPlaying(true);
                }).catch(() => setAutoplayBlocked(true));
              }
            }, 100);
          }
          break;
        case "repeat":
          // Repeat current song
          audio.currentTime = 0;
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
          break;
        case "repeat-all":
          // Go to next song, or loop back to first
          const nextIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
          setCurrentSongIndex(nextIndex);
          // Auto-play will be handled in useEffect
          setTimeout(() => {
            const newAudio = audioRef.current;
            if (newAudio) {
              newAudio.play().then(() => {
                setIsPlaying(true);
              }).catch(() => setAutoplayBlocked(true));
            }
          }, 100);
          break;
        case "off":
        default:
          // Do nothing
          break;
      }
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // Reset states when song changes
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setAutoplayBlocked(false);
    setAudioError(null);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [currentSong, currentSongIndex, hasUserInteracted, playbackMode, fileAvailable]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || fileAvailable === false) return;
    
    // Mark that user has interacted with the player
    setHasUserInteracted(true);
    
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        setAudioError(null);
      } catch (e) {
        console.error('Audio play failed:', e);
        setAutoplayBlocked(true);
        setAudioError('Autoplay blocked by browser. Please click play to start.');
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

  const retryFileLoad = () => {
    setRetryCount(0);
    setShowLyricsOnly(false);
    // Trigger re-check by updating the effect dependency
    const currentSrc = currentSong.src;
    setFileAvailable(null);
    // Force a re-render to trigger the effect
    setTimeout(() => {
      // This will trigger the useEffect again
    }, 100);
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
    setHasUserInteracted(true);
    const wasPlaying = isPlaying;
    const newIndex = currentSongIndex > 0 ? currentSongIndex - 1 : SONGS.length - 1;
    setCurrentSongIndex(newIndex);
    
    // Auto-play if currently playing and user has interacted
    if (wasPlaying && hasUserInteracted) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
        }
      }, 100);
    }
  };

  const goToNextSong = () => {
    setHasUserInteracted(true);
    const wasPlaying = isPlaying;
    const newIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(newIndex);
    
    // Auto-play if currently playing and user has interacted
    if (wasPlaying && hasUserInteracted) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
        }
      }, 100);
    }
  };

  const togglePlaybackMode = () => {
    const modes: Array<"off" | "next" | "repeat" | "repeat-all"> = ["off", "next", "repeat", "repeat-all"];
    const currentIndex = modes.indexOf(playbackMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlaybackMode(modes[nextIndex]);
  };

  const getPlaybackModeIcon = () => {
    switch (playbackMode) {
      case "off":
        return <StopCircle size={14} />;
      case "next":
        return <ArrowRight size={14} />;
      case "repeat":
        return <Repeat1 size={14} />;
      case "repeat-all":
        return <Repeat size={14} />;
      default:
        return <ArrowRight size={14} />;
    }
  };

  const getPlaybackModeLabel = () => {
    switch (playbackMode) {
      case "off":
        return "No auto-play";
      case "next":
        return "Auto-play next";
      case "repeat":
        return "Repeat current";
      case "repeat-all":
        return "Repeat all";
      default:
        return "Auto-play next";
    }
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
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
                    fileAvailable === false 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
                      : 'bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={togglePlay}
                  disabled={fileAvailable === false || isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  ) : isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}
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
              </div>
              
              {/* Enhanced Status Messages */}
              {isLoading && (
                <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                  <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full" />
                  {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Checking audio availability...'}
                </div>
              )}
              
              {audioError && (
                <div className="text-xs text-destructive text-center bg-destructive/10 p-3 rounded space-y-2">
                  <div>{audioError}</div>
                  {fileAvailable === false && (
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={retryFileLoad}
                      className="px-2 py-1 text-xs bg-destructive/20 hover:bg-destructive/30 rounded transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                  )}
                </div>
              )}
              
              {fileAvailable === false && !audioError && showLyricsOnly && (
                <div className="text-xs text-amber-600 dark:text-amber-400 text-center bg-amber-500/10 p-3 rounded">
                  📁 Audio file is not available. Please upload the MP3 files to the public directory.
                </div>
              )}
              
              {autoplayBlocked && !audioError && fileAvailable && (
                <div className="text-xs text-amber-600 dark:text-amber-400 text-center bg-amber-500/10 p-2 rounded">
                  🎵 Ready to play! Click the play button to start.
                </div>
              )}
              
              {!hasUserInteracted && !autoplayBlocked && !audioError && fileAvailable && !isLoading && (
                <div className="text-xs text-muted-foreground text-center">
                  Click play to begin listening to the BC AI Hackathon podcast
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={togglePlaybackMode}
                title={getPlaybackModeLabel()}
                aria-label={getPlaybackModeLabel()}
              >
                {getPlaybackModeIcon()}
              </Button>


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

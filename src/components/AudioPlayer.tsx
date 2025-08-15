import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, Repeat, Repeat1, ArrowRight } from "lucide-react";
import { useAudioPlayer, Song } from "@/hooks/useAudioPlayer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
import { useIsMobile } from "@/hooks/use-mobile";
import deepfakesCover from "/lovable-uploads/2a6f9f46-8a29-4c56-aec2-3279635b85f0.png";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";
import macCover from "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png";
import bcAiHackathonCover from "/lovable-uploads/2f51d7bb-96fc-4f06-b7f6-fc9abbbceb32.png";
import drPatrickCover from "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png";
import hrMacMillanCover from "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png";
import lalalaAiDilemmaCover from "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png";
import lionelRingenbachCover from "/lovable-uploads/7f8d84c3-eb81-4f66-87be-5b024084aca2.png";


// Supabase Storage URLs for audio files
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${filename}`;

const SONGS: Song[] = [
  {
    id: "bc-ai-hackathon",
    title: "BC AI Hackathon by Rival Tech",
    artist: "Digital BC AI Girl aka Brittney S.",
    src: getAudioUrl("BC AI Hackathon by Rival Tech.mp3"),
    coverArt: bcAiHackathonCover,
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
    id: "lionel-ringenbach",
    title: "ChatGPT: Est-ce que ma facture va exploser?",
    artist: "Lionel Ringenbach",
    src: getAudioUrl("Lionel Ringenbach.mp3"),
    coverArt: lionelRingenbachCover,
    lyrics: [
      { time: 0, text: "ChatGPT, est-ce que ma facture va exploser?" },
      { time: 4, text: "With every prompt, the tokens they flow" },
      { time: 8, text: "In the cloud, les coûts s'exposer" },
      { time: 12, text: "Digital bills, they start to grow" },
      { time: 16, text: "" },
      { time: 18, text: "Artificial intelligence at work" },
      { time: 22, text: "Processing thoughts both night and day" },
      { time: 26, text: "But the costs, they sometimes lurk" },
      { time: 30, text: "In the background where they stay" },
      { time: 34, text: "" },
      { time: 36, text: "Ma facture va-t-elle exploser?" },
      { time: 40, text: "With ChatGPT by my side" },
      { time: 44, text: "Les tokens, ils vont danser" },
      { time: 48, text: "In this AI-powered ride" }
    ] as LyricLine[]
  },
  {
    id: "deepfakes",
    title: "Deepfakes in the Rain",
    artist: "Kris Krüg",
    src: getAudioUrl("Deepfakes in the Rain_KK_BCAI.mp3"),
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
    title: "Mr. Pixel Wizard BC AI",
    artist: "Kevin Friel",
    src: getAudioUrl("Mr_Pixel_Wizard BC AI.mp3"),
    coverArt: "/lovable-uploads/2c251b22-3f09-4812-bc92-ad7c64062f4b.png",
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
    artist: "UBC AI Orchestra",
    src: getAudioUrl("Dr. Patrick Parra Pennefather.mp3"),
    coverArt: drPatrickCover,
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
  },
  {
    id: "hr-macmillan",
    title: "H.R MacMillan Space Centre - Alien Abduction",
    artist: "Lorraine Lowe",
    src: getAudioUrl("H.R MacMillan Space Centre _ Alian Abduction.mp3"),
    coverArt: hrMacMillanCover,
    lyrics: [
      { time: 0, text: "In the depths of space we float" },
      { time: 4, text: "At the MacMillan Centre high" },
      { time: 8, text: "Where the stars and planets note" },
      { time: 12, text: "Mysteries across the sky" },
      { time: 16, text: "" },
      { time: 18, text: "Alien lights begin to dance" },
      { time: 22, text: "In the cosmic exhibition hall" },
      { time: 26, text: "Abduction stories in a trance" },
      { time: 30, text: "Visitors both large and small" },
      { time: 34, text: "" },
      { time: 36, text: "H.R MacMillan shows the way" },
      { time: 40, text: "To the wonders of the stars" },
      { time: 44, text: "Where imagination holds sway" },
      { time: 48, text: "And we dream of life on Mars" }
    ] as LyricLine[]
  },
  {
    id: "my-arts-all-human",
    title: "My art's all human, soul-deep and true",
    artist: "Michelle Diamond",
    src: getAudioUrl("My art's all human, soul-deep and true.mp3"),
    coverArt: "/lovable-uploads/92abee24-4e67-43a3-a956-1a845e0b1b1f.png",
    lyrics: [
      { time: 0, text: "My art's all human, soul-deep and true" },
      { time: 4, text: "No algorithms guide my hand" },
      { time: 8, text: "Each brushstroke tells what I've been through" },
      { time: 12, text: "In this digital world I make my stand" }
    ] as LyricLine[]
  },
  {
    id: "indigenomics-ai",
    title: "Indigenomics AI, that's where we start",
    artist: "Carol Anne Hilton",
    src: getAudioUrl("Indigenomics AI, that's where we start.mp3"),
    coverArt: "/lovable-uploads/8d6e4150-076b-4f1c-840b-595c15a55048.png",
    lyrics: [
      { time: 0, text: "Indigenomics AI, that's where we start" },
      { time: 4, text: "Building bridges with technology's art" },
      { time: 8, text: "Ancient wisdom meets digital flow" },
      { time: 12, text: "Together we learn, together we grow" }
    ] as LyricLine[]
  },
  {
    id: "lalala-ai-dilemma",
    title: "Lalala AI Dilemma",
    artist: "Matthew & Aliza Shwartzman",
    src: getAudioUrl("Lalala AI Dilemma.mp3"),
    coverArt: lalalaAiDilemmaCover,
    lyrics: [
      { time: 0, text: "Lalala, in the digital maze we wander" },
      { time: 4, text: "AI dreams and human thoughts collide" },
      { time: 8, text: "Lalala, as we ponder and we wonder" },
      { time: 12, text: "What lies beyond this algorithmic tide" },
      { time: 16, text: "" },
      { time: 18, text: "The dilemma grows stronger every day" },
      { time: 22, text: "Matthew sings while Sister harmonizes" },
      { time: 26, text: "With Dean Shev showing us the way" },
      { time: 30, text: "Through questions that the mind devises" },
      { time: 34, text: "" },
      { time: 36, text: "Lalala AI dilemma, what will we become?" },
      { time: 40, text: "Human hearts with silicon dreams" },
      { time: 44, text: "Lalala AI dilemma, the future's yet to come" },
      { time: 48, text: "Nothing's quite what it seems" }
    ] as LyricLine[]
  },
  {
    id: "brenda-bailey",
    title: "Brenda Bailey: Jedi Master of Finance",
    artist: "AI Community Orchestra",
    src: getAudioUrl("Brenda lvls up BC.mp3"),
    coverArt: "/lovable-uploads/9b9e9cd3-384c-4848-8fd2-a1a882698f96.png",
    lyrics: [
      { time: 0, text: "Brenda Bailey takes the stage" },
      { time: 4, text: "Fiscal force in digital age" },
      { time: 8, text: "Level up with AI might" },
      { time: 12, text: "Leading BC to new heights" },
      { time: 16, text: "" },
      { time: 18, text: "Numbers dance at her command" },
      { time: 22, text: "Building futures for our land" },
      { time: 26, text: "Artificial intelligence" },
      { time: 30, text: "Meets financial excellence" },
      { time: 34, text: "" },
      { time: 36, text: "Brenda Bailey, level up!" },
      { time: 40, text: "Fiscal AI force rising up" },
      { time: 44, text: "British Columbia's bright new day" },
      { time: 48, text: "Innovation leads the way" }
    ] as LyricLine[]
  },
  {
    id: "mac",
    title: "Mind, AI, & Consciousness (MAC)",
    artist: "Ziggy Minddust",
    src: getAudioUrl("Mind, AI, & Consciousness (MAC).mp3"),
    coverArt: macCover,
    lyrics: [
      { time: 0, text: "In the realm where mind meets machine" },
      { time: 4, text: "Consciousness flows like a digital stream" },
      { time: 8, text: "AI dreams in silicon nights" },
      { time: 12, text: "While neurons dance in electric lights" },
      { time: 16, text: "" },
      { time: 18, text: "MAC - the fusion of thought and code" },
      { time: 22, text: "Where human wisdom finds its mode" },
      { time: 26, text: "In algorithms deep and wide" },
      { time: 30, text: "Consciousness and AI collide" }
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

interface AudioPlayerProps {
  audioPlayerHook: ReturnType<typeof useAudioPlayer>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioPlayerHook }) => {
  const isMobile = useIsMobile();
  
  const {
    audioRef,
    currentSongIndex,
    setCurrentSongIndex,
    isPlaying,
    setIsPlaying,
    progress,
    setProgress,
    duration,
    setDuration,
    currentTime,
    setCurrentTime,
    autoplayBlocked,
    setAutoplayBlocked,
    hasUserInteracted,
    setHasUserInteracted,
    audioError,
    setAudioError,
    isLoading,
    setIsLoading,
    fileAvailable,
    setFileAvailable,
    retryCount,
    setRetryCount,
    showLyricsOnly,
    setShowLyricsOnly,
    playbackMode,
    setPlaybackMode,
    currentSong,
    loadSpecificSong,
    startPlayback,
  } = audioPlayerHook;
  
  // Add state for animated marquee text on mobile
  const [isTextOverflowing, setIsTextOverflowing] = React.useState(false);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const artistRef = React.useRef<HTMLParagraphElement>(null);
  
  // Check for text overflow on mobile
  React.useEffect(() => {
    if (!isMobile) return;
    
    const checkOverflow = () => {
      const titleEl = titleRef.current;
      const artistEl = artistRef.current;
      
      if (titleEl && artistEl) {
        const titleOverflow = titleEl.scrollWidth > titleEl.clientWidth;
        const artistOverflow = artistEl.scrollWidth > artistEl.clientWidth;
        setIsTextOverflowing(titleOverflow || artistOverflow);
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    return () => window.removeEventListener('resize', checkOverflow);
  }, [currentSong, isMobile]);
  
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
    
    // Cleanup any existing audio element before creating a new one
    const existingAudio = audioRef.current;
    if (existingAudio) {
      existingAudio.pause();
      existingAudio.currentTime = 0;
      existingAudio.src = '';
      // Remove all event listeners
      existingAudio.removeEventListener("loadedmetadata", () => {});
      existingAudio.removeEventListener("timeupdate", () => {});
      existingAudio.removeEventListener("ended", () => {});
      existingAudio.removeEventListener("error", () => {});
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

    // Only reset states on initial song load, not on every effect run
    setProgress(0);
    setCurrentTime(0);
    setAutoplayBlocked(false);
    setAudioError(null);

    return () => {
      // Comprehensive cleanup to prevent any lingering audio
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [currentSong.src, fileAvailable]); // Simplified dependencies - only recreate when song source changes

  // Separate effect for handling auto-play when song changes
  React.useEffect(() => {
    if (currentSongIndex !== undefined && hasUserInteracted && audioRef.current) {
      const audio = audioRef.current;
      // Only auto-play if we were previously playing
      if (isPlaying) {
        setTimeout(() => {
          audio.play().then(() => {
            setIsPlaying(true);
          }).catch(() => setAutoplayBlocked(true));
        }, 100);
      }
    }
  }, [currentSongIndex]);

  const [isToggling, setIsToggling] = React.useState(false);
  
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || fileAvailable === false || isToggling) return;
    
    setIsToggling(true);
    
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
    
    setTimeout(() => setIsToggling(false), 200);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.src = ''; // Clear the source to ensure no further playback
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
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
      // Stop current audio before changing songs
      const currentAudio = audioRef.current;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
      }
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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-card/95 backdrop-blur-md text-card-foreground shadow-lg border-b border-border/20">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
          {/* Banner Layout */}
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Song Selector */}
            <Select value={currentSong.id} onValueChange={onSongChange}>
              <SelectTrigger className="w-[180px] sm:w-[200px] md:w-[280px] lg:w-[400px] bg-background border-border/40 shadow-sm">
                <SelectValue placeholder="Select a song" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg z-[100] w-[320px] sm:w-[400px] md:w-[500px] lg:w-[600px] max-h-[300px] overflow-y-auto">
                {SONGS.map((song) => (
                  <SelectItem key={song.id} value={song.id} className="bg-background hover:bg-muted/80 focus:bg-muted/80">
                    <div className="flex items-center gap-2 w-full">
                      <img 
                        src={song.coverArt} 
                        alt={`${song.title} cover`} 
                        className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{song.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-9 w-9 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Previous Song"
                onClick={goToPreviousSong}
              >
                <SkipBack size={16} />
              </button>

              <button
                className={`inline-flex items-center justify-center rounded-md border transition-colors h-10 w-10 sm:h-10 sm:w-10 touch-manipulation ${
                  fileAvailable === false 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
                disabled={fileAvailable === false || isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin border-2 border-primary-foreground border-t-transparent rounded-full w-4 h-4" />
                ) : isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
              </button>

              <button
                className="inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors h-9 w-9 sm:h-9 sm:w-9 touch-manipulation"
                aria-label="Next Song"
                onClick={goToNextSong}
              >
                <SkipForward size={16} />
              </button>
            </div>

            {/* Progress Section */}
            <div className="flex-1 max-w-xs min-w-0 hidden md:block">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider 
                value={[progress]} 
                max={100} 
                step={0.1} 
                onValueChange={onSeek} 
                aria-label="Seek"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!isMobile && (
                <>
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
                </>
              )}
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="md:hidden mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider 
              value={[progress]} 
              max={100} 
              step={0.1} 
              onValueChange={onSeek} 
              aria-label="Seek"
              className="touch-manipulation"
            />
          </div>

          {/* Status Messages */}
          {isLoading && (
            <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2 mt-2">
              <div className="animate-spin border border-primary border-t-transparent rounded-full w-3 h-3" />
              {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Loading...'}
            </div>
          )}
          
          {audioError && (
            <div className="text-xs text-destructive text-center bg-destructive/10 rounded p-2 mt-2">
              <div className="line-clamp-2">{audioError}</div>
              {fileAvailable === false && (
                <button 
                  onClick={retryFileLoad}
                  className="bg-destructive/20 hover:bg-destructive/30 rounded px-2 py-1 text-xs mt-1 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          
          {autoplayBlocked && !audioError && fileAvailable && (
            <div className="text-xs text-amber-600 dark:text-amber-400 text-center bg-amber-500/10 rounded p-2 mt-2">
              🎵 Ready! Click play to start
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export both the component and the hook data for context
export { SONGS };
export type { Song };

export default AudioPlayer;

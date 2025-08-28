import React from "react";
import { Play, Pause, StopCircle, Download, Music, SkipBack, SkipForward, Repeat, Repeat1, ArrowRight } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { Song, SONGS } from "@/constants/songs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LyricLine } from "@/components/SynchronizedLyrics";
// PlayTrackingIndicator removed - tracking continues in background

import { LoadingFeedback } from "@/components/LoadingFeedback";
import { useMobile } from "@/contexts/MobileContext";
import { useAudio } from "@/contexts/AudioContext";

import krisKrugCover from "/lovable-uploads/22e18179-d389-42d3-9924-c6caf65d7d2e.png";
import pixelWizardCover from "@/assets/pixel-wizard-cover.jpg";
import macCover from "/lovable-uploads/cc181a8b-6dad-4af6-8731-9a8cbd3ba5d0.png";
import bcAiHackathonCover from "/lovable-uploads/2f51d7bb-96fc-4f06-b7f6-fc9abbbceb32.png";
import darrenAiStruckCover from "@/assets/darren-ai-struck-cover.jpg";
import drPatrickCover from "/lovable-uploads/4d050983-b56d-4606-a958-1c7e2c7253e8.png";
import hrMacMillanCover from "/lovable-uploads/8a59c6e4-39f4-41e2-bb0d-544e22e3030a.png";
import lalalaAiDilemmaCover from "/lovable-uploads/7e23b796-605f-4562-927b-06daa9147648.png";
import lionelRingenbachCover from "/lovable-uploads/7f8d84c3-eb81-4f66-87be-5b024084aca2.png";
import deanShevHumanCover from '@/assets/dean-shev-human-cover.jpg';
import bcCoastCatalystCover from '/lovable-uploads/429a3cb8-3ffb-40db-874a-5829a6a083bd.png';


// Supabase Storage URLs for audio files
const SUPABASE_URL = "https://oojckbecymzrrdtvcmqi.supabase.co";
const getAudioUrl = (filename: string) => `${SUPABASE_URL}/storage/v1/object/public/audio-files/${encodeURIComponent(filename)}`;

// SONGS data moved to src/constants/songs.ts to avoid circular dependency

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
  const { isMobile } = useMobile();
  const { startPlayTracking, endPlayTracking, updateActivity } = useAudio();
  
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
      isPlaylistMode,
      setIsPlaylistMode,
      currentSong,
      loadSpecificSong,
      startPlayback,
      shouldAutoPlay,
      setShouldAutoPlay,
    } = audioPlayerHook;
  
  const [hasRecordedPlay, setHasRecordedPlay] = React.useState(false);
  const [previousSongId, setPreviousSongId] = React.useState<string | null>(null);
  
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
      
      // Auto-start playback if shouldAutoPlay is true
      if (shouldAutoPlay && hasUserInteracted) {
        setShouldAutoPlay(false); // Reset the flag
        setTimeout(() => {
          audio.play().then(() => {
            setIsPlaying(true);
            console.log('▶️ Auto-started playback after loading');
          }).catch(() => {
            console.log('Autoplay blocked');
            setAutoplayBlocked(true);
          });
        }, 100);
      }
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
      
      // End play tracking when song ends
      if (hasRecordedPlay) {
        endPlayTracking(currentSong.id, duration);
        setHasRecordedPlay(false);
      }
      
      // Only auto-advance if user has interacted with the player
      if (!hasUserInteracted) return;
      
      // Handle playlist mode (auto-advance through all songs)
      if (isPlaylistMode) {
        const nextIndex = currentSongIndex < SONGS.length - 1 ? currentSongIndex + 1 : 0;
        setCurrentSongIndex(nextIndex);
        setShouldAutoPlay(true);
        return;
      }
      
      // When not in playlist mode, don't auto-advance
      // User can manually navigate or enable playlist mode
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

  // Track previous song ID and handle song change tracking
  React.useEffect(() => {
    // End tracking for previous song if it was being tracked and a different song is now playing
    if (hasRecordedPlay && previousSongId && previousSongId !== currentSong.id) {
      console.log('🔄 Song changed: Ending play tracking for:', previousSongId, '(was playing for', Math.round(duration), 's)');
      endPlayTracking(previousSongId, duration);
      setHasRecordedPlay(false);
    }
    
    // Update the previous song ID
    setPreviousSongId(currentSong.id);
  }, [currentSongIndex, endPlayTracking, currentSong.id, hasRecordedPlay, previousSongId, duration]);

  // Effect to handle auto-play after song changes
  React.useEffect(() => {
    if (shouldAutoPlay && audioRef.current && !isPlaying) {
      const audio = audioRef.current;
      
      // Wait for the audio to be ready before attempting to play
      const attemptAutoPlay = () => {
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          audio.play()
            .then(() => {
              setIsPlaying(true);
              setShouldAutoPlay(false);
              // Start play tracking when auto-playing
              if (!hasRecordedPlay) {
                startPlayTracking(currentSong.id);
                setHasRecordedPlay(true);
              }
            })
            .catch((error) => {
              console.error('Auto-play failed:', error);
              setAutoplayBlocked(true);
              setShouldAutoPlay(false);
            });
        } else {
          // If not ready, wait a bit and try again
          setTimeout(attemptAutoPlay, 100);
        }
      };
      
      attemptAutoPlay();
    }
  }, [shouldAutoPlay, currentSongIndex, isPlaying, startPlayTracking, currentSong.id, hasRecordedPlay]);

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
        // Start play tracking when manually starting
        if (!hasRecordedPlay) {
          console.log('▶️ Manual play: Starting play tracking for:', currentSong.title);
          startPlayTracking(currentSong.id);
          setHasRecordedPlay(true);
        }
      } catch (e) {
        console.error('Audio play failed:', e);
        setAutoplayBlocked(true);
        setAudioError('Autoplay blocked by browser. Please click play to start.');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      // End play tracking when manually pausing
      if (hasRecordedPlay) {
        endPlayTracking(currentSong.id, duration);
        setHasRecordedPlay(false);
      }
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

  // Simplified playback mode - just toggle playlist mode
  const togglePlaylistMode = () => {
    updateActivity();
    if (isPlaylistMode) {
      setIsPlaylistMode(false);
    } else {
      setIsPlaylistMode(true);
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
                    variant={isPlaylistMode ? "default" : "outline"}
                    size="sm" 
                    onClick={togglePlaylistMode}
                    title={isPlaylistMode ? "Stop playlist mode" : "Start playlist mode"}
                    aria-label={isPlaylistMode ? "Stop playlist mode" : "Start playlist mode"}
                  >
                    <ArrowRight size={14} />
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


          {/* Loading Feedback */}
          <div className="mt-2">
            <LoadingFeedback
              isLoading={isLoading}
              fileAvailable={fileAvailable}
              audioError={audioError}
              songTitle={currentSong.title}
              retryCount={retryCount}
            />
          </div>

          {/* Status Messages - Only show if loading feedback isn't already showing */}
          {!isLoading && !audioError && !autoplayBlocked && (
            <div className="mt-2 space-y-1">
              {/* Additional status messages can go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

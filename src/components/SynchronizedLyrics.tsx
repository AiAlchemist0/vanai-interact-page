import React from "react";

export interface LyricLine {
  time: number; // seconds
  text: string;
}

interface SynchronizedLyricsProps {
  lyrics: LyricLine[];
  currentTime: number;
  className?: string;
}

const SynchronizedLyrics: React.FC<SynchronizedLyricsProps> = ({
  lyrics,
  currentTime,
  className = ""
}) => {
  const [currentLineIndex, setCurrentLineIndex] = React.useState(-1);

  React.useEffect(() => {
    // Find the current lyric line based on currentTime
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }
    setCurrentLineIndex(activeIndex);
  }, [currentTime, lyrics]);

  if (lyrics.length === 0) {
    return (
      <div className={`text-center text-sm text-muted-foreground ${className}`}>
        No lyrics available
      </div>
    );
  }

  // Show 3 lines: previous, current, next
  const linesToShow = [];
  for (let i = Math.max(0, currentLineIndex - 1); i <= Math.min(lyrics.length - 1, currentLineIndex + 1); i++) {
    linesToShow.push(i);
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {linesToShow.map((lineIndex) => (
        <div
          key={lineIndex}
          className={`text-sm transition-all duration-300 text-center ${
            lineIndex === currentLineIndex
              ? "text-primary font-semibold scale-105"
              : "text-muted-foreground"
          }`}
        >
          {lyrics[lineIndex]?.text || ""}
        </div>
      ))}
    </div>
  );
};

export default SynchronizedLyrics;
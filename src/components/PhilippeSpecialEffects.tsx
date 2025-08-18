import React from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface PhilippeSpecialEffectsProps {
  type: 'player' | 'page';
  children?: React.ReactNode;
}

const PhilippeSpecialEffects: React.FC<PhilippeSpecialEffectsProps> = ({ type, children }) => {
  const { currentSong, isPlaying } = useAudio();
  
  // Check if Philippe Pasquier's song is currently playing
  const isPhilippePlayingActive = 
    currentSong?.id === "philippe-pasquier-art-hallucinations" && isPlaying;

  if (type === 'player') {
    return (
      <div className={`relative ${isPhilippePlayingActive ? 'philippe-player-effects' : ''}`}>
        {children}
        {isPhilippePlayingActive && (
          <>
            {/* LED-style border effect around player */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="philippe-led-border"></div>
            </div>
            
            {/* Synthwave audio visualizer bars around player */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="philippe-visualizer-bars">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="philippe-visualizer-bar"
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      left: `${5 + (i * 8)}%`,
                      animationDuration: `${0.5 + (i * 0.1)}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Neon scan lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="philippe-scan-lines"></div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <>
        {children}
        {isPhilippePlayingActive && (
          <>
            {/* Synthwave retro grid background */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-retro-grid"></div>
            </div>
            
            {/* Synthwave sun/horizon */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-synthwave-sun"></div>
            </div>
            
            {/* Enhanced chromatic aberration overlay */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-chromatic-aberration"></div>
            </div>
            
            {/* Enhanced edge neon tubes */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-neon-tube-top"></div>
              <div className="philippe-neon-tube-bottom"></div>
              <div className="philippe-neon-tube-left"></div>
              <div className="philippe-neon-tube-right"></div>
            </div>
            
            {/* Corner geometric accents */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-corner-accent philippe-corner-tl"></div>
              <div className="philippe-corner-accent philippe-corner-tr"></div>
              <div className="philippe-corner-accent philippe-corner-bl"></div>
              <div className="philippe-corner-accent philippe-corner-br"></div>
            </div>
            
            {/* Full screen scan lines */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-screen-scanlines"></div>
            </div>
            
            {/* Beat-sync pulsing overlay */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-beat-pulse"></div>
            </div>
          </>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default PhilippeSpecialEffects;
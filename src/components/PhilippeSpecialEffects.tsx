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
            {/* Synthwave retro grid background - desktop only */}
            <div className="fixed inset-0 pointer-events-none z-10 hidden md:block">
              <div className="philippe-retro-grid"></div>
            </div>
          </>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default PhilippeSpecialEffects;
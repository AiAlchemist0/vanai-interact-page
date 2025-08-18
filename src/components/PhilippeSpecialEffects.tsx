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
            
            {/* Glowing particle effects around player */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="philippe-particles">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className="philippe-particle"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      left: `${10 + (i * 12)}%`,
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
            {/* Full page colorful overlay effects */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-page-overlay"></div>
            </div>
            
            {/* Edge glow effects */}
            <div className="fixed inset-0 pointer-events-none z-10">
              <div className="philippe-edge-glow-top"></div>
              <div className="philippe-edge-glow-bottom"></div>
              <div className="philippe-edge-glow-left"></div>
              <div className="philippe-edge-glow-right"></div>
            </div>
            
            {/* Floating color orbs */}
            <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="philippe-floating-orbs">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className="philippe-orb"
                    style={{
                      animationDelay: `${i * 0.5}s`,
                      left: `${15 + (i * 15)}%`,
                      animationDuration: `${3 + (i * 0.5)}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default PhilippeSpecialEffects;
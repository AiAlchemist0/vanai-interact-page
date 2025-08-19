import React, { useMemo } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PhilippeSpecialEffectsProps {
  type: 'player' | 'page' | 'playlist';
  children?: React.ReactNode;
}

const PhilippeSpecialEffects: React.FC<PhilippeSpecialEffectsProps> = ({ type, children }) => {
  const { currentSong, isPlaying } = useAudio();
  const prefersReducedMotion = useReducedMotion();
  
  // Check if Philippe Pasquier's song is currently playing
  const isPhilippePlayingActive = useMemo(() => 
    currentSong?.id === "philippe-pasquier-art-hallucinations" && isPlaying && !prefersReducedMotion,
    [currentSong?.id, isPlaying, prefersReducedMotion]
  );

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

  if (type === 'playlist') {
    return (
      <div className="relative">
        {children}
        {isPhilippePlayingActive && (
          <>
            {/* Dancing soundbars as playlist overlay - optimized for performance */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
              <div className="philippe-playlist-visualizer-bars will-change-transform">
                {Array.from({ length: 24 }, (_, i) => (
                  <div 
                    key={i} 
                    className="philippe-playlist-visualizer-bar will-change-transform"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      left: `${2 + (i * 4)}%`,
                      animationDuration: `${0.4 + (i * 0.05)}s`,
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

  return <>{children}</>;
};

export default PhilippeSpecialEffects;
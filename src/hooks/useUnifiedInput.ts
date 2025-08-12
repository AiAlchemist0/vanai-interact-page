import { useState, useEffect, useCallback, useRef } from 'react';

export interface UnifiedInputState {
  pressedFrets: Set<number>;
  lastStrum: number;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

export const useUnifiedInput = (onStrum: () => void, gameState: string) => {
  const [pressedFrets, setPressedFrets] = useState<Set<number>>(new Set());
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'touch' | 'none'>('none');
  const [touchPoints, setTouchPoints] = useState<Map<number, number>>(new Map());
  const lastStrumRef = useRef<number>(0);
  const strumCooldown = 100; // ms between strums

  // Fret mapping for keyboard
  const fretMap: { [key: string]: number } = {
    'a': 0, 'A': 0,  // Green
    's': 1, 'S': 1,  // Red
    'd': 2, 'D': 2,  // Yellow
    'f': 3, 'F': 3,  // Blue
    'g': 4, 'G': 4   // Orange
  };

  const handleStrum = useCallback(() => {
    const now = Date.now();
    if (now - lastStrumRef.current < strumCooldown) return;
    
    lastStrumRef.current = now;
    onStrum();
    
    // Haptic feedback for touch
    if (inputMethod === 'touch' && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }, [onStrum, inputMethod]);

  // Keyboard input handling
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Switch to keyboard mode
      if (inputMethod !== 'keyboard' && fretMap[e.key] !== undefined) {
        setInputMethod('keyboard');
      }

      if (fretMap[e.key] !== undefined) {
        setPressedFrets(prev => new Set([...prev, fretMap[e.key]]));
      }

      // Spacebar to strum
      if (e.code === 'Space') {
        e.preventDefault();
        handleStrum();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (fretMap[e.key] !== undefined) {
        setPressedFrets(prev => {
          const newSet = new Set(prev);
          newSet.delete(fretMap[e.key]);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, inputMethod, handleStrum]);

  // Touch input handling
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      // Switch to touch mode
      if (inputMethod !== 'touch') {
        setInputMethod('touch');
        setPressedFrets(new Set()); // Clear keyboard frets
      }

      Array.from(e.changedTouches).forEach(touch => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        const fretElement = element?.closest('[data-fret]');
        
        if (fretElement) {
          const fretId = parseInt(fretElement.getAttribute('data-fret') || '0');
          setTouchPoints(prev => new Map([...prev, [touch.identifier, fretId]]));
          setPressedFrets(prev => new Set([...prev, fretId]));
        } else {
          // Touch outside frets - trigger strum
          handleStrum();
        }
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      
      Array.from(e.changedTouches).forEach(touch => {
        const fretId = touchPoints.get(touch.identifier);
        if (fretId !== undefined) {
          setTouchPoints(prev => {
            const newMap = new Map(prev);
            newMap.delete(touch.identifier);
            return newMap;
          });
          
          setPressedFrets(prev => {
            const newSet = new Set(prev);
            newSet.delete(fretId);
            return newSet;
          });
        }
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      // Handle touch movement between frets if needed
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, inputMethod, touchPoints, handleStrum]);

  // Clear input when game stops
  useEffect(() => {
    if (gameState !== "playing") {
      setPressedFrets(new Set());
      setTouchPoints(new Map());
      setInputMethod('none');
    }
  }, [gameState]);

  return {
    pressedFrets,
    inputMethod,
    lastStrum: lastStrumRef.current
  };
};
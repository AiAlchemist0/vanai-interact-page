import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMobile } from './use-mobile';

export interface MobileGameInputState {
  pressedFrets: Set<number>;
  lastStrum: number;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

export const useMobileGameInput = (onStrum: () => void, gameState: string) => {
  const [pressedFrets, setPressedFrets] = useState<Set<number>>(new Set());
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'touch' | 'none'>('none');
  const [touchPoints, setTouchPoints] = useState<Map<number, number>>(new Map());
  const lastStrumRef = useRef<number>(0);
  const isMobile = useIsMobile();
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
    console.log(`Mobile Strum triggered: method=${inputMethod}, frets=[${Array.from(pressedFrets).join(', ')}]`);
    onStrum();
    
    // Enhanced haptic feedback for mobile
    if (inputMethod === 'touch' && isMobile) {
      if ('vibrate' in navigator) {
        navigator.vibrate([30]);
      }
      console.log('Mobile strum with haptic feedback');
    }
  }, [onStrum, inputMethod, pressedFrets, isMobile]);

  // Keyboard input handling
  useEffect(() => {
    if (gameState !== "playing" || isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (inputMethod !== 'keyboard' && fretMap[e.key] !== undefined) {
        setInputMethod('keyboard');
      }

      if (fretMap[e.key] !== undefined) {
        setPressedFrets(prev => new Set([...prev, fretMap[e.key]]));
      }

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
  }, [gameState, inputMethod, handleStrum, isMobile]);

  // Mobile touch input handling
  useEffect(() => {
    if (gameState !== "playing" || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      if (inputMethod !== 'touch') {
        setInputMethod('touch');
        setPressedFrets(new Set());
      }

      Array.from(e.changedTouches).forEach(touch => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Enhanced fret detection for mobile
        const fretElement = element?.closest('[data-fret]') || 
                           element?.closest('.fret-button') ||
                           element?.closest('[class*="fret-"]');
        
        const directFretElement = element as HTMLElement;
        const hasFretAttribute = directFretElement?.hasAttribute?.('data-fret');
        
        if (fretElement || hasFretAttribute) {
          const fretId = parseInt(
            fretElement?.getAttribute('data-fret') || 
            directFretElement?.getAttribute('data-fret') || 
            '0'
          );
          
          console.log(`Mobile touch on fret ${fretId} detected`);
          setTouchPoints(prev => new Map([...prev, [touch.identifier, fretId]]));
          setPressedFrets(prev => new Set([...prev, fretId]));
        } else {
          // Enhanced strum detection for mobile
          const strumElement = element?.closest('[data-strum]') || 
                              element?.closest('.strum-button') ||
                              element?.closest('[class*="strum"]');
          
          if (strumElement) {
            console.log('Mobile strum touch detected');
            handleStrum();
          } else {
            console.log('Mobile touch outside game area, triggering strum as fallback');
            // On mobile, any touch outside frets should trigger strum
            handleStrum();
          }
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
      // Handle touch movement for better mobile experience
    };

    // Add mobile-specific event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, inputMethod, touchPoints, handleStrum, isMobile]);

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
    lastStrum: lastStrumRef.current,
    isMobile
  };
};
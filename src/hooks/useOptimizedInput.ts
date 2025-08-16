import { useState, useEffect, useCallback, useRef } from 'react';
import { STRUM_COOLDOWN } from '@/game/constants';

export interface OptimizedInputState {
  pressedFrets: Set<number>;
  lastStrum: number;
  inputMethod: 'keyboard' | 'touch' | 'none';
}

export const useOptimizedInput = (onStrum: () => void, gameState: string) => {
  const [pressedFrets, setPressedFrets] = useState<Set<number>>(new Set());
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'touch' | 'none'>('none');
  const [touchPoints, setTouchPoints] = useState<Map<number, number>>(new Map());
  const lastStrumRef = useRef<number>(0);

  // Optimized fret mapping
  const fretMap: { [key: string]: number } = {
    'a': 0, 'A': 0,  // Green
    's': 1, 'S': 1,  // Red  
    'd': 2, 'D': 2,  // Yellow
    'f': 3, 'F': 3,  // Blue
    'g': 4, 'G': 4   // Orange
  };

  const handleStrum = useCallback(() => {
    const now = performance.now(); // More precise timing
    if (now - lastStrumRef.current < STRUM_COOLDOWN) {
      console.log(`⏱️ Strum cooldown active, blocked (${now - lastStrumRef.current}ms < ${STRUM_COOLDOWN}ms)`);
      return;
    }
    
    lastStrumRef.current = now;
    console.log(`✅ STRUM TRIGGERED! method=${inputMethod}, frets=[${Array.from(pressedFrets).join(', ')}], time=${now.toFixed(1)}`);
    onStrum();
    
    // Enhanced haptic feedback for touch
    if (inputMethod === 'touch') {
      if ('vibrate' in navigator) {
        navigator.vibrate(25); // Shorter vibration for better feel
      }
    }
  }, [onStrum, inputMethod, pressedFrets]);

  // Optimized keyboard handling with better performance
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`🎹 KEY DOWN: ${e.key} (code: ${e.code})`);
      
      // Prevent default for game keys to avoid browser actions
      if (fretMap[e.key] !== undefined || e.code === 'Space') {
        e.preventDefault();
        console.log(`🔒 Prevented default for game key: ${e.key}`);
      }

      // Switch to keyboard mode instantly
      if (inputMethod !== 'keyboard' && fretMap[e.key] !== undefined) {
        console.log(`🎮 Switched to keyboard input mode`);
        setInputMethod('keyboard');
        setTouchPoints(new Map()); // Clear touch state
      }

      // Handle fret presses
      if (fretMap[e.key] !== undefined) {
        const fret = fretMap[e.key];
        console.log(`🎸 Fret ${fret} pressed (key: ${e.key})`);
        setPressedFrets(prev => {
          if (prev.has(fret)) {
            console.log(`🔄 Fret ${fret} already pressed, ignoring`);
            return prev; // Already pressed
          }
          const newSet = new Set([...prev, fret]);
          console.log(`✅ Fret ${fret} added, new pressed frets: [${Array.from(newSet).join(', ')}]`);
          return newSet;
        });
      }

      // Optimized strum handling
      if (e.code === 'Space') {
        console.log(`🚀 SPACE key pressed - triggering strum!`);
        handleStrum();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (fretMap[e.key] !== undefined) {
        const fret = fretMap[e.key];
        console.log(`🎸 Fret ${fret} released (key: ${e.key})`);
        setPressedFrets(prev => {
          const newSet = new Set(prev);
          newSet.delete(fret);
          console.log(`🔧 Fret ${fret} removed, remaining pressed frets: [${Array.from(newSet).join(', ')}]`);
          return newSet;
        });
      }
    };

    // Use capture phase for better performance
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [gameState, inputMethod, handleStrum]);

  // Optimized touch handling with better detection
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      // Switch to touch mode
      if (inputMethod !== 'touch') {
        setInputMethod('touch');
        setPressedFrets(new Set()); // Clear keyboard state
      }

      Array.from(e.changedTouches).forEach(touch => {
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        // Enhanced fret detection with multiple selectors
        const fretElement = element?.closest('[data-fret]') || 
                           element?.closest('.fret-button') ||
                           element?.closest('[class*="fret-"]') ||
                           (element as HTMLElement)?.hasAttribute?.('data-fret') ? element : null;
        
        if (fretElement) {
          const fretId = parseInt(fretElement.getAttribute('data-fret') || '0');
          
          if (!isNaN(fretId) && fretId >= 0 && fretId <= 4) {
            console.log(`✓ Optimized fret ${fretId} touch at (${touch.clientX}, ${touch.clientY})`);
            setTouchPoints(prev => new Map([...prev, [touch.identifier, fretId]]));
            setPressedFrets(prev => new Set([...prev, fretId]));
          }
        } else {
          // Enhanced strum detection
          const strumElement = element?.closest('[data-strum]') || 
                              element?.closest('.strum-button') ||
                              element?.closest('button[class*="strum"]');
          
          if (strumElement) {
            console.log(`✓ Optimized strum touch at (${touch.clientX}, ${touch.clientY})`);
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
      // Optimized touch move handling - only process if needed
    };

    // Use passive: false for preventDefault to work
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, inputMethod, touchPoints, handleStrum]);

  // Reset input state when game stops
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
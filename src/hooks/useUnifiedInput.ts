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
    console.log(`Strum triggered: method=${inputMethod}, frets=[${Array.from(pressedFrets).join(', ')}]`);
    onStrum();
    
    // Enhanced haptic feedback for touch
    if (inputMethod === 'touch') {
      if ('vibrate' in navigator) {
        navigator.vibrate(30);
      }
      // Add visual feedback for mobile users
      console.log('Mobile strum with haptic feedback');
    }
  }, [onStrum, inputMethod, pressedFrets]);

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
        
        // Enhanced fret detection with better logging
        const fretElement = element?.closest('[data-fret]') || 
                           element?.closest('.fret-button') ||
                           element?.closest('[class*="fret-"]');
        
        // Also check if the touched element itself has the data-fret attribute
        const directFretElement = element as HTMLElement;
        const hasFretAttribute = directFretElement?.hasAttribute?.('data-fret');
        
        console.log(`Touch debug: element=${element?.tagName}, fretElement=${!!fretElement}, hasFretAttribute=${hasFretAttribute}`);
        
        if (fretElement || hasFretAttribute) {
          const fretId = parseInt(
            fretElement?.getAttribute('data-fret') || 
            directFretElement?.getAttribute('data-fret') || 
            '0'
          );
          
          if (!isNaN(fretId) && fretId >= 0 && fretId <= 4) {
            console.log(`✓ Touch on fret ${fretId} detected at (${touch.clientX}, ${touch.clientY})`);
            setTouchPoints(prev => new Map([...prev, [touch.identifier, fretId]]));
            setPressedFrets(prev => new Set([...prev, fretId]));
          } else {
            console.log(`✗ Invalid fret ID: ${fretId}`);
          }
        } else {
          // Enhanced strum detection
          const strumElement = element?.closest('[data-strum]') || 
                              element?.closest('.strum-button') ||
                              element?.closest('button[class*="strum"]');
          
          console.log(`Strum debug: strumElement=${!!strumElement}, tagName=${element?.tagName}`);
          
          if (strumElement) {
            console.log(`✓ Strum touch detected at (${touch.clientX}, ${touch.clientY})`);
            handleStrum();
          } else {
            console.log(`✗ Touch outside game area at (${touch.clientX}, ${touch.clientY}), element: ${element?.tagName}`);
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
import { useState, useEffect, useCallback, useRef } from 'react';

export interface EnhancedInputState {
  pressedFrets: Set<number>;
  inputMethod: 'keyboard' | 'touch' | 'none';
  lastStrum: number;
  inputBuffer: InputEvent[];
}

export interface InputEvent {
  type: 'fret_press' | 'fret_release' | 'strum';
  fret?: number;
  timestamp: number;
  position?: { x: number; y: number };
}

export const useEnhancedInput = (onStrum: () => void, gameState: string) => {
  const [pressedFrets, setPressedFrets] = useState<Set<number>>(new Set());
  const [inputMethod, setInputMethod] = useState<'keyboard' | 'touch' | 'none'>('none');
  const [inputBuffer, setInputBuffer] = useState<InputEvent[]>([]);
  const [touchPoints, setTouchPoints] = useState<Map<number, number>>(new Map());
  const lastStrumRef = useRef<number>(0);
  const fretHoldStart = useRef<Map<number, number>>(new Map());
  
  const strumCooldown = 50; // Reduced for better responsiveness
  const inputBufferSize = 10;

  // Fret mapping for keyboard
  const fretMap: { [key: string]: number } = {
    'a': 0, 'A': 0,  // Green
    's': 1, 'S': 1,  // Red  
    'd': 2, 'D': 2,  // Yellow
    'f': 3, 'F': 3,  // Blue
    'g': 4, 'G': 4   // Orange
  };

  const addToInputBuffer = useCallback((event: InputEvent) => {
    setInputBuffer(prev => {
      const newBuffer = [...prev, event];
      return newBuffer.slice(-inputBufferSize);
    });
  }, []);

  const handleFretPress = useCallback((fretId: number, position?: { x: number; y: number }) => {
    if (fretId < 0 || fretId > 4) return;
    
    const now = performance.now();
    fretHoldStart.current.set(fretId, now);
    
    setPressedFrets(prev => {
      if (prev.has(fretId)) return prev;
      const newSet = new Set([...prev, fretId]);
      console.log(`✓ Fret ${fretId} pressed, total: [${Array.from(newSet).join(', ')}]`);
      return newSet;
    });

    addToInputBuffer({
      type: 'fret_press',
      fret: fretId,
      timestamp: now,
      position
    });
  }, [addToInputBuffer]);

  const handleFretRelease = useCallback((fretId: number) => {
    if (fretId < 0 || fretId > 4) return;
    
    const now = performance.now();
    const holdDuration = now - (fretHoldStart.current.get(fretId) || now);
    fretHoldStart.current.delete(fretId);
    
    setPressedFrets(prev => {
      const newSet = new Set(prev);
      newSet.delete(fretId);
      console.log(`✗ Fret ${fretId} released (held ${holdDuration.toFixed(0)}ms), remaining: [${Array.from(newSet).join(', ')}]`);
      return newSet;
    });

    addToInputBuffer({
      type: 'fret_release',
      fret: fretId,
      timestamp: now
    });
  }, [addToInputBuffer]);

  const handleStrum = useCallback((position?: { x: number; y: number }) => {
    const now = performance.now();
    if (now - lastStrumRef.current < strumCooldown) {
      console.log(`Strum ignored - cooldown (${now - lastStrumRef.current}ms < ${strumCooldown}ms)`);
      return;
    }
    
    lastStrumRef.current = now;
    console.log(`🎸 STRUM triggered: method=${inputMethod}, frets=[${Array.from(pressedFrets).join(', ')}]`);
    
    addToInputBuffer({
      type: 'strum',
      timestamp: now,
      position
    });

    // Enhanced haptic feedback
    if (inputMethod === 'touch' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
    
    onStrum();
  }, [onStrum, inputMethod, pressedFrets, addToInputBuffer]);

  // Keyboard input handling
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // Ignore key repeat
      
      // Switch to keyboard mode
      if (inputMethod !== 'keyboard' && fretMap[e.key] !== undefined) {
        setInputMethod('keyboard');
        console.log('Switched to keyboard input');
      }

      if (fretMap[e.key] !== undefined) {
        handleFretPress(fretMap[e.key]);
      }

      // Spacebar to strum
      if (e.code === 'Space') {
        e.preventDefault();
        handleStrum();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (fretMap[e.key] !== undefined) {
        handleFretRelease(fretMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, inputMethod, handleFretPress, handleFretRelease, handleStrum]);

  // Touch input handling with direct element event handlers
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      // Switch to touch mode
      if (inputMethod !== 'touch') {
        setInputMethod('touch');
        setPressedFrets(new Set()); // Clear keyboard frets
        console.log('Switched to touch input');
      }

      Array.from(e.changedTouches).forEach(touch => {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        const element = document.elementFromPoint(touchX, touchY);
        
        // Enhanced fret detection
        let fretElement: Element | null = null;
        let currentElement = element;
        
        // Walk up the DOM tree to find fret element
        while (currentElement && !fretElement) {
          if (currentElement.hasAttribute?.('data-fret') || 
              currentElement.classList?.contains('fret-button') ||
              Array.from(currentElement.classList || []).some(cls => cls.startsWith('fret-'))) {
            fretElement = currentElement;
            break;
          }
          currentElement = currentElement.parentElement;
        }
        
        if (fretElement) {
          const fretId = parseInt(fretElement.getAttribute('data-fret') || '0');
          
          if (!isNaN(fretId) && fretId >= 0 && fretId <= 4) {
            console.log(`📱 Touch fret ${fretId} at (${touchX}, ${touchY})`);
            setTouchPoints(prev => new Map([...prev, [touch.identifier, fretId]]));
            handleFretPress(fretId, { x: touchX, y: touchY });
          }
        } else {
          // Check for strum area
          let strumElement: Element | null = null;
          currentElement = element;
          
          while (currentElement && !strumElement) {
            if (currentElement.hasAttribute?.('data-strum') ||
                currentElement.classList?.contains('strum-button') ||
                currentElement.tagName === 'BUTTON') {
              strumElement = currentElement;
              break;
            }
            currentElement = currentElement.parentElement;
          }
          
          if (strumElement) {
            console.log(`📱 Touch strum button at (${touchX}, ${touchY})`);
            handleStrum({ x: touchX, y: touchY });
          } else {
            // Fallback: treat any touch outside frets as strum
            console.log(`📱 Touch outside fret area at (${touchX}, ${touchY}) - triggering strum`);
            handleStrum({ x: touchX, y: touchY });
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
          
          handleFretRelease(fretId);
        }
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      // Allow touch movement without changing fret state
    };

    // Add event listeners with passive: false for better control
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState, inputMethod, touchPoints, handleFretPress, handleFretRelease, handleStrum]);

  // Clear input when game stops
  useEffect(() => {
    if (gameState !== "playing") {
      setPressedFrets(new Set());
      setTouchPoints(new Map());
      setInputMethod('none');
      setInputBuffer([]);
      fretHoldStart.current.clear();
      console.log('Input cleared - game stopped');
    }
  }, [gameState]);

  // Debug logging for fret state changes
  useEffect(() => {
    if (pressedFrets.size > 0) {
      console.log(`Fret state: [${Array.from(pressedFrets).join(', ')}]`);
    }
  }, [pressedFrets]);

  return {
    pressedFrets,
    inputMethod,
    lastStrum: lastStrumRef.current,
    inputBuffer,
    // Utility functions
    getCurrentHoldDurations: () => {
      const now = performance.now();
      const durations = new Map<number, number>();
      fretHoldStart.current.forEach((startTime, fretId) => {
        durations.set(fretId, now - startTime);
      });
      return durations;
    }
  };
};
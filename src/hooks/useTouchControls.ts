import { useState, useCallback, useRef, useEffect } from 'react';

interface TouchFret {
  id: number;
  isPressed: boolean;
  touchId?: number;
}

export const useTouchControls = (onStrum: () => void) => {
  const [touchFrets, setTouchFrets] = useState<TouchFret[]>([
    { id: 0, isPressed: false },
    { id: 1, isPressed: false },
    { id: 2, isPressed: false },
    { id: 3, isPressed: false },
    { id: 4, isPressed: false }
  ]);

  const strumAreaRef = useRef<HTMLDivElement>(null);
  const fretRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Convert touch frets to pressed frets set
  const pressedFrets = new Set(
    touchFrets.filter(fret => fret.isPressed).map(fret => fret.id)
  );

  const handleFretTouchStart = useCallback((fretId: number, touchId: number) => {
    setTouchFrets(prev => prev.map(fret => 
      fret.id === fretId 
        ? { ...fret, isPressed: true, touchId }
        : fret
    ));
  }, []);

  const handleFretTouchEnd = useCallback((touchId: number) => {
    setTouchFrets(prev => prev.map(fret => 
      fret.touchId === touchId 
        ? { ...fret, isPressed: false, touchId: undefined }
        : fret
    ));
  }, []);

  const handleStrumGesture = useCallback((e: TouchEvent) => {
    e.preventDefault();
    onStrum();
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [onStrum]);

  // Touch event handlers
  const onTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    Array.from(e.changedTouches).forEach(touch => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Check if touch is on a fret
      fretRefs.current.forEach((fretRef, index) => {
        if (fretRef && fretRef.contains(element as Node)) {
          handleFretTouchStart(index, touch.identifier);
        }
      });
      
      // Check if touch is on strum area
      if (strumAreaRef.current && strumAreaRef.current.contains(element as Node)) {
        handleStrumGesture(e);
      }
    });
  }, [handleFretTouchStart, handleStrumGesture]);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    Array.from(e.changedTouches).forEach(touch => {
      handleFretTouchEnd(touch.identifier);
    });
  }, [handleFretTouchEnd]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    
    Array.from(e.changedTouches).forEach(touch => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      // Check if moved off current fret
      const currentFret = touchFrets.find(fret => fret.touchId === touch.identifier);
      if (currentFret) {
        const currentFretRef = fretRefs.current[currentFret.id];
        if (currentFretRef && !currentFretRef.contains(element as Node)) {
          handleFretTouchEnd(touch.identifier);
        }
      }
      
      // Check if moved onto new fret
      fretRefs.current.forEach((fretRef, index) => {
        if (fretRef && fretRef.contains(element as Node)) {
          const existingTouch = touchFrets.find(fret => fret.id === index && fret.isPressed);
          if (!existingTouch) {
            handleFretTouchStart(index, touch.identifier);
          }
        }
      });
    });
  }, [touchFrets, handleFretTouchStart, handleFretTouchEnd]);

  // Set up touch event listeners
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => e.preventDefault();
    
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchcancel', onTouchEnd, { passive: false });
    
    // Prevent scrolling on touch
    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [onTouchStart, onTouchEnd, onTouchMove]);

  return {
    pressedFrets,
    touchFrets,
    strumAreaRef,
    fretRefs,
    isTouch: 'ontouchstart' in window
  };
};
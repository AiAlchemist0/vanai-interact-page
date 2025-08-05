import { useState, useEffect, useCallback } from 'react';

interface KeyboardState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  enter: boolean;
}

export const useKeyboard = () => {
  const [keys, setKeys] = useState<KeyboardState>({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    enter: false
  });

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        setKeys(prev => ({ ...prev, up: true }));
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 'KeyS':
        setKeys(prev => ({ ...prev, down: true }));
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setKeys(prev => ({ ...prev, left: true }));
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'KeyD':
        setKeys(prev => ({ ...prev, right: true }));
        event.preventDefault();
        break;
      case 'Space':
        setKeys(prev => ({ ...prev, space: true }));
        event.preventDefault();
        break;
      case 'Enter':
        setKeys(prev => ({ ...prev, enter: true }));
        event.preventDefault();
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        setKeys(prev => ({ ...prev, up: false }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setKeys(prev => ({ ...prev, down: false }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setKeys(prev => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setKeys(prev => ({ ...prev, right: false }));
        break;
      case 'Space':
        setKeys(prev => ({ ...prev, space: false }));
        break;
      case 'Enter':
        setKeys(prev => ({ ...prev, enter: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
};
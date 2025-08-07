import { useState, useEffect, useCallback } from 'react';

interface KeyboardState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  space: boolean;
  enter: boolean;
  shift: boolean;
  ctrl: boolean;
  q: boolean;
  e: boolean;
}

export const useKeyboard = () => {
  const [keys, setKeys] = useState<KeyboardState>({
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    enter: false,
    shift: false,
    ctrl: false,
    q: false,
    e: false
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
      case 'ShiftLeft':
      case 'ShiftRight':
        setKeys(prev => ({ ...prev, shift: true }));
        break;
      case 'ControlLeft':
      case 'ControlRight':
        setKeys(prev => ({ ...prev, ctrl: true }));
        break;
      case 'KeyQ':
        setKeys(prev => ({ ...prev, q: true }));
        break;
      case 'KeyE':
        setKeys(prev => ({ ...prev, e: true }));
        break;
      default:
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
      case 'ShiftLeft':
      case 'ShiftRight':
        setKeys(prev => ({ ...prev, shift: false }));
        break;
      case 'ControlLeft':
      case 'ControlRight':
        setKeys(prev => ({ ...prev, ctrl: false }));
        break;
      case 'KeyQ':
        setKeys(prev => ({ ...prev, q: false }));
        break;
      case 'KeyE':
        setKeys(prev => ({ ...prev, e: false }));
        break;
      default:
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
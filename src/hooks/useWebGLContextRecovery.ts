import { useEffect, useRef, useState } from 'react';

export const useWebGLContextRecovery = () => {
  const [contextLost, setContextLost] = useState(false);
  const [contextRecovered, setContextRecovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recoveryAttempts = useRef(0);
  const maxRecoveryAttempts = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (e: Event) => {
      console.warn('WebGL context lost!');
      e.preventDefault();
      setContextLost(true);
      setContextRecovered(false);
    };

    const handleContextRestored = (e: Event) => {
      console.log('WebGL context restored!');
      setContextLost(false);
      setContextRecovered(true);
      recoveryAttempts.current = 0;
      
      // Auto-clear recovery flag after a short delay
      setTimeout(() => {
        setContextRecovered(false);
      }, 2000);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  const forceContextRecovery = () => {
    if (recoveryAttempts.current >= maxRecoveryAttempts) {
      console.error('Max WebGL recovery attempts reached');
      return false;
    }

    recoveryAttempts.current++;
    console.log(`Attempting WebGL context recovery (${recoveryAttempts.current}/${maxRecoveryAttempts})`);
    
    try {
      // Try to restore context
      const canvas = canvasRef.current;
      if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl && (gl as WebGLRenderingContext).isContextLost()) {
          // Force a context restore attempt
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to recover WebGL context:', error);
      return false;
    }
  };

  return {
    contextLost,
    contextRecovered,
    canvasRef,
    forceContextRecovery,
    recoveryAttempts: recoveryAttempts.current,
    maxRecoveryAttempts
  };
};
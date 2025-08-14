import { useState, useEffect, useCallback, useRef } from 'react';

export interface MobileOptimizationSettings {
  hapticFeedback: boolean;
  touchSensitivity: number;
  gestureRecognition: boolean;
  performanceMode: 'quality' | 'performance' | 'battery';
}

export interface TouchGesture {
  type: 'tap' | 'hold' | 'swipe' | 'pinch';
  startPosition: { x: number; y: number };
  endPosition?: { x: number; y: number };
  duration: number;
  force?: number;
}

export const useMobileOptimization = () => {
  const [settings, setSettings] = useState<MobileOptimizationSettings>({
    hapticFeedback: true,
    touchSensitivity: 1.0,
    gestureRecognition: true,
    performanceMode: 'quality'
  });

  const [touchMetrics, setTouchMetrics] = useState({
    averageResponseTime: 0,
    touchAccuracy: 100,
    gesturesDetected: 0
  });

  const touchStartTimes = useRef<Map<number, number>>(new Map());
  const gestureHistory = useRef<TouchGesture[]>([]);
  const performanceMetrics = useRef({ frameDrops: 0, avgFrameTime: 16.67 });

  // Detect if device supports haptics (Web Vibration API)
  const supportsHaptics = useCallback((): boolean => {
    return 'vibrate' in navigator;
  }, []);

  // Enhanced haptic feedback with different intensities (Web Vibration API)
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (!settings.hapticFeedback || !('vibrate' in navigator)) return;

    // Use web vibration API with different patterns
    const vibrationPatterns = {
      light: [10],
      medium: [25],
      heavy: [50],
      success: [10, 50, 10],
      error: [100]
    };
    
    try {
      navigator.vibrate(vibrationPatterns[type]);
    } catch (error) {
      console.log('Vibration not supported or failed:', error);
    }
  }, [settings.hapticFeedback]);

  // Advanced touch gesture recognition
  const recognizeGesture = useCallback((touches: TouchList, type: 'start' | 'move' | 'end'): TouchGesture | null => {
    if (!settings.gestureRecognition || touches.length === 0) return null;

    const touch = touches[0];
    const touchId = touch.identifier;
    const position = { x: touch.clientX, y: touch.clientY };
    const now = performance.now();

    if (type === 'start') {
      touchStartTimes.current.set(touchId, now);
      return null;
    }

    const startTime = touchStartTimes.current.get(touchId);
    if (!startTime) return null;

    const duration = now - startTime;

    if (type === 'end') {
      touchStartTimes.current.delete(touchId);
      
      // Determine gesture type based on duration and movement
      if (duration < 200) {
        return { type: 'tap', startPosition: position, duration };
      } else if (duration > 500) {
        return { type: 'hold', startPosition: position, duration };
      }
    }

    return null;
  }, [settings.gestureRecognition]);

  // Touch area optimization for different screen sizes
  const getOptimalTouchTargetSize = useCallback((): number => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenDiagonal = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
    
    // Scale touch targets based on screen size
    if (screenDiagonal < 1000) { // Small phones
      return 72;
    } else if (screenDiagonal < 1300) { // Regular phones
      return 80;
    } else { // Large phones/tablets
      return 88;
    }
  }, []);

  // Performance monitoring and automatic adjustments
  const monitorPerformance = useCallback(() => {
    const startTime = performance.now();
    
    requestAnimationFrame(() => {
      const frameTime = performance.now() - startTime;
      performanceMetrics.current.avgFrameTime = 
        (performanceMetrics.current.avgFrameTime * 0.9) + (frameTime * 0.1);
      
      if (frameTime > 32) { // Frame drop detected (60fps -> 30fps)
        performanceMetrics.current.frameDrops++;
        
        // Auto-adjust performance mode if too many drops
        if (performanceMetrics.current.frameDrops > 10 && settings.performanceMode === 'quality') {
          setSettings(prev => ({ ...prev, performanceMode: 'performance' }));
          console.log('🏃‍♂️ Auto-switched to performance mode due to frame drops');
        }
      }
    });
  }, [settings.performanceMode]);

  // Touch sensitivity calibration
  const calibrateTouchSensitivity = useCallback((userPreference: 'low' | 'normal' | 'high') => {
    const sensitivityMap = {
      low: 0.7,
      normal: 1.0,
      high: 1.3
    };
    
    setSettings(prev => ({ 
      ...prev, 
      touchSensitivity: sensitivityMap[userPreference] 
    }));
  }, []);

  // Gesture-based shortcuts
  const handleGameGestures = useCallback((gesture: TouchGesture) => {
    gestureHistory.current.push(gesture);
    if (gestureHistory.current.length > 10) {
      gestureHistory.current = gestureHistory.current.slice(-10);
    }

    setTouchMetrics(prev => ({
      ...prev,
      gesturesDetected: prev.gesturesDetected + 1
    }));

    // Return gesture commands for the game
    switch (gesture.type) {
      case 'tap':
        return 'strum';
      case 'hold':
        if (gesture.duration > 1000) {
          return 'star_power';
        }
        return null;
      case 'swipe':
        return 'menu_swipe';
      default:
        return null;
    }
  }, []);

  // Smart UI scaling based on device
  const getUIScale = useCallback((): number => {
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = window.innerWidth;
    
    // Adjust UI scale based on screen density and size
    if (dpr >= 3 && screenWidth < 400) { // High-DPI small screens
      return 0.9;
    } else if (dpr >= 2 && screenWidth < 500) { // Regular high-DPI
      return 1.0;
    } else if (screenWidth > 768) { // Tablets
      return 1.1;
    }
    
    return 1.0;
  }, []);

  // Performance mode effects
  useEffect(() => {
    const applyPerformanceMode = () => {
      const root = document.documentElement;
      
      switch (settings.performanceMode) {
        case 'performance':
          root.style.setProperty('--animation-duration', '0.1s');
          root.style.setProperty('--transition-duration', '0.1s');
          break;
        case 'battery':
          root.style.setProperty('--animation-duration', '0s');
          root.style.setProperty('--transition-duration', '0s');
          break;
        default: // quality
          root.style.setProperty('--animation-duration', '0.3s');
          root.style.setProperty('--transition-duration', '0.2s');
          break;
      }
    };

    applyPerformanceMode();
  }, [settings.performanceMode]);

  // Monitor performance regularly
  useEffect(() => {
    const interval = setInterval(monitorPerformance, 1000);
    return () => clearInterval(interval);
  }, [monitorPerformance]);

  return {
    settings,
    touchMetrics,
    supportsHaptics,
    triggerHapticFeedback,
    recognizeGesture,
    getOptimalTouchTargetSize,
    calibrateTouchSensitivity,
    handleGameGestures,
    getUIScale,
    updateSettings: setSettings,
    performanceMetrics: performanceMetrics.current
  };
};
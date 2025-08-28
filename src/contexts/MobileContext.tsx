import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MobileContextType {
  isMobile: boolean;
  isTouch: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

interface MobileProviderProps {
  children: ReactNode;
}

const MOBILE_BREAKPOINT = 768;

export function MobileProvider({ children }: MobileProviderProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTouch, setIsTouch] = useState<boolean>(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Check screen size for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial checks
    checkTouch();
    checkMobile();

    // Set up resize listener
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile, isTouch }}>
      {children}
    </MobileContext.Provider>
  );
}

export function useMobile() {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
}
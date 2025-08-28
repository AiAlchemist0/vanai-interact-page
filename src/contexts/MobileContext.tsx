import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';

const MOBILE_BREAKPOINT = 768;
const RESIZE_DEBOUNCE_MS = 100;

interface MobileContextType {
  isMobile: boolean;
  isHydrated: boolean;
  breakpoint: number;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

interface MobileProviderProps {
  children: React.ReactNode;
}

export const MobileProvider: React.FC<MobileProviderProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Debounced resize handler to prevent excessive re-renders
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCheckMobile = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          const mobile = window.innerWidth < MOBILE_BREAKPOINT;
          setIsMobile(mobile);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Mobile context update:', {
              windowWidth: window.innerWidth,
              isMobile: mobile,
              breakpoint: MOBILE_BREAKPOINT,
              timestamp: Date.now()
            });
          }
        }
      } catch (error) {
        console.error('Mobile detection error:', error);
        setIsMobile(false); // Safe fallback
      }
    }, RESIZE_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    try {
      // Mark as hydrated on mount
      setIsHydrated(true);
      
      // Initial mobile check with safety
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth < MOBILE_BREAKPOINT;
        setIsMobile(mobile);
      }

      // Set up debounced resize listener
      window.addEventListener('resize', debouncedCheckMobile);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        window.removeEventListener('resize', debouncedCheckMobile);
      };
    } catch (error) {
      console.error('Mobile context initialization error:', error);
      setIsHydrated(true);
      setIsMobile(false); // Safe fallback
    }
  }, [debouncedCheckMobile]);

  const contextValue = useMemo(() => ({
    isMobile: isHydrated ? isMobile : false,
    isHydrated,
    breakpoint: MOBILE_BREAKPOINT
  }), [isMobile, isHydrated]);

  return (
    <MobileContext.Provider value={contextValue}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = (): MobileContextType => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

// Backward compatibility hook
export const useIsMobile = () => {
  const { isMobile } = useMobile();
  return isMobile;
};
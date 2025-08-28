import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

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
  const debouncedCheckMobile = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
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
    };

    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, RESIZE_DEBOUNCE_MS);
    };
  }, []);

  useEffect(() => {
    // Mark as hydrated on mount
    setIsHydrated(true);
    
    // Initial mobile check
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);

    // Set up debounced resize listener
    const handleResize = debouncedCheckMobile();
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
import React, { createContext, useContext, useLayoutEffect, useState, useCallback } from "react";

const MOBILE_BREAKPOINT = 768;

interface MobileContextType {
  isMobile: boolean;
  isLoading: boolean;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    // Fallback for when context is not available
    return { isMobile: false, isLoading: false };
  }
  return context;
};

export const MobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkMobile = useCallback(() => {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      setIsLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    checkMobile();

    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = () => checkMobile();

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [checkMobile]);

  return (
    <MobileContext.Provider value={{ isMobile, isLoading }}>
      {children}
    </MobileContext.Provider>
  );
};
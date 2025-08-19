import React, { createContext, useContext, useRef, useState } from 'react';

interface RefreshFunction {
  (): Promise<void> | void;
}

interface AnalyticsRefreshContextType {
  registerRefresh: (key: string, refreshFn: RefreshFunction) => void;
  unregisterRefresh: (key: string) => void;
  refreshAll: () => Promise<void>;
  isRefreshing: boolean;
}

const AnalyticsRefreshContext = createContext<AnalyticsRefreshContextType | undefined>(undefined);

export const AnalyticsRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const refreshFunctions = useRef<Map<string, RefreshFunction>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const registerRefresh = (key: string, refreshFn: RefreshFunction) => {
    refreshFunctions.current.set(key, refreshFn);
  };

  const unregisterRefresh = (key: string) => {
    refreshFunctions.current.delete(key);
  };

  const refreshAll = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      const allRefreshPromises = Array.from(refreshFunctions.current.values()).map(refreshFn => {
        const result = refreshFn();
        return result instanceof Promise ? result : Promise.resolve();
      });
      
      await Promise.all(allRefreshPromises);
    } catch (error) {
      console.error('Error during refresh all:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AnalyticsRefreshContext.Provider value={{
      registerRefresh,
      unregisterRefresh,
      refreshAll,
      isRefreshing
    }}>
      {children}
    </AnalyticsRefreshContext.Provider>
  );
};

export const useAnalyticsRefresh = () => {
  const context = useContext(AnalyticsRefreshContext);
  if (context === undefined) {
    throw new Error('useAnalyticsRefresh must be used within an AnalyticsRefreshProvider');
  }
  return context;
};
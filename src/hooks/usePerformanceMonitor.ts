import { useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  memoryUsage?: number;
  renderTime: number;
  componentName: string;
}

export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(Date.now());
  const mountTime = useRef<number>(Date.now());

  useEffect(() => {
    mountTime.current = Date.now();
    renderStartTime.current = Date.now();
  }, []);

  const logPerformanceMetric = useCallback((metrics: PerformanceMetrics) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, metrics);
    }
  }, [componentName]);

  const measureRender = useCallback(() => {
    const renderTime = Date.now() - renderStartTime.current;
    const memoryUsage = (performance as any).memory?.usedJSHeapSize;
    
    logPerformanceMetric({
      componentName,
      renderTime,
      memoryUsage: memoryUsage ? Math.round(memoryUsage / 1024 / 1024) : undefined
    });
    
    renderStartTime.current = Date.now();
  }, [componentName, logPerformanceMetric]);

  const measureAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await asyncFunction();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName}.${operationName}: ${(end - start).toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`[Performance] ${componentName}.${operationName} failed after ${(end - start).toFixed(2)}ms:`, error);
      throw error;
    }
  }, [componentName]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const totalTime = Date.now() - mountTime.current;
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} total lifetime: ${totalTime}ms`);
      }
    };
  }, [componentName]);

  return {
    measureRender,
    measureAsync,
    logPerformanceMetric
  };
};
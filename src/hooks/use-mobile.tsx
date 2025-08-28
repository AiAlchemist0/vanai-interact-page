// Deprecated: Use useMobile from MobileContext instead
import { useIsMobile as useIsMobileFromContext } from '@/contexts/MobileContext';

export function useIsMobile() {
  return useIsMobileFromContext();
}

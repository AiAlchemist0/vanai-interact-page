import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with false to prevent layout thrashing, will update after hydration
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Mark as hydrated to prevent SSR mismatch
    setIsHydrated(true)
    
    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      
      // Mobile debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Mobile detection:', {
          windowWidth: window.innerWidth,
          isMobile: mobile,
          breakpoint: MOBILE_BREAKPOINT,
          userAgent: navigator.userAgent.includes('Mobile')
        })
      }
      
      return mobile
    }

    // Initial check
    checkMobile()

    // Set up responsive listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkMobile()
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return false during SSR/initial render to prevent hydration issues
  return isHydrated ? isMobile : false
}

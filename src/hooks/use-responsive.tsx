
import * as React from "react";

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export type Breakpoint = keyof typeof breakpoints;

/**
 * A hook that returns true if the screen width is less than or equal to the specified breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoints[breakpoint] - 1}px)`);
    
    const onChange = () => {
      setIsBelow(mql.matches);
    };
    
    mql.addEventListener("change", onChange);
    onChange(); // Initial check
    
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isBelow;
}

/**
 * A hook that returns true if the screen width is greater than or equal to the specified breakpoint
 */
export function useBreakpointUp(breakpoint: Breakpoint) {
  const [isAbove, setIsAbove] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    
    const onChange = () => {
      setIsAbove(mql.matches);
    };
    
    mql.addEventListener("change", onChange);
    onChange(); // Initial check
    
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return !!isAbove;
}

/**
 * A hook that returns the current breakpoint
 */
export function useCurrentBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<Breakpoint>("xs");

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints["2xl"]) return setCurrentBreakpoint("2xl");
      if (width >= breakpoints.xl) return setCurrentBreakpoint("xl");
      if (width >= breakpoints.lg) return setCurrentBreakpoint("lg");
      if (width >= breakpoints.md) return setCurrentBreakpoint("md");
      if (width >= breakpoints.sm) return setCurrentBreakpoint("sm");
      return setCurrentBreakpoint("xs");
    };

    window.addEventListener("resize", checkBreakpoint);
    checkBreakpoint(); // Initial check
    
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return currentBreakpoint;
}

// For backward compatibility with existing code
export function useIsMobile() {
  return useBreakpoint("md");
}

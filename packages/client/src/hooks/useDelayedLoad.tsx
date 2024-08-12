import { useState, useEffect, useRef } from "react";

/**
 * Custom hook that delays the visibility of a loader to prevent flickering.
 *
 * @param value - to determine if the loader should be shown.
 * @param minWaitTime - to wait before switching from true to false, default - 300ms.
 * @returns boolean - to determine if the loader should be shown
 **/

export function useDelayedLoad(value: boolean, minWaitTime: number = 300) {
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout before setting a new one
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    if (value) {
      setShouldShowLoader(true);
    } else {
      loadingTimerRef.current = setTimeout(() => {
        setShouldShowLoader(false);
      }, minWaitTime);
    }

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [minWaitTime, value]);

  return shouldShowLoader;
}

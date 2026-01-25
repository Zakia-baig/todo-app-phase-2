'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if we're running on the client side.
 * This is useful for components that need to access browser APIs like localStorage.
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
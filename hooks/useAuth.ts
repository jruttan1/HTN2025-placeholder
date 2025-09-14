"use client"

import { useEffect, useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we have authentication cookies (only on client side)
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find(cookie => 
          cookie.trim().startsWith('optimate_session=authenticated')
        );
        
        console.log('useAuth - Session cookie found:', !!sessionCookie);
        console.log('useAuth - All cookies:', document.cookie);
        
        const authenticated = !!sessionCookie;
        console.log('useAuth - Final authenticated state:', authenticated);
        setIsAuthenticated(authenticated);
        setIsLoading(false);
      };

      // Check immediately first, then with a small delay as fallback
      checkAuth();
      setTimeout(checkAuth, 100);
    } else {
      // On server side, assume not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  return {
    user: null, // We're not using Auth0 user for now
    isLoading,
    error: null,
    isAuthenticated
  };
}

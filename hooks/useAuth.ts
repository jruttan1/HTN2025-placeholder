"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';

export function useAuth() {
  const { user, isLoading, error } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if we have authentication cookies (only on client side)
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => 
          cookie.trim().startsWith('auth0.is.authenticated=')
        );
        
        setIsAuthenticated(!!authCookie || !!user);
      };

      checkAuth();
    }
  }, [user]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: isAuthenticated || !!user
  };
}

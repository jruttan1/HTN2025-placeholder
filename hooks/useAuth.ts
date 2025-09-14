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
        const sessionCookie = cookies.find(cookie => 
          cookie.trim().startsWith('optimate_session=authenticated')
        );
        
        console.log('useAuth - Session cookie found:', !!sessionCookie);
        console.log('useAuth - Auth0 user:', !!user);
        console.log('useAuth - All cookies:', document.cookie);
        
        setIsAuthenticated(!!sessionCookie || !!user);
      };

      checkAuth();
    }
  }, [user]);

  // If Auth0 user exists, consider authenticated
  const finalAuthState = isAuthenticated || !!user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated: finalAuthState
  };
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'pillpal_simulated_isLoggedIn';

export function useSimulatedAuth() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Start as true until checked client-side

  useEffect(() => {
    // This effect runs only on the client after hydration
    const storedAuthStatus = localStorage.getItem(AUTH_KEY);
    setIsLoggedIn(storedAuthStatus === 'true');
    setIsLoadingAuth(false);
  }, []);

  const loginAction = useCallback(() => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsLoggedIn(true);
    // The redirect itself will be handled by the login page after server action success
  }, []);

  const logoutAction = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
    router.push('/login'); // Redirect to login page after logout
  }, [router]);

  return { isLoggedIn, loginAction, logoutAction, isLoadingAuth };
}

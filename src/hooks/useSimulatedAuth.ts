
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SimulatedUser } from '@/app/actions/auth'; // Import the type

const AUTH_KEY = 'pillpal_simulated_auth_user'; // Changed key to reflect storing user object

interface AuthData {
  isLoggedIn: boolean;
  currentUser: SimulatedUser | null;
}

export function useSimulatedAuth() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>({ isLoggedIn: false, currentUser: null });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedAuthDataString = localStorage.getItem(AUTH_KEY);
    if (storedAuthDataString) {
      try {
        const storedAuthData = JSON.parse(storedAuthDataString) as AuthData;
        setAuthData(storedAuthData);
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem(AUTH_KEY); // Clear corrupted data
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const loginAction = useCallback((user: SimulatedUser) => {
    const newAuthData: AuthData = { isLoggedIn: true, currentUser: user };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
    setAuthData(newAuthData);
    // Redirect is handled by the calling page (login/signup)
  }, []);

  const logoutAction = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuthData({ isLoggedIn: false, currentUser: null });
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUser: SimulatedUser) => {
    setAuthData(prevData => {
      const newAuthData = { ...prevData, currentUser: updatedUser, isLoggedIn: true };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
      return newAuthData;
    });
  }, []);


  return { ...authData, loginAction, logoutAction, updateCurrentUser, isLoadingAuth };
}

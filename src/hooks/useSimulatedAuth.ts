
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SimulatedUser } from '@/app/actions/auth'; // Import the type

const AUTH_KEY = 'online_medicine_ordering_auth_user'; // Updated key

export interface CartItem {
  medicineId: string;
  quantity: number;
}

interface AuthData {
  isLoggedIn: boolean;
  currentUser: SimulatedUser | null;
  cartItems: CartItem[];
}

export function useSimulatedAuth() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>({ isLoggedIn: false, currentUser: null, cartItems: [] });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedAuthDataString = localStorage.getItem(AUTH_KEY);
    if (storedAuthDataString) {
      try {
        const storedAuthData = JSON.parse(storedAuthDataString) as AuthData;
        setAuthData({
          isLoggedIn: storedAuthData.isLoggedIn || false,
          currentUser: storedAuthData.currentUser || null,
          cartItems: storedAuthData.cartItems || []
        });
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem(AUTH_KEY); // Clear corrupted data
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const loginAction = useCallback((user: SimulatedUser) => {
    // Preserve cart items if user logs in and had items as a guest (if we implement guest cart later)
    // For now, new login clears cart or uses stored cart if any.
    // Let's assume login might merge or replace cart - for now, it replaces with what's stored for that user (which is part of AuthData)
    // or starts fresh if no cart was stored with user.
    // The current structure means cart is tied to the overall AuthData blob.
    const currentCart = authData.cartItems; // Get current cart before overwriting authData
    const newAuthData: AuthData = { isLoggedIn: true, currentUser: user, cartItems: user.email === authData.currentUser?.email ? currentCart : [] }; // Simple: new user, new cart.
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
    setAuthData(newAuthData);
  }, [authData.cartItems, authData.currentUser?.email]);

  const logoutAction = useCallback(() => {
    // Decide if cart should be cleared on logout. Typically yes, or moved to a "guest cart".
    // For this simulation, let's clear it.
    const newAuthData: AuthData = { isLoggedIn: false, currentUser: null, cartItems: [] };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
    setAuthData(newAuthData);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUser: SimulatedUser) => {
    setAuthData(prevData => {
      const newAuthData = { ...prevData, currentUser: updatedUser, isLoggedIn: true };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
      return newAuthData;
    });
  }, []);

  const addToCart = useCallback((medicineId: string) => {
    setAuthData(prevData => {
      const existingItemIndex = prevData.cartItems.findIndex(item => item.medicineId === medicineId);
      let updatedCartItems;
      if (existingItemIndex > -1) {
        updatedCartItems = prevData.cartItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCartItems = [...prevData.cartItems, { medicineId, quantity: 1 }];
      }
      const newAuthData = { ...prevData, cartItems: updatedCartItems };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
      return newAuthData;
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setAuthData(prevData => {
      const updatedCartItems = prevData.cartItems.filter(item => item.medicineId !== medicineId);
      const newAuthData = { ...prevData, cartItems: updatedCartItems };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
      return newAuthData;
    });
  }, []);

  const updateCartItemQuantity = useCallback((medicineId: string, newQuantity: number) => {
    setAuthData(prevData => {
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        const updatedCartItems = prevData.cartItems.filter(item => item.medicineId !== medicineId);
        const newAuthData = { ...prevData, cartItems: updatedCartItems };
        localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
        return newAuthData;

      } else {
        const updatedCartItems = prevData.cartItems.map(item =>
          item.medicineId === medicineId ? { ...item, quantity: newQuantity } : item
        );
        const newAuthData = { ...prevData, cartItems: updatedCartItems };
        localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
        return newAuthData;
      }
    });
  }, []);
  
  const clearCart = useCallback(() => {
    setAuthData(prevData => {
      const newAuthData = { ...prevData, cartItems: [] };
      localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
      return newAuthData;
    });
  }, []);


  return { 
    ...authData, 
    loginAction, 
    logoutAction, 
    updateCurrentUser, 
    isLoadingAuth,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  };
}

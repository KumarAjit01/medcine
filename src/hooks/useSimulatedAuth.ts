
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SimulatedUser } from '@/app/actions/auth'; // Import the type

const AUTH_KEY = 'online_medicine_ordering_auth_user'; 

export interface CartItem {
  medicineId: string;
  quantity: number;
}

interface AuthData {
  isLoggedIn: boolean;
  currentUser: SimulatedUser | null;
  cartItems: CartItem[];
  isAdmin: boolean; // Added isAdmin flag
}

const ADMIN_EMAIL = "test@example.com"; // Define admin email

export function useSimulatedAuth() {
  const router = useRouter();
  const [authData, setAuthData] = useState<AuthData>({ 
    isLoggedIn: false, 
    currentUser: null, 
    cartItems: [],
    isAdmin: false 
  });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const storedAuthDataString = localStorage.getItem(AUTH_KEY);
    if (storedAuthDataString) {
      try {
        const storedAuthData = JSON.parse(storedAuthDataString) as Omit<AuthData, 'isAdmin'>; // Stored data might not have isAdmin
        setAuthData({
          isLoggedIn: storedAuthData.isLoggedIn || false,
          currentUser: storedAuthData.currentUser || null,
          cartItems: storedAuthData.cartItems || [],
          isAdmin: storedAuthData.currentUser?.email === ADMIN_EMAIL
        });
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem(AUTH_KEY); // Clear corrupted data
      }
    }
    setIsLoadingAuth(false);
  }, []);

  const loginAction = useCallback((user: SimulatedUser) => {
    const currentCart = authData.cartItems; 
    const newAuthData: AuthData = { 
      isLoggedIn: true, 
      currentUser: user, 
      cartItems: user.email === authData.currentUser?.email ? currentCart : [],
      isAdmin: user.email === ADMIN_EMAIL
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
    setAuthData(newAuthData);
  }, [authData.cartItems, authData.currentUser?.email]);

  const logoutAction = useCallback(() => {
    const newAuthData: AuthData = { isLoggedIn: false, currentUser: null, cartItems: [], isAdmin: false };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData));
    setAuthData(newAuthData);
    router.push('/login');
  }, [router]);

  const updateCurrentUser = useCallback((updatedUser: SimulatedUser) => {
    setAuthData(prevData => {
      const newAuthData = { 
        ...prevData, 
        currentUser: updatedUser, 
        isLoggedIn: true,
        isAdmin: updatedUser.email === ADMIN_EMAIL
      };
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

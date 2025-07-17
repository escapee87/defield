"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = "WRT123"; // This is insecure. For demo purposes only.

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('isAdminAuthenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.error("Could not access localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('isAdminAuthenticated', 'true');
      } catch (error) {
        console.error("Could not access localStorage", error);
      }
    } else {
      throw new Error('Incorrect password.');
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('isAdminAuthenticated');
    } catch (error) {
        console.error("Could not access localStorage", error);
    }
    router.push('/login');
  }, [router]);
  
  const value = { isAuthenticated, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

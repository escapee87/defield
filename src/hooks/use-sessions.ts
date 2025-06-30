"use client";

import { useContext } from 'react';
import { SessionContext } from '@/components/session-provider';

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};

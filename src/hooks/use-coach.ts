"use client";

import { useContext } from 'react';
import { CoachContext } from '@/components/coach-provider';

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (context === undefined) {
    throw new Error('useCoach must be used within a CoachProvider');
  }
  return context;
};

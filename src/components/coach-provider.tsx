"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';

export interface CoachInfo {
  coachName: string;
  coachEmail: string;
  coachPhone: string;
}

interface CoachContextType {
  coach: CoachInfo | null;
  setCoach: (coachInfo: CoachInfo) => void;
  clearCoach: () => void;
  isLoading: boolean;
}

export const CoachContext = createContext<CoachContextType | undefined>(undefined);

const COACH_INFO_KEY = 'fieldsync-coach-info';

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [coach, setCoachState] = useState<CoachInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedCoachInfo = localStorage.getItem(COACH_INFO_KEY);
      if (storedCoachInfo) {
        setCoachState(JSON.parse(storedCoachInfo));
      }
    } catch (error) {
        console.error("Could not access localStorage", error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const setCoach = useCallback((coachInfo: CoachInfo) => {
    setCoachState(coachInfo);
    try {
      localStorage.setItem(COACH_INFO_KEY, JSON.stringify(coachInfo));
    } catch (error) {
      console.error("Could not access localStorage", error);
    }
  }, []);

  const clearCoach = useCallback(() => {
    setCoachState(null);
    try {
      localStorage.removeItem(COACH_INFO_KEY);
    } catch (error) {
        console.error("Could not access localStorage", error);
    }
  }, []);
  
  const value = { coach, setCoach, clearCoach, isLoading };

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  );
}

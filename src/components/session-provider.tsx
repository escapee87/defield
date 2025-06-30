"use client";

import React, { createContext, useState, useCallback } from 'react';
import { initialSessions } from '@/lib/data';
import type { Session, Registration } from '@/lib/types';

interface SessionContextType {
  sessions: Session[];
  createSession: (date: Date, time: string) => void;
  cancelSession: (sessionId: string) => 'cancelled' | 'removed';
  registerTeam: (sessionId: string, registrationDetails: Omit<Registration, 'id' | 'checkedIn'>) => void;
  checkInTeam: (sessionId: string, registrationId: string) => string | undefined;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const createSession = useCallback((date: Date, time: string) => {
    const newSession: Session = {
      id: `ses_${new Date().getTime()}`,
      date,
      time,
      capacity: 6,
      registrations: [],
      status: 'active',
    };
    setSessions(prev => [...prev, newSession].sort((a, b) => a.date.getTime() - b.date.getTime()));
  }, []);

  const cancelSession = useCallback((sessionId: string): 'cancelled' | 'removed' => {
    const sessionToCancel = sessions.find(s => s.id === sessionId);
    if (!sessionToCancel) {
        return 'removed';
    }

    if (sessionToCancel.registrations.length > 0) {
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId ? { ...s, status: 'cancelled' } : s
        )
      );
      return 'cancelled';
    } else {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      return 'removed';
    }
  }, [sessions]);

  const registerTeam = useCallback((sessionId: string, registrationDetails: Omit<Registration, 'id' | 'checkedIn'>) => {
      const newRegistration: Registration = {
        id: `reg_${new Date().getTime()}`,
        ...registrationDetails,
        checkedIn: false,
      };

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId
            ? { ...session, registrations: [...session.registrations, newRegistration] }
            : session
        )
      );
  }, []);

  const checkInTeam = useCallback((sessionId: string, registrationId: string): string | undefined => {
    let teamName: string | undefined = undefined;
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          const updatedRegistrations = session.registrations.map(reg => {
            if (reg.id === registrationId) {
              teamName = reg.teamName;
              return { ...reg, checkedIn: true };
            }
            return reg;
          });
          return { ...session, registrations: updatedRegistrations };
        }
        return session;
      })
    );
    return teamName;
  }, []);

  const value = { sessions, createSession, cancelSession, registerTeam, checkInTeam };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

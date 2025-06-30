"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { initialSessions } from '@/lib/data';
import type { Session } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Users } from 'lucide-react';

export function MonitorView() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckIn = (registrationId: string) => {
    if (!selectedSessionId) return;

    let teamName = '';
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === selectedSessionId) {
          return {
            ...session,
            registrations: session.registrations.map(reg => {
              if (reg.id === registrationId) {
                teamName = reg.teamName;
                return { ...reg, checkedIn: true };
              }
              return reg;
            }),
          };
        }
        return session;
      })
    );
    toast({
        title: 'Team Checked In',
        description: `${teamName} has been successfully checked in.`,
    })
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);
  const checkedInCount = selectedSession?.registrations.filter(r => r.checkedIn).length || 0;
  const totalCount = selectedSession?.registrations.length || 0;
  const attendanceProgress = totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select a Session</CardTitle>
          <CardDescription>Choose a session from the dropdown to view and manage attendance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedSessionId} value={selectedSessionId || ''}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a session..." />
            </SelectTrigger>
            <SelectContent>
              {sessions.map(session => (
                <SelectItem key={session.id} value={session.id}>
                  {format(session.date, 'EEEE, MMMM d')} @ {session.time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <span>Attendance for {format(selectedSession.date, 'MMMM d')}</span>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {checkedInCount} / {totalCount} Checked In
                </span>
            </CardTitle>
             <div className="pt-2">
                <Progress value={attendanceProgress} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Coach Name</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSession.registrations.length > 0 ? (
                    selectedSession.registrations.map(reg => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.teamName}</TableCell>
                        <TableCell>{reg.coachName}</TableCell>
                        <TableCell className="text-center">
                          {reg.checkedIn ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800">
                               <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <XCircle className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(reg.id)}
                            disabled={reg.checkedIn}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Check In
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            No teams registered for this session.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

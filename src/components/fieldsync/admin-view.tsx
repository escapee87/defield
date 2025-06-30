"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Trash2, PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';

import { initialSessions } from '@/lib/data';
import type { Session } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '../ui/badge';

const sessionSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:MM - HH:MM format.',
  }),
});

export function AdminView() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { time: '' },
  });

  const handleCreateSession = (values: z.infer<typeof sessionSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newSession: Session = {
        id: `ses_${new Date().getTime()}`,
        date: values.date,
        time: values.time,
        capacity: 6,
        registrations: [],
        status: 'active',
      };
      setSessions(prev => [...prev, newSession].sort((a, b) => a.date.getTime() - b.date.getTime()));
      toast({
        title: 'Session Created!',
        description: `New session on ${format(values.date, 'MMMM d')} at ${values.time} is now available.`,
      });
      form.reset({ time: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancelSession = (sessionId: string) => {
    const sessionToCancel = sessions.find(s => s.id === sessionId);
    if (!sessionToCancel) return;

    if (sessionToCancel.registrations.length > 0) {
      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId ? { ...s, status: 'cancelled' } : s
        )
      );
      toast({
        title: 'Session Cancelled',
        description: `The session on ${format(sessionToCancel.date, 'MMMM d')} is marked as cancelled.`,
      });
    } else {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        variant: 'destructive',
        title: 'Session Removed',
        description: `The empty session on ${format(sessionToCancel.date, 'MMMM d')} has been removed.`,
      });
    }
  };

  return (
    <Tabs defaultValue="manage" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manage">Manage Sessions</TabsTrigger>
        <TabsTrigger value="create">Create Session</TabsTrigger>
      </TabsList>
      <TabsContent value="manage">
        <Card>
          <CardHeader>
            <CardTitle>Existing Sessions</CardTitle>
            <CardDescription>View, manage, and see registrations for all scheduled sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {sessions.map(session => (
                  <AccordionItem value={session.id} key={session.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <p className="font-semibold">{format(session.date, 'EEEE, MMMM d')}</p>
                            <p className="text-sm text-muted-foreground">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {session.status === 'cancelled' && (
                            <Badge variant="outline" className="text-destructive border-destructive">Cancelled</Badge>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{session.registrations.length} / {session.capacity}</span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-muted/50 rounded-md">
                        {session.registrations.length > 0 ? (
                          <ul className="space-y-2">
                            {session.registrations.map(reg => (
                              <li key={reg.id} className="text-sm">
                                <strong>{reg.teamName}</strong> - {reg.coachName} ({reg.coachEmail})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">No teams registered yet.</p>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="mt-4" disabled={session.status === 'cancelled'}>
                              <Trash2 className="mr-2 h-4 w-4" /> Cancel Session
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently cancel the session for {format(session.date, 'MMMM d')} and notify all registered teams. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Back</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancelSession(session.id)}>Confirm Cancellation</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sessions scheduled.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>Set up a new practice session. Capacity is fixed at 6 teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateSession)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Session Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}/>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Time</FormLabel>
                      <FormControl>
                        <div className="relative w-[240px]">
                           <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="e.g. 16:00 - 17:00" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" variant="destructive" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Create Session
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

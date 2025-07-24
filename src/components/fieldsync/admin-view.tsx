"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, Trash2, PlusCircle, Loader2 } from 'lucide-react';

import { useSessions } from '@/hooks/use-sessions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '../ui/badge';

const sessionSchema = z.object({
  dates: z.array(z.date()).min(1, { message: 'Please select at least one date.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:MM - HH:MM format.',
  }),
});

export function AdminView() {
  const { sessions, createSession, cancelSession } = useSessions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { dates: [], time: '' },
  });

  const handleCreateSession = (values: z.infer<typeof sessionSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      values.dates.forEach(date => {
        createSession(date, values.time);
      });
      toast({
        title: `${values.dates.length} Session(s) Created!`,
        description: `New sessions at ${values.time} are now available.`,
      });
      form.reset({ dates: [], time: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancelSession = (sessionId: string) => {
    const sessionToCancel = sessions.find(s => s.id === sessionId);
    if (!sessionToCancel) return;

    const result = cancelSession(sessionId);

    if (result === 'cancelled') {
      toast({
        title: 'Session Cancelled',
        description: `The session on ${format(sessionToCancel.date, 'MMMM d')} is marked as cancelled.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Session Removed',
        description: `The empty session on ${format(sessionToCancel.date, 'MMMM d')} has been removed.`,
      });
    }
  };

  const upcomingSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sessions
      .filter(session => session.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sessions]);

  const pastSessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sessions
      .filter(session => session.date < today)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [sessions]);

  return (
    <Tabs defaultValue="manage" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="manage">Manage Sessions</TabsTrigger>
        <TabsTrigger value="create">Create Session</TabsTrigger>
        <TabsTrigger value="history">Session History</TabsTrigger>
      </TabsList>
      <TabsContent value="manage">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>View, manage, and see registrations for all upcoming sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {upcomingSessions.map(session => (
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
              <p className="text-center text-muted-foreground py-8">No upcoming sessions scheduled.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create New Session(s)</CardTitle>
            <CardDescription>Set up new practice sessions. Capacity is fixed at 6 teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateSession)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Session Date(s)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-[240px] pl-3 text-left font-normal", !field.value?.length && "text-muted-foreground")}
                            >
                              {field.value?.length
                                ? field.value.length === 1
                                  ? format(field.value[0], "PPP")
                                  : `${field.value.length} dates selected`
                                : <span>Pick one or more dates</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="multiple"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
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
                  Create Session(s)
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Past Sessions</CardTitle>
            <CardDescription>View and see registrations for all past sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastSessions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {pastSessions.map(session => (
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
                          <p className="text-sm text-muted-foreground">No teams registered.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sessions have been scheduled.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

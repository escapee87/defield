"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Users, User, Mail, Phone, Loader2, ArrowRight } from 'lucide-react';

import { initialSessions } from '@/lib/data';
import type { Session, Registration } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const registrationSchema = z.object({
  teamName: z.string().min(2, { message: 'Team name must be at least 2 characters.' }),
  coachName: z.string().min(2, { message: 'Coach name must be at least 2 characters.' }),
  coachEmail: z.string().email({ message: 'Please enter a valid email.' }),
  coachPhone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

export function CoachView() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: '',
      coachName: '',
      coachEmail: '',
      coachPhone: '',
    },
  });

  const handleRegistration = (sessionId: string, values: z.infer<typeof registrationSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const newRegistration: Registration = {
        id: `reg_${new Date().getTime()}`,
        ...values,
        checkedIn: false,
      };

      setSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === sessionId
            ? { ...session, registrations: [...session.registrations, newRegistration] }
            : session
        )
      );

      toast({
        title: "Registration Successful!",
        description: `Your team, ${values.teamName}, is registered. A confirmation email has been sent.`,
      });
      setIsSubmitting(false);
      form.reset();
    }, 1000);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map(session => {
        const isFull = session.registrations.length >= session.capacity;
        const progressValue = (session.registrations.length / session.capacity) * 100;
        
        return (
          <Dialog key={session.id} onOpenChange={(open) => !open && form.reset()}>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{format(session.date, 'EEEE, MMMM d')}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <Clock className="h-4 w-4" />
                  <span>{session.time}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Registered Teams
                    </span>
                    <span>{session.registrations.length} / {session.capacity}</span>
                  </div>
                  <Progress value={progressValue} aria-label={`${progressValue}% full`} />
                </div>
              </CardContent>
              <CardFooter>
                <DialogTrigger asChild>
                  <Button variant={isFull ? "secondary" : "destructive"} disabled={isFull} className="w-full">
                    {isFull ? 'Session Full' : 'Register Team'}
                    {!isFull && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </DialogTrigger>
              </CardFooter>
            </Card>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Register for Session</DialogTitle>
                <DialogDescription>
                  Enter your team's details to register for the session on {format(session.date, 'MMMM d')} at {session.time}.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((values) => handleRegistration(session.id, values))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                           <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. FC Eagles" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coachName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coach Name</FormLabel>
                         <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. John Smith" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coachEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coach Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. coach@example.com" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="coachPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coach Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="e.g. 123-456-7890" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" variant="destructive" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Registration
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Star, MessageSquare, Send, Loader2, ArrowLeft, ArrowRight, Calendar, Clock, Users } from 'lucide-react';

import { useSessions } from '@/hooks/use-sessions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const reportSchema = z.object({
  sessionId: z.string().min(1, { message: "A session must be selected." }),
  registrationId: z.string().min(1, { message: "You must select your team to submit a report." }),
  rating: z.number().min(1, { message: "Please select a star rating." }).max(5),
  comments: z.string().max(500, { message: "Comments cannot exceed 500 characters." }).optional(),
});

export function FieldReportForm() {
  const { sessions, submitFieldReport } = useSessions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const pastOrCurrentSessions = useMemo(() => sessions
    .filter(session => new Date(session.date) <= new Date() && session.registrations.length > 0)
    .sort((a, b) => b.date.getTime() - a.date.getTime()), [sessions]);
  
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      sessionId: '',
      registrationId: '',
      rating: 0,
      comments: '',
    },
  });

  useEffect(() => {
    if (pastOrCurrentSessions.length > 0) {
      form.setValue('sessionId', pastOrCurrentSessions[currentSessionIndex].id, { shouldValidate: true });
      form.resetField('registrationId', { defaultValue: '' });
    } else {
        form.reset({ sessionId: '', registrationId: '', rating: 0, comments: '' });
    }
  }, [currentSessionIndex, pastOrCurrentSessions, form]);

  const rating = form.watch('rating');
  const selectedSession = pastOrCurrentSessions[currentSessionIndex];

  const handleSubmitReport = (values: z.infer<typeof reportSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitFieldReport(values);
      toast({
        title: 'Report Submitted!',
        description: 'Thank you for your feedback on the field conditions.',
      });
      form.reset({
        sessionId: pastOrCurrentSessions.length > 0 ? pastOrCurrentSessions[0].id : '',
        registrationId: '',
        rating: 0,
        comments: '',
      });
      setCurrentSessionIndex(0);
      setIsSubmitting(false);
    }, 1000);
  };

  const handlePrev = () => {
    setCurrentSessionIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSessionIndex(prev => Math.min(pastOrCurrentSessions.length - 1, prev + 1));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Field Condition Report</CardTitle>
        <CardDescription>Select a past session and your team to rate the field conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitReport)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Select Session</FormLabel>
              {pastOrCurrentSessions.length > 0 && selectedSession ? (
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSessionIndex === 0} type="button">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Session</span>
                    </Button>
                    <div className="text-center">
                      <div className="font-semibold flex items-center gap-2 justify-center">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(selectedSession.date, 'EEEE, MMMM d')}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2 justify-center">
                        <Clock className="h-4 w-4" />
                        {selectedSession.time}
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSessionIndex >= pastOrCurrentSessions.length - 1} type="button">
                      <ArrowRight className="h-4 w-4" />
                      <span className="sr-only">Next Session</span>
                    </Button>
                  </div>
                   <FormField
                      control={form.control}
                      name="registrationId"
                      render={({ field }) => (
                        <FormItem className="space-y-3 pt-4">
                          <FormLabel className="flex items-center gap-2 font-medium">
                             <Users className="h-4 w-4" /> Select Your Team
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2"
                            >
                              {selectedSession.registrations.map((reg) => (
                                <FormItem key={reg.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={reg.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {reg.teamName}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-4 border border-dashed rounded-md">
                  <p>No past sessions with registered teams available to report on.</p>
                </div>
              )}
              <FormField control={form.control} name="sessionId" render={() => (<FormItem><FormMessage /></FormItem>)} />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-8 w-8 cursor-pointer transition-colors",
                            (hoverRating >= star || rating >= star)
                              ? "text-primary fill-primary"
                              : "text-muted-foreground/50"
                          )}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => form.setValue('rating', star, { shouldValidate: true })}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments & Issues</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                       <Textarea
                         placeholder="e.g., Sprinkler head in the north corner is broken..."
                         {...field}
                         className="pl-10 resize-y min-h-[120px]"
                       />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="destructive" disabled={isSubmitting || !selectedSession}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

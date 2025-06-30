"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, MessageSquare, Send, Loader2 } from 'lucide-react';

import { useSessions } from '@/hooks/use-sessions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const reportSchema = z.object({
  rating: z.number().min(1, { message: "Please select a star rating." }).max(5),
  comments: z.string().max(500, { message: "Comments cannot exceed 500 characters." }).optional(),
});

export function FieldReportForm() {
  const { submitFieldReport } = useSessions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      rating: 0,
      comments: '',
    },
  });

  const rating = form.watch('rating');

  const handleSubmitReport = (values: z.infer<typeof reportSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      submitFieldReport(values);
      toast({
        title: 'Report Submitted!',
        description: 'Thank you for your feedback on the field conditions.',
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Field Condition Report</CardTitle>
        <CardDescription>Your feedback helps us maintain our facilities.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitReport)} className="space-y-6">
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

            <Button type="submit" variant="destructive" disabled={isSubmitting}>
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

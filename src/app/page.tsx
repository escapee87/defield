import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, ClipboardCheck, ArrowRight, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="max-w-3xl py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-headline">
          Welcome to FieldSync
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          The all-in-one solution for managing team practice sessions.
          Streamline registration, administration, and attendance tracking with ease.
        </p>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">
              For Coaches
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <CardDescription className="text-center mb-6 flex-grow">
              View available sessions and register your team in seconds.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/coach">Go to Coach View <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">
              For Admins
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <CardDescription className="text-center mb-6 flex-grow">
              Create and manage practice sessions, and oversee registrations.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/admin">Go to Admin View <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <ClipboardCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">
              For Monitors
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <CardDescription className="text-center mb-6 flex-grow">
              Track team attendance in real-time as they arrive for practice.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/monitor">Go to Monitor View <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center">
              Field Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <CardDescription className="text-center mb-6 flex-grow">
              Submit a report on field conditions, ratings, and any issues.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/report">Submit a Report <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

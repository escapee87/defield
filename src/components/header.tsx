"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';

const navItems = [
  { href: '/coach', label: 'Coach' },
  { href: '/admin', label: 'Admin' },
  { href: '/monitor', label: 'Monitor' },
  { href: '/report', label: 'Report' },
  { href: '/faq', label: 'FAQ' },
];

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary"
            >
                <line x1="2" x2="7" y1="2" y2="22"></line>
                <line x1="7" x2="12" y1="22" y2="6"></line>
                <line x1="12" x2="17" y1="6" y2="22"></line>
                <line x1="17" x2="22" y1="22" y2="2"></line>
            </svg>
           </div>
          <span className="font-bold text-lg text-foreground">Walton Robotics DE</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-muted-foreground hover:text-primary"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

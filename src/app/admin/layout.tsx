
'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSimulatedAuth } from '@/hooks/useSimulatedAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard, ListOrdered, Users, LogOut, Home, Shield, Loader2, Package } from 'lucide-react'; // Added Package
import Logo from '@/components/layout/Logo'; // Re-use main logo for consistency

interface AdminLayoutProps {
  children: ReactNode;
}

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Manage Orders', icon: ListOrdered },
  { href: '/admin/products', label: 'Manage Products', icon: Package }, // Added Products link
  { href: '/admin/users', label: 'User Management', icon: Users },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoggedIn, isAdmin, isLoadingAuth, logoutAction, currentUser } = useSimulatedAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoadingAuth && pathname !== '/admin/login') {
      if (!isLoggedIn || !isAdmin) {
        router.replace('/admin/login');
      }
    }
  }, [isLoggedIn, isAdmin, isLoadingAuth, router, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>; // Render login page without admin chrome
  }

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    // This case should ideally be caught by useEffect, but acts as a fallback
    return (
       <div className="flex h-screen items-center justify-center bg-background">
         <Shield className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-muted-foreground">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/admin"
            className="group flex h-10 w-full items-center justify-center rounded-lg text-lg font-semibold text-primary md:text-base mb-4"
          >
            <Logo />
          </Link>
          <span className="self-start px-2 text-sm font-semibold text-muted-foreground">Admin Menu</span>
        </nav>
        <nav className="grid items-start px-4 text-sm font-medium">
          {adminNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                pathname === link.href ? 'bg-muted text-primary' : 'text-muted-foreground'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary mt-6 border-t pt-3"
            >
              <Home className="h-4 w-4" />
              Back to Main Site
            </Link>
        </nav>
        <div className="mt-auto p-4">
          <Button size="sm" className="w-full" onClick={logoutAction}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout Admin
          </Button>
        </div>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-72 flex-grow"> {/* Adjusted pl for fixed sidebar width */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile Menu Trigger - can be implemented later if needed for admin */}
          {/* <SheetTrigger asChild><Button size="icon" variant="outline" className="sm:hidden"><Menu /></Button></SheetTrigger> */}
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {currentUser?.name || 'Admin'}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background sm:bg-transparent">
            {children}
        </main>
      </div>
    </div>
  );
}

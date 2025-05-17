
'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ConditionalLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className={`flex-grow ${!isAdminRoute ? 'container mx-auto px-4 py-8' : ''}`}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

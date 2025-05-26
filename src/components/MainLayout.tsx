'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isNotePage = pathname.startsWith('/note');

  return (
    <main className={isNotePage ? 'wide' : ''}> 
      {children}
    </main>
  );
} 
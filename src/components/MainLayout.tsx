'use client';

import { useLayoutStore } from '@/store/layout';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isWideLayout, isInitialized, initializeFromStorage } = useLayoutStore();
  const pathname = usePathname();
  const isNotePage = pathname.startsWith('/note');

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  if (!isInitialized) return null; // or loading skeleton

  return (
    <main className={isNotePage && isWideLayout ? 'wide' : ''}> 
      {children}
    </main>
  );
} 
'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isPortfolioPage = pathname.startsWith('/portfolio');

  return (
    <main className={isPortfolioPage ? 'wide' : ''}> 
      {children}
    </main>
  );
} 
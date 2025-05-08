'use client';

import { useEffect, useState } from 'react';
import type { TOCSection } from '@/lib/toc';

export default function useTocScroll(toc: TOCSection[]) {
  const [currentSectionSlug, setCurrentSectionSlug] = useState<string>('');

  useEffect(() => {
    const handler = () => {
      const headings = toc.flatMap(section => [section, ...section.subSections]);
      const scrollY = window.scrollY;
      let current = '';
      for (const heading of headings) {
        const el = document.getElementById(heading.slug);
        if (el && el.offsetTop - 80 <= scrollY) {
          current = heading.slug;
        }
      }
      setCurrentSectionSlug(current);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [toc]);

  return { currentSectionSlug };
} 
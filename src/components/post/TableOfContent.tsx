'use client';

import type { TOCSection } from '@/lib/toc';
import useTocScroll from '@/hooks/useTocScroll';

interface TableOfContentProps {
  toc: TOCSection[];
  className?: string;
}

export default function TableOfContent({ toc, className }: TableOfContentProps) {
  const { currentSectionSlug } = useTocScroll(toc);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
  };

  const linkClass = (isActive: boolean) =>
    `!no-underline transition-colors ${
      isActive
        ? 'text-[var(--foreground)] font-semibold'
        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
    }`;

  return (
    <div className={`text-sm ${className || ''}`} data-animate data-animate-speed="fast">
      {toc.map((section, i) => (
        <div key={i} className="mt-2">
          <a
            className={linkClass(currentSectionSlug === section.slug)}
            href={`#${section.slug}`}
            onClick={(e) => handleClick(e, section.slug)}
          >
            {section.text}
          </a>
          {section.subSections.length > 0 && (
            <div className="ml-4" data-animate data-animate-speed="fast" data-animate-wait="1">
              {section.subSections.map((sub, j) => (
                <div key={j} className="mt-1">
                  <a
                    className={linkClass(currentSectionSlug === sub.slug)}
                    href={`#${sub.slug}`}
                    onClick={(e) => handleClick(e, sub.slug)}
                  >
                    {sub.text}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import type { TOCSection } from '@/lib/toc';
import useTocScroll from '@/hook/useTocScroll';

export default function TableOfContent({
  toc,
  className,
  ...props
}: {
  toc: TOCSection[];
  className?: string;
}) {
  const { currentSectionSlug } = useTocScroll(toc);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div {...props} className={cn('font-sans text-sm', className)} data-animate data-animate-speed="fast">
      {toc.map((section, i) => (
        <div key={i} className="mt-2">
          <a
            className={cn(
              'link transition-colors',
              currentSectionSlug === section.slug 
                ? 'text-[var(--gray-800)]' 
                : 'text-[var(--gray-500)] hover:text-[var(--gray-800)]'
            )}
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
                    className={cn(
                      'link transition-colors',
                      currentSectionSlug === sub.slug 
                        ? 'text-[var(--gray-800)]' 
                        : 'text-[var(--gray-500)] hover:text-[var(--gray-800)]'
                    )}
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
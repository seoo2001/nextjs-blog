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
  return (
    <div {...props} className={cn('font-sans text-sm', className)}>
      {toc.map((section, i) => (
        <div key={i} className="mt-2">
          <a
            className={cn(
              'link text-second',
              currentSectionSlug === section.slug && 'font-medium text-body',
            )}
            href={`#${section.slug}`}
          >
            {section.text}
          </a>
          {section.subSections.length > 0 && (
            <div className="ml-4">
              {section.subSections.map((sub, j) => (
                <div key={j} className="mt-1">
                  <a
                    className={cn(
                      'link text-second',
                      currentSectionSlug === sub.slug && 'font-medium text-body',
                    )}
                    href={`#${sub.slug}`}
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
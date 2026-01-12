'use client';

import Link from 'next/link';
import { ThemeButton } from './ThemeButton';

const NAV_LINKS = [
  { href: '/', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
] as const;

interface HeaderProps {
  title?: string;
  date?: string;
  tags?: string[];
}

export const Header = ({ title, date, tags }: HeaderProps) => {
  return (
    <header>
      <div className="flex flex-col gap-2">
        {/* Top: Title + Theme Button */}
        <div className="flex justify-between items-center">
          {title ? (
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              {title}
            </h1>
          ) : (
            <Link 
              href="/" 
              className="text-[var(--foreground)] hover:opacity-70 transition-opacity"
            >
              Home
            </Link>
          )}
          <ThemeButton />
        </div>

        {/* Bottom: Meta + Navigation */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--muted)]">
              {date || '기록 공간'}
            </span>
            {tags && tags.length > 0 && (
              <div className="flex gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="text-sm text-[var(--muted)]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex">
            {NAV_LINKS.map((link, index) => (
              <span
                key={link.href}
                className={`flex items-center ${
                  index !== NAV_LINKS.length - 1
                    ? 'border-r border-[var(--gray-300)] mr-3 pr-3'
                    : ''
                }`}
              >
                <Link
                  href={link.href}
                  className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-[var(--foreground)] scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left" />
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

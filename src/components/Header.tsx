'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import '@/styles/header.css';

interface HeaderProps {
    title?: string;
    date?: string;
    tags?: string[];
}

export const Header = ({ title, date, tags }: HeaderProps) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-top">
                    {title ? (
                        <div className="header-title">{title}</div>
                    ) : (
                        <Link href="/" className="header-home-link">
                            Home
                        </Link>
                    )}
                    <button
                        className="header-theme-button"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        Theme
                    </button>
                </div>
                <div className="header-bottom gap-2">
                    <div className="flex justify-between items-center w-full">
                        <div className="header-date">
                            {date ? date : '기록 공간'}
                        </div>
                        {tags && tags.length > 0 && (
                            <div className="flex gap-2">
                                {tags.map((tag) => (
                                    <span key={tag} className="text-sm text-[var(--text-second)]">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className='flex flex-row gap-4'>
                        <Link href="/" className="header-link">
                            About
                        </Link>
                        <Link href="/blog" className="header-link">
                            Blog
                        </Link>
                        <Link href="/note" className="header-link">
                            Note
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
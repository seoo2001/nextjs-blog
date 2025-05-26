'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import '@/styles/header.css';
import { usePathname } from 'next/navigation';
import { useLayoutStore } from '@/store/layout';

interface HeaderProps {
    title?: string;
    date?: string;
    tags?: string[];
}

export const Header = ({ title, date, tags }: HeaderProps) => {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const { isWideLayout, setWideLayout } = useLayoutStore();
    const isNotePage = pathname === '/note';

    const handleDrawerClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isNotePage && !isWideLayout) {
            e.preventDefault();
    
            const unsubscribe = useLayoutStore.subscribe((state) => {
                if (state.isWideLayout) {
                    window.location.href = '/note';
                    unsubscribe();
                }
            });
    
            setWideLayout(true);
        }
    };

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
                    <div className='flex flex-row'>
                        <span className="header-link-wrapper">
                            <Link href="/" className="header-link">
                                소개
                            </Link>
                        </span>
                        <span className="header-link-wrapper">
                            <Link href="/blog" className="header-link">
                                기록
                            </Link>
                        </span>
                        <span className="header-link-wrapper">
                            <Link 
                                href="/note" 
                                className={`header-link ${isNotePage && !isWideLayout ? 'cursor-pointer' : ''}`}
                                onClick={handleDrawerClick}
                            >
                                서랍
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};
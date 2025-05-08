'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import '@/styles/header.css';

interface HeaderProps {
    title?: string;
    date?: string;
}

export const Header = ({ title, date }: HeaderProps) => {
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
                    <div className="header-date">
                        {date ? date : '기록 공간'}

                    </div>
                    <div className='flex flex-row gap-4'>
                        <Link href="/blog" className="header-link">
                            블로그
                        </Link>
                        <Link href="/" className="header-link">
                            소개
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};
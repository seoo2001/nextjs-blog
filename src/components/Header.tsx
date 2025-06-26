'use client';

import Link from 'next/link';
import '@/styles/header.css';
import { ThemeButton } from './ThemeButton';

interface HeaderProps {
    title?: string;
    date?: string;
    tags?: string[];
}

export const Header = ({ title, date, tags }: HeaderProps) => {

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
                    <ThemeButton />
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
                                About
                            </Link>
                        </span>
                        <span className="header-link-wrapper">
                            <Link href="/blog" className="header-link">
                                Blog
                            </Link>
                        </span>
                        <span className="header-link-wrapper">
                            <Link href="/note" className="header-link">
                                Note
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

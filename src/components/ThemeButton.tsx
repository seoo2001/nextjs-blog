'use client';

import { useTheme } from 'next-themes';

export const ThemeButton = () => {
    const { theme, setTheme } = useTheme();

    return (
        <button
            suppressHydrationWarning
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="테마 변경"
            aria-label="auto"
            aria-live="polite"
        >
            <svg
                className="sun-and-moon"
                aria-hidden="true"
                viewBox="0 0 24 24"
            >
                <mask className="moon" id="moon-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle
                        cx="24"
                        cy="10"
                        r="6"
                        fill="black"
                    />
                </mask>
                <circle
                    className="sun"
                    cx="12"
                    cy="12"
                    r="6"
                    mask="url(#moon-mask)"
                    fill="currentColor"
                />
                <g
                    className="sun-beams"
                    strokeWidth="2px"
                    stroke="currentColor"
                >
                    <line x1="12" y1="1" x2="12" y2="3" strokeLinecap="round" />
                    <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeLinecap="round" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeLinecap="round" />
                    <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
                    <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeLinecap="round" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeLinecap="round" />
                </g>
            </svg>
        </button>
    );
}; 
'use client';

import { useTheme } from 'next-themes';

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      suppressHydrationWarning
      className="p-2 rounded-lg hover:scale-110 transition-transform duration-300"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="테마 변경"
      aria-label="테마 변경"
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {/* Sun icon for light mode, Moon for dark */}
        <circle cx="12" cy="12" r="5" className="dark:opacity-0 transition-opacity" />
        <g className="dark:opacity-0 transition-opacity">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
        {/* Moon */}
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          className="opacity-0 dark:opacity-100 transition-opacity"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </button>
  );
};

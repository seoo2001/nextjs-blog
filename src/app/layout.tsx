import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { META } from '@/constants/metadata';
import { Footer } from '@/components/Footer';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';

const lineSeedKR = localFont({
  src: [
    {
      path: '../../public/fonts/LINESeedKR-Rg.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/LINESeedKR-Bd.otf',
      weight: '700',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(META.url),
  title: META.title,
  description: META.description,
  keywords: [...META.keyword],
  verification: {
    google: META.googleVerification,
    other: {
      'naver-site-verification': META.naverVerification,
    },
  },
  openGraph: {
    title: META.title,
    description: META.description,
    images: { url: META.ogImage },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${lineSeedKR.className} min-h-screen bg-[var(--background)] text-[var(--foreground)]`}
        style={{
          paddingLeft: 'var(--body-margin-left)',
          paddingRight: 'var(--body-margin-right)',
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="mx-auto max-w-2xl pt-[var(--page-top)] min-h-[calc(100vh-100px)]">
            {children}
            <Footer />
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

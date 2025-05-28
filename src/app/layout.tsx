import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { META } from "@/constants/metadata";
import MainLayout from '@/components/MainLayout';
import { Footer } from "@/components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL(META.url),
  title: META.title,
  description: META.description,
  keywords: [...META.keyword],

  verification: {
    google: META.googleVerification,
    other: {
      'naver-site-verification': META.naverVerification,
    }
  },
  openGraph: {
    title: META.title,
    description: META.description,
    images: {
      url: META.ogImage,
    },
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <Script
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${META.googleAdsense}`}
        strategy="beforeInteractive"
      />
      <body className="container">
        <ThemeProvider>
          <MainLayout>
            {children}
            <Footer />
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

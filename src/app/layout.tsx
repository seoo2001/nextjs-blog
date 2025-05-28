import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { META } from "@/constants/metadata";
import MainLayout from '@/components/MainLayout';
import { Footer } from "@/components/Footer";

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

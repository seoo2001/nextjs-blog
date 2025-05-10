import type { Metadata } from "next";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Blog",
  description: "기록 공간",
  verification: {
    google: "-zitLknPv5kRbjZ4Mg8Dkjveiak80WHCT-clix5QThI",
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <div className="container">
            <main>
              {children}
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LiveTicker } from "@/components/layout/LiveTicker";
import { BackToTop } from "@/components/layout/BackToTop";
import { GetAdFetch } from "@/components/layout/GetAdFetch";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import { AuthProvider } from "@/components/shared/MockAuthProvider";




const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SportHub | 專業競技運動 Blog",
  description: "提供最即時的運動比分、深度專業分析與最新運動新聞。專為熱愛競技運動的您量身打造。",
  keywords: ["運動", "競技", "比分", "即時比分", "運動新聞", "專業分析"],
  authors: [{ name: "SportHub Team" }],
  openGraph: {
    title: "SportHub | 專業競技運動 Blog",
    description: "提供最即時的運動比分、深度專業分析與最新運動新聞。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased text-foreground bg-background`}>
        <LanguageProvider>
          <AuthProvider>
            <LiveTicker />
            <Header />
            <main className="relative z-[1] min-h-screen pt-20 pb-12">
              {children}
            </main>

            <div className="relative z-[1]">
              <Footer />
            </div>
            <BackToTop />
            <GetAdFetch />
          </AuthProvider>
        </LanguageProvider>

      </body>

    </html>
  );
}



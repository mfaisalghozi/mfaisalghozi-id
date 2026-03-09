import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mfaisalghozi.id"),
  title: "mfaisalghozi",
  description: "Personal website of Muhammad Faisal Ghozi: blog posts, projects, and updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://api.notion.com" />
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/projects" />
      </head>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <div className="app-shell">
          <SiteHeader />
          <main className="pb-20 sm:pb-0">{children}</main>
          <footer className="mb-20 border-t border-[color:var(--line)] py-6 text-center text-sm text-[color:var(--muted)] sm:mb-0">
            © 2026 All rights reserved.
          </footer>
        </div>
        <MobileNav />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

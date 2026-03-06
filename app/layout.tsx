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
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mfaisalghozi.id"),
  title: "mfaisalghozi",
  description: "Personal website of Muhammad Faisal Ghozi: blog posts, projects, and updates.",
  openGraph: {
    title: "mfaisalghozi",
    description: "Personal website of Muhammad Faisal Ghozi: blog posts, projects, and updates.",
    url: "https://mfaisalghozi.id",
    siteName: "mfaisalghozi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "mfaisalghozi",
    description: "Personal website of Muhammad Faisal Ghozi: blog posts, projects, and updates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
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

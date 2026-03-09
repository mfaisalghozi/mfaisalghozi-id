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
  description: "A software engineer's corner on the internet — exploring life, ideas, and projects built along the way. Written by Ghozi, driven by curiosity.",
  openGraph: {
    title: "mfaisalghozi",
    description: "A software engineer's corner on the internet — exploring life, ideas, and projects built along the way. Written by Ghozi, driven by curiosity.",
    url: "https://mfaisalghozi.id",
    siteName: "mfaisalghozi",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "mfaisalghozi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "mfaisalghozi",
    description: "A software engineer's corner on the internet — exploring life, ideas, and projects built along the way. Written by Ghozi, driven by curiosity.",
    images: ["/opengraph-image"],
  },
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

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SiteHeader } from "@/components/site-header";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-ibm-plex-mono",
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

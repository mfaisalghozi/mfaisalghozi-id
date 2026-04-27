import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' https://prod-files-secure.s3.us-east-1.amazonaws.com https://images.notion.so https://www.notion.so https://notion.so data: blob:",
      "connect-src 'self' https://api.notion.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      // Notion file attachments — scoped to Notion's dedicated S3 bucket
      { protocol: "https", hostname: "prod-files-secure.s3.us-east-1.amazonaws.com", pathname: "/**" },
      // Notion-hosted images
      { protocol: "https", hostname: "images.notion.so", pathname: "/**" },
      { protocol: "https", hostname: "www.notion.so", pathname: "/image/**" },
      { protocol: "https", hostname: "notion.so", pathname: "/image/**" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// CSP is set dynamically per-request in middleware.ts (nonce-based).
// Only static, non-nonce headers live here.
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
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
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

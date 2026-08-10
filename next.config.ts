import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sparticuz/chromium's Brotli-compressed Chromium binary lives under
  // bin/ and is read via fs at runtime (not imported), so Vercel's output
  // file tracing misses it unless told explicitly to include it here.
  outputFileTracingIncludes: {
    "/api/resumes/\\[id\\]/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;

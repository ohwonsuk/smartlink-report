import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'chrome-aws-lambda'],
  },
};

export default nextConfig;

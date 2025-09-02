import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: isDev ? undefined : 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isDev ? '' : '/portfolio',
  assetPrefix: isDev ? '' : '/portfolio/',
};

export default nextConfig;

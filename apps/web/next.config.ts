import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ['@brainify/shared'],
  outputFileTracingRoot: path.join(__dirname, '..', '..'),
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;

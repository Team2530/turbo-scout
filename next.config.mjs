/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';

const withPWA = nextPWA({ dest: "public" })
const nextConfig = withPWA({
  basePath: "/turbo-scout",
  assetPrefix: "/turbo-scout",
  images: {
    unoptimized: true
  }
});

export default nextConfig;

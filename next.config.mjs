/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';

const withPWA = nextPWA({ dest: "public" })
const nextConfig = withPWA({ 
  output: 'export',
  basePath: "/turbo-scout",
  images: {
    unoptimized: true
  }
});

export default nextConfig;

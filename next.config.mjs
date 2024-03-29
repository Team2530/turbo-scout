/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';

const withPWA = nextPWA({ dest: "public" })
const nextConfig = withPWA({});

export default nextConfig;

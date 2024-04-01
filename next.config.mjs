/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';

const withPWA = nextPWA({ dest: "public", buildExcludes: ["/api/push", "/api/pull", "/turbo-data", "turbo-data"] })
const nextConfig = withPWA({});

export default nextConfig;

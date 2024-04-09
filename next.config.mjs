/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';


const withPWA = withPWAInit({
    dest: 'public',
    cacheOnFrontEndNav: true,
    cacheStartUrl: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true
});

export default withPWA({
    reactStrictMode: true
});
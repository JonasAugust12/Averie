import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: process.env.PRODUCTION_BROWSER_SOURCE_MAPS === 'true',
    images: {
        formats: ['image/avif', 'image/webp'],
    },
};

export default withNextIntl(nextConfig);

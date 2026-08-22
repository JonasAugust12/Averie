import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** Allow next/image to optimize Cloudinary delivery URLs (promotion uploads, etc.). */
function cloudinaryRemotePatterns(): NonNullable<NextConfig['images']>['remotePatterns'] {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const patterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/**',
        },
    ];

    if (cloudName) {
        patterns.unshift({
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: `/${cloudName}/**`,
        });
    }

    return patterns;
}

const nextConfig: NextConfig = {
    // Emits .next/standalone (self-contained node server) for the Docker image.
    output: 'standalone',
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: process.env.PRODUCTION_BROWSER_SOURCE_MAPS === 'true',
    serverExternalPackages: ['mongoose', 'mongodb'],
    experimental: {
        serverActions: {
            // Promotion image uploads allow up to 5 MB (+ FormData overhead)
            bodySizeLimit: '6mb',
        },
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: cloudinaryRemotePatterns(),
    },
};

export default withNextIntl(nextConfig);

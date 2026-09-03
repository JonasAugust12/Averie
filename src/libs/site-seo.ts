import type { Metadata, Viewport } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(
    /\/$/,
    '',
);

export const SEO = {
    title: 'Averie | Nail Salon & Facials in Cohasset, MA',
    description:
        'Averie nail salon at 132 Chief Justice Cushing Hwy, Cohasset, MA 02025. Manicures, pedicures, Dermalogica facials & waxing. Call 781-923-1955 or book online.',
    keywords:
        'nail salon Cohasset MA, nails Cohasset Massachusetts, nail spa Cohasset, manicure pedicure Cohasset MA, Dermalogica facials Cohasset, beauty salon Cohasset MA, South Shore nail salon',
    ogImage: '/og.jpg',
    ogImageAlt: 'Averie Luxury Salon — Nails, Facials & Beauty in Cohasset, MA',
    siteName: 'Averie Salon',
    themeColor: '#f8f7f3',
    phone: '+17819231955',
    phoneDisplay: '781-923-1955',
    address: {
        street: '132 Chief Justice Cushing Hwy',
        city: 'Cohasset',
        state: 'MA',
        zip: '02025',
        country: 'US',
    },
    geo: {
        latitude: 42.2417,
        longitude: -70.8034,
    },
    social: {
        instagram: 'https://www.instagram.com/averienailspa',
        facebook: 'https://www.facebook.com/averiespa',
    },
    maps: 'https://maps.app.goo.gl/YCtZW533i3x6BB5QA',
    googleSiteVerification: 'google990ff0b977e8aa15',
} as const;

export function absoluteUrl(path: string) {
    return new URL(path, SITE_URL).href;
}

export function bookingUrl(path = '/book') {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${SITE_URL}${normalized}`;
}

const sharedOpenGraphImages: NonNullable<Metadata['openGraph']>['images'] = [
    {
        url: SEO.ogImage,
        width: 1200,
        height: 630,
        alt: SEO.ogImageAlt,
    },
];

/** Root metadata shared across public marketing pages. */
export function buildRootMetadata(overrides: Metadata = {}): Metadata {
    const base: Metadata = {
        metadataBase: new URL(SITE_URL),
        title: {
            default: SEO.title,
            template: '%s | Averie',
        },
        description: SEO.description,
        applicationName: 'Averie',
        keywords: SEO.keywords.split(', '),
        alternates: {
            canonical: '/',
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            siteName: SEO.siteName,
            title: SEO.title,
            description: SEO.description,
            url: '/',
            images: sharedOpenGraphImages,
        },
        twitter: {
            card: 'summary_large_image',
            title: SEO.title,
            description: SEO.description,
            images: [SEO.ogImage],
        },
        icons: {
            icon: [
                { url: '/favicon.ico', sizes: '48x48' },
                { url: '/icons/logo_round.png', sizes: '512x512', type: 'image/png' },
            ],
            shortcut: '/favicon.ico',
            apple: '/icons/logo_round.png',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
                'max-video-preview': -1,
            },
        },
        verification: {
            google: SEO.googleSiteVerification,
        },
    };

    return {
        ...base,
        ...overrides,
        alternates: { ...base.alternates, ...overrides.alternates },
        openGraph: {
            ...(typeof base.openGraph === 'object' && base.openGraph !== null
                ? base.openGraph
                : {}),
            ...(typeof overrides.openGraph === 'object' && overrides.openGraph !== null
                ? overrides.openGraph
                : {}),
        },
        twitter: {
            ...(typeof base.twitter === 'object' && base.twitter !== null ? base.twitter : {}),
            ...(typeof overrides.twitter === 'object' && overrides.twitter !== null
                ? overrides.twitter
                : {}),
        },
    };
}

/** Root viewport shared across public marketing pages. */
export function buildRootViewport(overrides: Viewport = {}): Viewport {
    return {
        themeColor: SEO.themeColor,
        ...overrides,
    };
}

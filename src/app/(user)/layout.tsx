import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'Averie — Nails • Facials • Beauty',
        template: '%s | Averie',
    },
    description:
        'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
    applicationName: 'Averie',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Averie',
        title: 'Averie — Nails • Facials • Beauty',
        description:
            'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
        url: siteUrl,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Averie — Nails • Facials • Beauty',
        description:
            'Averie luxury nail salon in Cohasset, MA. Book manicures, gel, enhancements, waxing, and facials online.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

/**
 * User-facing route group. Pages stay as Server Components for SEO metadata;
 * interactive UI lives in client views under @components/*.
 * Admin remains separately under /admin (client-heavy, no SEO need).
 */
export default function UserLayout({ children }: { children: React.ReactNode }) {
    return children;
}

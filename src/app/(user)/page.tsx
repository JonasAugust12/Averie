import type { Metadata } from 'next';
import { LandingPageView } from '@components/landing';
import { JsonLd } from '@components/seo';
import { buildRootMetadata } from '@libs/site-seo';
import { landingJsonLd } from '@libs/json-ld';

export const metadata: Metadata = buildRootMetadata({
    alternates: { canonical: '/' },
    openGraph: { url: '/' },
});

export default function HomePage() {
    return (
        <>
            <JsonLd data={landingJsonLd} />
            <LandingPageView />
        </>
    );
}

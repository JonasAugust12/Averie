import type { Metadata } from 'next';
import { LandingPageView } from '@components/landing';
import { JsonLd } from '@components/seo';
import { buildRootMetadata, SEO } from '@libs/site-seo';
import { landingJsonLd } from '@libs/json-ld';

export const metadata: Metadata = buildRootMetadata({
    title: { absolute: SEO.title },
    alternates: { canonical: '/' },
    openGraph: { url: '/', title: SEO.title, description: SEO.description },
    twitter: { title: SEO.title, description: SEO.description },
});

export default function HomePage() {
    return (
        <>
            <JsonLd data={landingJsonLd} />
            <LandingPageView />
        </>
    );
}

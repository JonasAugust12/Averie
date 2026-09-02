import type { MetadataRoute } from 'next';
import { SITE_URL } from '@libs/site-seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/staff/', '/demo/'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}

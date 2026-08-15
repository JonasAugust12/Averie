import { ApiReference } from '@scalar/nextjs-api-reference';
import { isApiDocsEnabled, apiDocsDisabledResponse } from '../_lib/docs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @ignore
 */
const scalarGet = ApiReference({
    url: '/api/openapi.json',
});

export async function GET() {
    if (!isApiDocsEnabled()) {
        return apiDocsDisabledResponse();
    }

    return scalarGet();
}

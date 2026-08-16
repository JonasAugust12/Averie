import { buildOpenApiSpec } from '@openapi/spec';
import { apiDocsDisabledResponse, isApiDocsEnabled } from '../_lib/docs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * @ignore
 */
export async function GET() {
    if (!isApiDocsEnabled()) {
        return apiDocsDisabledResponse();
    }

    const spec = buildOpenApiSpec();
    return Response.json(spec);
}

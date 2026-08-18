import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { openApiResponseExamples } from '@openapi/examples/responses';

const GENERATED_SPEC_PATH = join(process.cwd(), 'openapi', 'generated', 'openapi.json');
const FRAGMENTS_PATH = join(process.cwd(), 'openapi', 'fragments', 'actions.yaml');

/** Keys written by openapi-gen that are not part of the OpenAPI document. */
const GENERATOR_META_KEYS = new Set([
    'schemaFile',
    'schemaType',
    'schemaDirectory',
    'outputDir',
    'docsUrl',
    'ui',
    'apiDir',
    'includeUndocumented',
    'defaultResponseSet',
    'defaultResponseSets',
]);

/** Routes excluded from published docs (meta / examples). */
const EXCLUDED_PATHS = new Set(['/docs', '/openapi.json']);

function loadGeneratedSpec(): Record<string, unknown> | null {
    try {
        const raw = JSON.parse(readFileSync(GENERATED_SPEC_PATH, 'utf8')) as Record<
            string,
            unknown
        >;
        const spec: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(raw)) {
            if (!GENERATOR_META_KEYS.has(key)) {
                spec[key] = value;
            }
        }

        return spec;
    } catch {
        return null;
    }
}

function prefixApiPaths(paths: Record<string, unknown>): Record<string, unknown> {
    const prefixed: Record<string, unknown> = {};

    for (const [path, operation] of Object.entries(paths)) {
        if (EXCLUDED_PATHS.has(path)) {
            continue;
        }
        const apiPath = path.startsWith('/api') ? path : `/api${path}`;
        prefixed[apiPath] = operation;
    }

    return prefixed;
}

function loadActionFragments(): Record<string, unknown> {
    try {
        const raw = readFileSync(FRAGMENTS_PATH, 'utf8');
        const parsed = parseYaml(raw) as { paths?: Record<string, unknown> };
        return parsed.paths ?? {};
    } catch {
        return {};
    }
}

function injectResponseExamples(spec: Record<string, unknown>) {
    const components = spec.components as
        | { schemas?: Record<string, Record<string, unknown>>; responses?: Record<string, unknown> }
        | undefined;
    const schemas = components?.schemas;
    if (schemas) {
        for (const [schemaName, example] of Object.entries(openApiResponseExamples)) {
            if (schemas[schemaName]) {
                schemas[schemaName].example = example;
            }
        }
    }

    const paths = spec.paths as Record<
        string,
        Record<
            string,
            {
                responses?: Record<
                    string,
                    {
                        content?: Record<string, { schema?: { $ref?: string }; example?: unknown }>;
                    }
                >;
            }
        >
    >;

    for (const pathItem of Object.values(paths ?? {})) {
        for (const operation of Object.values(pathItem ?? {})) {
            const response200 = operation?.responses?.['200'];
            const jsonContent = response200?.content?.['application/json'];
            const schemaRef = jsonContent?.schema?.$ref;
            if (!schemaRef || !jsonContent) {
                continue;
            }

            const schemaName = schemaRef.replace('#/components/schemas/', '');
            const example =
                openApiResponseExamples[schemaName as keyof typeof openApiResponseExamples];
            if (example) {
                jsonContent.example = example;
            }
        }
    }

    const errorResponses = components?.responses as
        Record<string, { content?: Record<string, { example?: unknown }> }> | undefined;
    if (errorResponses) {
        for (const code of ['400', '401', '404', '500', '503']) {
            const errorExample = {
                ...openApiResponseExamples.apiErrorResponseSchema,
                status: Number(code),
            };
            const content = errorResponses[code]?.content?.['application/json'];
            if (content) {
                content.example = errorExample;
            }
        }
    }
}

export function buildOpenApiSpec() {
    const generated = loadGeneratedSpec();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    if (generated) {
        const generatedPaths = (generated.paths ?? {}) as Record<string, unknown>;
        const generatedComponents = (generated.components ?? {}) as Record<string, unknown>;
        const existingSecurity = (generatedComponents.securitySchemes ?? {}) as Record<
            string,
            unknown
        >;

        const spec = {
            ...generated,
            openapi: '3.1.0',
            info: {
                title: 'Averie Salon API',
                version: '1.0.0',
                description:
                    'Salon platform backend. All responses use `{ status, message, data }`. GET routes are HTTP endpoints. Server Actions are documented under `/actions/*` for reference only.',
            },
            servers: [{ url: baseUrl }],
            tags: [
                { name: 'Catalog', description: 'Public catalog reads' },
                { name: 'Booking', description: 'Booking flow reads' },
                { name: 'Bookings', description: 'Booking admin reads' },
                { name: 'Settings', description: 'Salon configuration' },
                { name: 'Admin', description: 'Admin reads (authenticated)' },
                { name: 'Staff', description: 'Staff portal reads' },
                { name: 'Health', description: 'Service health' },
                { name: 'Server Actions', description: 'Not HTTP — Next.js Server Actions' },
            ],
            paths: {
                ...prefixApiPaths(generatedPaths),
                ...loadActionFragments(),
            },
            components: {
                ...generatedComponents,
                securitySchemes: {
                    ...existingSecurity,
                    sessionCookie: {
                        type: 'apiKey',
                        in: 'cookie',
                        name: 'authjs.session-token',
                        description: 'Auth.js session cookie (admin/staff)',
                    },
                },
            },
        };

        injectResponseExamples(spec);
        return spec;
    }

    return {
        openapi: '3.1.0',
        info: {
            title: 'Averie Salon API',
            version: '1.0.0',
            description: 'Run `pnpm openapi:gen` to generate the full specification.',
        },
        servers: [{ url: baseUrl }],
        paths: loadActionFragments(),
    };
}

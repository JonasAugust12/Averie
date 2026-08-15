import { EXAMPLE_TIMESTAMP } from '@openapi/examples/ids';

export const healthDataExample = {
    health: 'ok' as const,
    mongo: 'connected',
    timestamp: EXAMPLE_TIMESTAMP,
};

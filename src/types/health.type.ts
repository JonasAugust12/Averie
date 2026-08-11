export interface HealthData {
    health: 'ok' | 'degraded' | 'error';
    mongo: string;
    timestamp: string;
}

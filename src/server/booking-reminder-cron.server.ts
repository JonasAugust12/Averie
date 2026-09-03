import { runBookingReminderBatch } from '@server/booking-reminder-batch.server';

const DEFAULT_INTERVAL_MS = 2 * 60 * 60 * 1000;
const GLOBAL_STARTED_KEY = '__averieBookingReminderCronStarted';

function isInternalCronMode(): boolean {
    return process.env.BOOKING_REMINDER_CRON_MODE?.trim().toLowerCase() === 'internal';
}

function parseIntervalMs(): number {
    const raw = process.env.BOOKING_REMINDER_CRON_INTERVAL_MS?.trim();
    if (!raw) return DEFAULT_INTERVAL_MS;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 60_000 ? parsed : DEFAULT_INTERVAL_MS;
}

function isTruthyEnv(value: string | undefined): boolean {
    const normalized = value?.trim().toLowerCase();
    return normalized === '1' || normalized === 'true';
}

async function runBatchTick(): Promise<void> {
    try {
        const result = await runBookingReminderBatch();
        console.info('[booking-reminder-cron] batch complete', result);
    } catch (error) {
        console.error('[booking-reminder-cron] batch failed', error);
    }
}

/**
 * In-process reminder scheduler for long-running Node hosts (local `pnpm start`, Bizfly Docker).
 * Disabled by default — set `BOOKING_REMINDER_CRON_MODE=internal` to enable.
 * On Vercel, keep the default and use `vercel.json` cron hitting `/api/cron/booking-reminders`.
 */
export function startInternalBookingReminderCron(): void {
    if (!isInternalCronMode()) {
        return;
    }

    const globalState = globalThis as typeof globalThis & {
        [GLOBAL_STARTED_KEY]?: boolean;
    };
    if (globalState[GLOBAL_STARTED_KEY]) {
        return;
    }
    globalState[GLOBAL_STARTED_KEY] = true;

    const intervalMs = parseIntervalMs();
    const runOnStart = isTruthyEnv(process.env.BOOKING_REMINDER_CRON_RUN_ON_START);

    console.info('[booking-reminder-cron] internal scheduler enabled', {
        intervalMs,
        runOnStart,
    });

    if (runOnStart) {
        void runBatchTick();
    }

    setInterval(() => {
        void runBatchTick();
    }, intervalMs);
}

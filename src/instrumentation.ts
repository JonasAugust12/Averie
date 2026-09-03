const PUBLIC_DNS = ['8.8.8.8', '1.1.1.1'];

function usesLocalDnsOnly(servers: string[]): string[] | null {
    const current = servers;
    if (current.length > 0 && current.every((s) => s === '127.0.0.1' || s === '::1')) {
        return PUBLIC_DNS;
    }
    return null;
}

/** Bootstrap DNS before any route/model loads mongoose (webpack may load mongoose before mongo-dns otherwise). */
export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') {
        return;
    }

    const dns = await import(/* webpackIgnore: true */ 'dns');
    const configured = process.env.MONGODB_DNS_SERVERS;
    if (configured) {
        dns.setServers(
            configured
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
        );
        return;
    }

    const fallback = usesLocalDnsOnly(dns.getServers());
    if (process.platform === 'win32' && fallback) {
        dns.setServers(fallback);
    }

    const { startInternalBookingReminderCron } =
        await import('@server/booking-reminder-cron.server');
    startInternalBookingReminderCron();
}

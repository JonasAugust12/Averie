const PUBLIC_DNS = ['8.8.8.8', '1.1.1.1'];

function usesLocalDnsOnly(servers: string[]): boolean {
    return servers.length > 0 && servers.every((s) => s === '127.0.0.1' || s === '::1');
}

function getNodeDns(): typeof import('dns') {
    // Runtime require keeps the native Node module when Next.js/webpack bundles server code.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('dns') as typeof import('dns');
}

/** Apply DNS servers before mongodb+srv SRV lookup (Windows local proxy often breaks on 127.0.0.1). */
export function configureMongoDns(): void {
    const dns = getNodeDns();
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

    if (process.platform === 'win32' && usesLocalDnsOnly(dns.getServers())) {
        dns.setServers(PUBLIC_DNS);
    }
}

configureMongoDns();

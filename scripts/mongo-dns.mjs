import dns from 'node:dns';

const PUBLIC_DNS = ['8.8.8.8', '1.1.1.1'];

function usesLocalDnsOnly(servers) {
    return servers.length > 0 && servers.every((s) => s === '127.0.0.1' || s === '::1');
}

function configureMongoDns() {
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

import dns from 'node:dns';

/** Windows Node often fails querySrv with system DNS; set MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 */
const servers = process.env.MONGODB_DNS_SERVERS;
if (servers) {
    dns.setServers(
        servers
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    );
}

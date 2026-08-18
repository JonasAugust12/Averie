/**
 * Try multiple Atlas connection strategies (no credentials in output).
 * Usage: node --env-file=.env.local scripts/diagnose-mongodb.mjs
 */
import './mongo-dns.mjs';
import mongoose from 'mongoose';
import { writeFileSync } from 'node:fs';

const user = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
const baseUri = process.env.MONGODB_URI;

const lines = ['MongoDB connection diagnostics', ''];

async function tryConnect(label, uri, options = {}) {
    lines.push(`--- ${label} ---`);
    try {
        await mongoose.connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 12_000,
            ...options,
        });
        await mongoose.connection.db.admin().command({ ping: 1 });
        lines.push(`OK db=${mongoose.connection.name} host=${mongoose.connection.host}`);
        await mongoose.disconnect();
        return true;
    } catch (error) {
        lines.push(`FAIL ${error instanceof Error ? error.message : String(error)}`);
        try {
            await mongoose.disconnect();
        } catch {
            /* ignore */
        }
        return false;
    }
}

if (!baseUri && (!user || !pass)) {
    lines.push('Set MONGODB_URI or MONGODB_USERNAME + MONGODB_PASSWORD in .env.local');
    writeFileSync('mongodb-diagnose.txt', lines.join('\n'));
    process.exit(1);
}

const creds = user && pass ? `${user}:${pass}` : null;

const attempts = [];

if (baseUri?.startsWith('mongodb+srv')) {
    attempts.push(['SRV from .env.local', baseUri]);
} else if (baseUri) {
    attempts.push(['Standard from .env.local', baseUri]);
}

if (creds) {
    attempts.push([
        'SRV Atlas host',
        `mongodb+srv://${creds}@averie-cluster0.qtmijzy.mongodb.net/averie?retryWrites=true&w=majority&appName=Averie-Cluster0`,
    ]);
    attempts.push([
        'Direct single shard',
        `mongodb://${creds}@ac-pqiuj4t-shard-00-00.qtmijzy.mongodb.net:27017/averie?ssl=true&directConnection=true&authSource=admin&retryWrites=true&w=majority`,
    ]);
    attempts.push([
        'Standard 3-host replica set',
        `mongodb://${creds}@ac-pqiuj4t-shard-00-00.qtmijzy.mongodb.net:27017,ac-pqiuj4t-shard-00-01.qtmijzy.mongodb.net:27017,ac-pqiuj4t-shard-00-02.qtmijzy.mongodb.net:27017/averie?ssl=true&replicaSet=atlas-pqiuj4t-shard-0&authSource=admin&retryWrites=true&w=majority`,
    ]);
}

let winner = null;
for (const [label, uri] of attempts) {
    const ok = await tryConnect(label, uri, {
        serverApi: { version: '1', strict: true, deprecationErrors: true },
    });
    if (ok && !winner) {
        winner = label;
    }
}

lines.push('');
if (winner) {
    lines.push(`RECOMMENDATION: use strategy "${winner}"`);
} else {
    lines.push('RECOMMENDATION: none worked — check firewall/VPN, cluster Active, user password');
    lines.push('Atlas → Connect → Drivers → copy fresh URI with Show Password');
}

writeFileSync('mongodb-diagnose.txt', lines.join('\n'));
console.log(lines.join('\n'));

process.exit(winner ? 0 : 1);

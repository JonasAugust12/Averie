/**
 * Verify MongoDB connectivity using MONGODB_URI from .env.local
 *
 * Usage: pnpm db:check
 */
import mongoose from 'mongoose';
import { mongoClientOptions } from './mongo-client-options.mjs';

const uri = process.env.MONGODB_URI;

if (!uri || uri.includes('USER:PASSWORD') || uri.includes('xxxxx')) {
    console.error('\n❌ MONGODB_URI is missing or still a placeholder.');
    console.error('   Edit .env.local and set your Atlas connection string.');
    console.error('   See .env.example or README.md → MongoDB Atlas.\n');
    process.exit(1);
}

try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, mongoClientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });

    const { host, name, readyState } = mongoose.connection;
    const state = ['disconnected', 'connected', 'connecting', 'disconnecting'][readyState];

    console.log('\n✅ MongoDB connected (ping OK)');
    console.log(`   Host:     ${host}`);
    console.log(`   Database: ${name}`);
    console.log(`   State:    ${state}\n`);

    await mongoose.disconnect();
    process.exit(0);
} catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('\n❌ MongoDB connection failed');
    console.error(`   ${message}\n`);
    console.error('Checklist:');
    console.error('  1. MONGODB_URI username/password correct (URL-encode special chars)');
    console.error('  2. Atlas → Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)');
    console.error('  3. Database user has readWrite on the target database');
    if (message.includes('querySrv ECONNREFUSED')) {
        console.error(
            '  4. Windows/Node DNS: use standard mongodb:// URI (not mongodb+srv) — see .env.example',
        );
    }
    if (message.includes('timed out')) {
        console.error(
            '  4. Timeout usually means Network Access IP not whitelisted yet (wait ~1 min after adding)',
        );
    }
    console.error('');
    process.exit(1);
}

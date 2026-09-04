#!/usr/bin/env node
/**
 * Drop legacy bookings index that blocks multiple "any staff" bookings at the same slot.
 *
 * Old deployments had a unique index on { date, time } only (name: date_1_time_1).
 * Current schema allows multiple upcoming bookings at the same time when staffPreference is "any".
 *
 * Usage: pnpm db:fix-booking-indexes
 */
import mongoose from 'mongoose';
import { mongoClientOptions } from './mongo-client-options.mjs';

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI is required');
    process.exit(1);
}

await mongoose.connect(uri, mongoClientOptions);
const collection = mongoose.connection.collection('bookings');

const indexes = await collection.indexes();
console.log('Current indexes on bookings:');
for (const idx of indexes) {
    console.log(`  - ${idx.name}:`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '');
}

const legacyNames = ['date_1_time_1'];
let dropped = 0;

for (const name of legacyNames) {
    const exists = indexes.some((idx) => idx.name === name);
    if (!exists) continue;
    console.log(`\nDropping legacy index "${name}"...`);
    await collection.dropIndex(name);
    console.log(`Dropped "${name}".`);
    dropped += 1;
}

if (dropped === 0) {
    console.log('\nNo legacy date_1_time_1 index found — nothing to drop.');
} else {
    console.log(`\nDone. Dropped ${dropped} legacy index(es).`);
    console.log(
        'Re-run "pnpm db:check" or redeploy; "any technician" can share the same slot again.',
    );
}

await mongoose.disconnect();

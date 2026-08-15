/**
 * Test which MongoDB URI supports writes (not just ping).
 * Usage: node --env-file=.env.local scripts/test-mongodb-write.mjs
 */
import mongoose from 'mongoose';
import { mongoClientOptions } from './mongo-client-options.mjs';

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
}

const credMatch = uri.match(/^mongodb(?:\+srv)?:\/\/([^@]+)@/);
const creds = credMatch?.[1];
if (!creds) {
    console.error('Could not parse credentials from MONGODB_URI');
    process.exit(1);
}

const attempts = [
    ['Current .env.local', uri],
    [
        'SRV (Atlas recommended)',
        `mongodb+srv://${creds}@averie-cluster0.qtmijzy.mongodb.net/averie?retryWrites=true&w=majority&appName=Averie-Cluster0`,
    ],
    [
        '3-host replica set',
        `mongodb://${creds}@ac-pqiuj4t-shard-00-00.qtmijzy.mongodb.net:27017,ac-pqiuj4t-shard-00-01.qtmijzy.mongodb.net:27017,ac-pqiuj4t-shard-00-02.qtmijzy.mongodb.net:27017/averie?ssl=true&replicaSet=atlas-pqiuj4t-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Averie-Cluster0`,
    ],
    [
        'Direct shard-00-01',
        `mongodb://${creds}@ac-pqiuj4t-shard-00-01.qtmijzy.mongodb.net:27017/averie?ssl=true&directConnection=true&authSource=admin&retryWrites=true&w=majority&appName=Averie-Cluster0`,
    ],
    [
        'Direct shard-00-02',
        `mongodb://${creds}@ac-pqiuj4t-shard-00-02.qtmijzy.mongodb.net:27017/averie?ssl=true&directConnection=true&authSource=admin&retryWrites=true&w=majority&appName=Averie-Cluster0`,
    ],
];

console.log('MongoDB write test\n');

for (const [label, testUri] of attempts) {
    console.log(`--- ${label} ---`);
    try {
        await mongoose.connect(testUri, mongoClientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        const col = mongoose.connection.db.collection('_write_probe');
        const { insertedId } = await col.insertOne({ probe: true, at: new Date() });
        await col.deleteOne({ _id: insertedId });
        console.log('OK (ping + write)');
        await mongoose.disconnect();
    } catch (error) {
        console.log(`FAIL ${error instanceof Error ? error.message : String(error)}`);
        try {
            await mongoose.disconnect();
        } catch {
            /* ignore */
        }
    }
}

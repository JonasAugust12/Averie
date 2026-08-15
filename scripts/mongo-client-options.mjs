/** Shared with scripts/check-mongodb.mjs — keep in sync with src/libs/mongodb.ts */
export const mongoClientOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15_000,
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
    },
};

import '@libs/mongo-dns';
import mongoose from 'mongoose';

/**
 * Cached MongoDB connection for Vercel serverless.
 *
 * Cold start creates a new connection; warm invocations reuse `cached.conn`
 * so we don't open a new TCP connection on every API request.
 *
 * @see https://mongoosejs.com/docs/lambda.html
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (process.env.MONGODB_DEBUG === '1') {
    mongoose.set('debug', true);
}

/** Align with MongoDB Atlas driver onboarding (Stable API v1). */
export const mongoClientOptions = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverApi: {
        version: '1' as const,
        strict: true,
        deprecationErrors: true,
    },
} satisfies mongoose.ConnectOptions;

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (!MONGODB_URI) {
        throw new Error(
            'Missing MONGODB_URI. Copy .env.example to .env.local and set your Atlas URI.',
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, mongoClientOptions);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export function getMongoReadyState(): string {
    const states: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };
    return states[mongoose.connection.readyState] ?? 'unknown';
}

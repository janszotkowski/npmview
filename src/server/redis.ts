import Redis from 'ioredis';
import { decode, encode } from '@msgpack/msgpack';

const REDIS_URL = process.env['REDIS_URL'] || 'redis://localhost:6380';

const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        return Math.min(times * 50, 2000);
    },
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis');
});

export const getBinaryCache = async <T>(key: string): Promise<T | null> => {
    try {
        const buffer = await redis.getBuffer(key);
        if (!buffer) return null;
        return decode(buffer) as T;
    } catch (error) {
        console.error(`Cache read failed for ${key}:`, error);
        return null;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setBinaryCache = async (key: string, data: any, ttl: number = 3600): Promise<void> => {
    try {
        const encoded = encode(data);
        await redis.set(key, Buffer.from(encoded), 'EX', ttl);
    } catch (error) {
        console.error(`Cache write failed for ${key}:`, error);
    }
};

export default redis;
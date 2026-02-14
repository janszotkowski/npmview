import Redis from 'ioredis';

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

export const getCache = async <T>(key: string): Promise<T | null> => {
    try {
        const data = await redis.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
    } catch (error) {
        console.error(`Cache get error for key ${key}:`, error);
        return null;
    }
};

export const setCache = async <T>(key: string, data: T, ttlSeconds: number = 3600): Promise<void> => {
    try {
        const serialized = JSON.stringify(data);
        await redis.set(key, serialized, 'EX', ttlSeconds);
    } catch (error) {
        console.error(`Cache set error for key ${key}:`, error);
    }
};

export default redis;
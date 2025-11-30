import Redis from 'ioredis';

// Create Redis client - supports both local and cloud (Upstash, Redis Cloud)
const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL)
    : new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

// Handle connection events
redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (error) => {
    console.error('❌ Redis connection error:', error.message);
});

redis.on('ready', () => {
    console.log('🚀 Redis is ready to accept commands');
});

export default redis;

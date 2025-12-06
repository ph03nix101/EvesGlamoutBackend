"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
// Create Redis client - supports both local and cloud (Upstash, Redis Cloud)
const redis = process.env.REDIS_URL
    ? new ioredis_1.default(process.env.REDIS_URL)
    : new ioredis_1.default({
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
exports.default = redis;

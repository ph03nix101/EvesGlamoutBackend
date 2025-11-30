import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WORDPRESS_URL = process.env.WORDPRESS_URL;

if (!WORDPRESS_URL) {
    throw new Error('WORDPRESS_URL is not defined in environment variables');
}

export const wordpressApi = axios.create({
    baseURL: `${WORDPRESS_URL}/wp-json`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

console.log('✅ WordPress API client configured');

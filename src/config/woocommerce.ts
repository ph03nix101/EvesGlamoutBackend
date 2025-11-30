import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.WOOCOMMERCE_URL || !process.env.WOOCOMMERCE_CONSUMER_KEY || !process.env.WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error('Missing required WooCommerce environment variables. Please check your .env file.');
}

export const wooCommerce = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_URL,
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
    version: 'wc/v3',
});

console.log('✅ WooCommerce client configured');

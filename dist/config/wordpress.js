"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordpressApi = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WORDPRESS_URL = process.env.WORDPRESS_URL;
if (!WORDPRESS_URL) {
    throw new Error('WORDPRESS_URL is not defined in environment variables');
}
exports.wordpressApi = axios_1.default.create({
    baseURL: `${WORDPRESS_URL}/wp-json`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});
console.log('✅ WordPress API client configured');

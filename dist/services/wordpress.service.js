"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordPressService = void 0;
const wordpress_1 = require("../config/wordpress");
class WordPressService {
    /**
     * Login with WordPress JWT Authentication
     */
    static async login(username, password) {
        try {
            const { data } = await wordpress_1.wordpressApi.post('/jwt-auth/v1/token', {
                username,
                password,
            });
            return data;
        }
        catch (error) {
            if (error.response?.data) {
                throw new Error(error.response.data.message || 'Login failed');
            }
            throw error;
        }
    }
    /**
     * Validate JWT token with WordPress
     */
    static async validateToken(token) {
        try {
            const { data } = await wordpress_1.wordpressApi.post('/jwt-auth/v1/token/validate', null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    /**
     * Get WordPress user by ID
     */
    static async getUser(userId, token) {
        try {
            const { data } = await wordpress_1.wordpressApi.get(`/wp/v2/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        catch (error) {
            throw new Error('Failed to fetch user');
        }
    }
    /**
     * Create new WordPress user
     */
    static async createUser(userData) {
        try {
            const { data } = await wordpress_1.wordpressApi.post('/wp/v2/users', userData);
            return data;
        }
        catch (error) {
            if (error.response?.data) {
                throw new Error(error.response.data.message || 'Registration failed');
            }
            throw error;
        }
    }
    /**
     * Update WordPress user
     */
    static async updateUser(userId, userData, token) {
        try {
            const { data } = await wordpress_1.wordpressApi.post(`/wp/v2/users/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        catch (error) {
            throw new Error('Failed to update user');
        }
    }
}
exports.WordPressService = WordPressService;

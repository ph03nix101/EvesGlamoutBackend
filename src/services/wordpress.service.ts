import { wordpressApi } from '../config/wordpress';

export class WordPressService {
    /**
     * Login with WordPress JWT Authentication
     */
    static async login(username: string, password: string) {
        try {
            const { data } = await wordpressApi.post('/jwt-auth/v1/token', {
                username,
                password,
            });
            return data;
        } catch (error: any) {
            if (error.response?.data) {
                throw new Error(error.response.data.message || 'Login failed');
            }
            throw error;
        }
    }

    /**
     * Validate JWT token with WordPress
     */
    static async validateToken(token: string) {
        try {
            const { data } = await wordpressApi.post('/jwt-auth/v1/token/validate', null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error: any) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Get WordPress user by ID
     */
    static async getUser(userId: number, token: string) {
        try {
            const { data } = await wordpressApi.get(`/wp/v2/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error: any) {
            throw new Error('Failed to fetch user');
        }
    }

    /**
     * Create new WordPress user
     */
    static async createUser(userData: {
        username: string;
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
    }) {
        try {
            const { data } = await wordpressApi.post('/wp/v2/users', userData);
            return data;
        } catch (error: any) {
            if (error.response?.data) {
                throw new Error(error.response.data.message || 'Registration failed');
            }
            throw error;
        }
    }

    /**
     * Update WordPress user
     */
    static async updateUser(userId: number, userData: any, token: string) {
        try {
            const { data } = await wordpressApi.post(`/wp/v2/users/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        } catch (error: any) {
            throw new Error('Failed to update user');
        }
    }
}

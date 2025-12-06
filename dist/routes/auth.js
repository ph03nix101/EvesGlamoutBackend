"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wordpress_service_1 = require("../services/wordpress.service");
const jwt_1 = require("../utils/jwt");
const router = (0, express_1.Router)();
/**
 * POST /api/auth/login
 * Login with email/password
 */
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        // Authenticate with WordPress JWT
        const wpAuth = await wordpress_service_1.WordPressService.login(username, password);
        // WordPress JWT returns: { token, user_email, user_nicename, user_display_name }
        // We need to extract user data from the token or make another API call
        // Generate our own JWT tokens with user info
        const token = (0, jwt_1.generateToken)({
            email: wpAuth.user_email,
            displayName: wpAuth.user_display_name,
            nicename: wpAuth.user_nicename,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            email: wpAuth.user_email,
        });
        res.json({
            token,
            refreshToken,
            wpToken: wpAuth.token, // WordPress token for API calls
            user: {
                email: wpAuth.user_email,
                displayName: wpAuth.user_display_name,
                nicename: wpAuth.user_nicename,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /api/auth/google
 * Login with Google OAuth
 */
router.post('/google', async (req, res, next) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ error: 'Google credential is required' });
        }
        // Decode Google JWT to extract user info
        const decoded = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
        const email = decoded.email;
        const displayName = decoded.name || email;
        const nicename = email.split('@')[0];
        // Generate our own JWT tokens
        const token = (0, jwt_1.generateToken)({
            email: email,
            displayName: displayName,
            nicename: nicename,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            email: email,
        });
        res.json({
            token,
            refreshToken,
            wpToken: '', // Not needed for Google login
            user: {
                email: email,
                displayName: displayName,
                nicename: nicename,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /api/auth/register
 * Register new user
 */
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Create username from email
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const userData = {
            username,
            email,
            password,
            first_name: firstName || '',
            last_name: lastName || '',
        };
        // Create user in WordPress
        const wpUser = await wordpress_service_1.WordPressService.createUser(userData);
        // Auto-login after registration
        const wpAuth = await wordpress_service_1.WordPressService.login(username, password);
        const token = (0, jwt_1.generateToken)({
            id: wpUser.id,
            email: wpUser.email,
            displayName: wpUser.name,
        });
        const refreshToken = (0, jwt_1.generateRefreshToken)({
            id: wpUser.id,
        });
        res.status(201).json({
            token,
            refreshToken,
            user: {
                id: wpUser.id,
                email: wpUser.email,
                displayName: wpUser.name,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token is required' });
        }
        // Verify refresh token
        const decoded = (0, jwt_1.verifyToken)(refreshToken);
        // Generate new access token
        const token = (0, jwt_1.generateToken)({
            id: decoded.id,
            email: decoded.email,
            displayName: decoded.displayName,
        });
        res.json({ token });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});
/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get('/me', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = (0, jwt_1.verifyToken)(token);
        // Optionally fetch fresh user data from WordPress
        // For now, just return decoded token data
        res.json({
            user: {
                id: decoded.id,
                email: decoded.email,
                displayName: decoded.displayName,
            },
        });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
/**
 * POST /api/auth/logout
 * Logout (client should delete tokens)
 */
router.post('/logout', (req, res) => {
    // With JWT, logout is handled client-side by deleting the token
    // This endpoint is here for consistency and future server-side token blacklisting
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;

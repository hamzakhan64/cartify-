// =============================================
// authService.js
// All API calls related to authentication.
// =============================================

import api from './api'

// signup() — Register a new user
// Sends: { name, email, password } to POST /api/auth/signup
export async function signup(data) {
    const response = await api.post('/api/auth/signup', data)
    return response.data // backend returns { user, token }
}

// login() — Log in an existing user
// Sends: { email, password } to POST /api/auth/login
export async function login(data) {
    try {
        const response = await api.post('/api/auth/login', data)
        return response.data // backend returns { user, token }
    } catch (error) {
        // TEMPORARY MOCK FOR UI TESTING WITHOUT BACKEND
        if (data.email === 'admin@admin.com' && data.password === 'admin') {
            return {
                user: { _id: 'admin123', name: 'Admin', email: 'admin@admin.com', role: 'admin' },
                token: 'mock-admin-token'
            }
        }
        if (data.email === 'user@user.com' && data.password === 'user') {
            return {
                user: { _id: 'user123', name: 'Test User', email: 'user@user.com', role: 'user' },
                token: 'mock-user-token'
            }
        }
        throw error;
    }
}

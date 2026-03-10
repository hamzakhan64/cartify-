// =============================================
// api.js
// Creates a shared Axios instance for all API calls.
// Automatically attaches the JWT token to every request.
// =============================================

import axios from 'axios'

// The base URL comes from your .env file.
// Create a file called .env in the project root and add:
//   VITE_API_URL=http://localhost:5000
const API_URL = import.meta.env.VITE_API_URL || 'https://cartifyserver-eight.vercel.app'

// Create one shared axios instance (used by all service files)
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // ✅ this is critical — sends cookies/session
    headers: { 'Content-Type': 'application/json' }
})

// Request Interceptor — runs BEFORE every API call
// Reads the saved token from localStorage and adds it to the request header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('cartify_token')
        if (token) {
            // Attach token as Bearer — your backend will read this to verify the user
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default api

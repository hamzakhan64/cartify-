// =============================================
// AuthContext.jsx
// Manages global authentication state.
// Provides: user, token, login(), logout()
// =============================================

import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context
const AuthContext = createContext(null)

// 2. Provider component — wraps the whole app in App.jsx
export function AuthProvider({ children }) {
    // user holds the logged-in user object (name, email, role, etc.)
    const [user, setUser] = useState(null)
    // token holds the JWT string for API requests
    const [token, setToken] = useState(null)

    // On app load: check if user was previously logged in (persisted in localStorage)
    useEffect(() => {
        const savedUser = localStorage.getItem('cartify_user')
        const savedToken = localStorage.getItem('cartify_token')
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser))
            setToken(savedToken)
        }
    }, []) // empty array = runs only once on mount

    // login() — called after successful API login/signup
    function login(userData, jwtToken) {
        setUser(userData)
        setToken(jwtToken)
        // Persist to localStorage so user stays logged in after page refresh
        localStorage.setItem('cartify_user', JSON.stringify(userData))
        localStorage.setItem('cartify_token', jwtToken)
    }

    // logout() — clears everything
    function logout() {
        setUser(null)
        setToken(null)
        localStorage.removeItem('cartify_user')
        localStorage.removeItem('cartify_token')
    }

    // Everything we expose to child components
    const value = { user, token, login, logout }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 3. Custom hook — easy way to use auth in any component
// Usage: const { user, login, logout } = useAuth()
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}

export default AuthContext

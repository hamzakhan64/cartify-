// =============================================
// App.jsx — Root Component
// The "entry" of the whole app.
// - Wraps app in AuthProvider and CartProvider
// - Defines all 7 page routes
// - Applies ProtectedRoute where needed
// =============================================

import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Route Guard
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Admin from './pages/Admin'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import ShippingPolicy from './pages/ShippingPolicy'
import GoogleCallback from './pages/GoogleCallback'

function App() {
  return (
    // AuthProvider must wrap CartProvider and everything else
    // because CartProvider might need user info in the future
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* ---- Public Routes (anyone can visit) ---- */}
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/google-callback" element={<GoogleCallback />} />

            {/* ---- Protected Routes (must be logged in) ---- */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* ---- Admin Only Route ---- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
// =============================================
// CartContext.jsx
// Manages global shopping cart state.
// Provides: cartItems, cartCount, addToCart(),
//           removeFromCart(), updateQty(), clearCart()
// =============================================

import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import * as cartService from '../services/cartService'

// 1. Create the context
const CartContext = createContext(null)

// 2. Provider component
export function CartProvider({ children }) {
    const { user, token } = useAuth()
    // cartItems is an array of objects like:
    // { _id, title, price, image, quantity }
    const [cartItems, setCartItems] = useState([])

    // Load cart from backend if logged in, otherwise keep empty
    useEffect(() => {
        if (token) {
            fetchCart()
        } else {
            setCartItems([])
        }
    }, [token])

    async function fetchCart() {
        try {
            const data = await cartService.getCart()
            // Backend returns cart with populated product info
            // Ensure format matches: { _id, title, price, image, quantity }
            // CRITICAL: Filter out items where productId is null (deleted products)
            const formatted = data
                .filter(item => item.productId)
                .map(item => ({
                    _id: item.productId._id,
                    title: item.productId.title,
                    price: item.productId.price,
                    image: item.productId.image,
                    quantity: item.quantity
                }))
            setCartItems(formatted)
        } catch (error) {
            console.error('Failed to fetch cart:', error)
        }
    }

    // addToCart() — adds product or increments qty
    async function addToCart(product) {
        if (token) {
            try {
                await cartService.addToCart(product._id, 1)
                await fetchCart() // Refresh from DB
            } catch (error) {
                console.error('Failed to add to cart:', error)
            }
        } else {
            // Local fallback for guests
            setCartItems(prev => {
                const existing = prev.find(item => item._id === product._id)
                if (existing) {
                    return prev.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                }
                return [...prev, { ...product, quantity: 1 }]
            })
        }
    }

    // removeFromCart() — removes a product completely
    async function removeFromCart(productId) {
        if (token) {
            try {
                await cartService.removeItem(productId)
                await fetchCart()
            } catch (error) {
                console.error('Failed to remove from cart:', error)
            }
        } else {
            setCartItems(prev => prev.filter(item => item._id !== productId))
        }
    }

    // updateQty() — sets a specific quantity
    async function updateQty(productId, qty) {
        if (qty < 1) {
            await removeFromCart(productId)
            return
        }

        if (token) {
            try {
                await cartService.updateQty(productId, qty)
                await fetchCart()
            } catch (error) {
                console.error('Failed to update qty:', error)
            }
        } else {
            setCartItems(prev =>
                prev.map(item =>
                    item._id === productId ? { ...item, quantity: qty } : item
                )
            )
        }
    }

    // clearCart() — empties the entire cart
    function clearCart() {
        setCartItems([])
        // Backend implementation might need a clearCart endpoint if required
    }

    // Derived values
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

    const value = { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQty, clearCart }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 3. Custom hook
export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used inside CartProvider')
    return context
}

export default CartContext

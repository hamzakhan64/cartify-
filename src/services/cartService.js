// =============================================
// cartService.js
// All API calls related to the shopping cart.
// These sync the local cart with the backend database.
// =============================================

import api from './api'

// getCart() — Fetch the logged-in user's cart from backend
export async function getCart() {
    const response = await api.get('/api/cart')
    return response.data
}

// addToCart() — Add a product to cart in backend
// Sends: { productId, quantity }
export async function addToCart(productId, quantity = 1) {
    const response = await api.post('/api/cart', { productId, quantity })
    return response.data
}

// removeItem() — Remove one item from cart by product ID
export async function removeItem(productId) {
    const response = await api.delete(`/api/cart/${productId}`)
    return response.data
}

// updateQty() — Update the quantity of an item in backend
export async function updateQty(productId, quantity) {
    const response = await api.put(`/api/cart/${productId}`, { quantity })
    return response.data
}

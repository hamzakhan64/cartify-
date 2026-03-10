// =============================================
// productService.js
// All API calls related to products.
// =============================================

import api from './api'

// getProducts() — Fetch all products (used on Products page)
export async function getProducts() {
    const response = await api.get('/api/products')
    return response.data // array of product objects
}

// addProduct() — Admin only — Add a new product
// Sends: { title, description, price, image } or FormData
export async function addProduct(data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    const response = await api.post('/api/products', data, config)
    return response.data
}

// deleteProduct() — Admin only — Delete a product by ID
export async function deleteProduct(id) {
    const response = await api.delete(`/api/products/${id}`)
    return response.data
}

// updateProduct() — Admin only — Update a product by ID
export async function updateProduct(id, data) {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    const response = await api.put(`/api/products/${id}`, data, config)
    return response.data
}

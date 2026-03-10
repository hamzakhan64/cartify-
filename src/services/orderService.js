// =============================================
// orderService.js
// API calls related to placing orders.
// =============================================

import api from './api'

// placeOrder() — Place a new order
export async function placeOrder(orderData) {
    const response = await api.post('/api/orders', orderData)
    return response.data
}

// Admin: Get all orders
export async function getAdminOrders() {
    const response = await api.get('/api/orders/admin/all')
    return response.data
}

// Admin: Update order status
export async function updateOrderStatus(id, status) {
    const response = await api.put(`/api/orders/admin/${id}/status`, { status })
    return response.data
}

// Admin: Get Dashboard Stats
export async function getAdminStats() {
    const response = await api.get('/api/orders/admin/stats')
    return response.data
}

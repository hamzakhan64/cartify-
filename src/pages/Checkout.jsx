// =============================================
// Checkout.jsx — Clean Checkout (no sidebar)
// =============================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/orderService'

function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', address: '', city: '', zipCode: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const shipping = cartTotal >= 100 ? 0 : 9.99
    const grandTotal = (cartTotal + shipping).toFixed(2)

    if (cartItems.length === 0 && !success) { navigate('/cart'); return null }

    function handleChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true); setError('')
        try {
            await placeOrder({
                orderItems: cartItems.map(i => ({ product: i._id, quantity: i.quantity, price: i.price })),
                shippingAddress: formData, paymentMethod: 'Cash On Delivery', totalPrice: Number(grandTotal)
            })
            clearCart(); setSuccess(true)
        } catch (err) { setError(err.response?.data?.message || 'Failed to place order.') }
        finally { setLoading(false) }
    }

    if (success) {
        return (
            <div className="min-h-screen flex flex-col bg-white font-sans">
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl text-center w-full max-w-md">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
                        <p className="text-gray-500 text-sm mb-6">Your order is being prepared.</p>
                        <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all" onClick={() => navigate('/products')}>
                            Continue Shopping
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar />
            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Checkout</h1>
                <p className="text-sm text-gray-500 mb-6 sm:mb-8">Complete your order</p>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-sm font-medium">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
                    <div className="bg-gray-50 p-5 sm:p-8 rounded-2xl">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5 sm:mb-6">Shipping Information</h2>
                        <form id="checkout-form" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { label: 'Full Name', name: 'fullName', type: 'text', ph: 'John Doe' },
                                    { label: 'Email', name: 'email', type: 'email', ph: 'john@example.com' },
                                    { label: 'Phone', name: 'phone', type: 'tel', ph: '+92 300 0000000' },
                                    { label: 'Address', name: 'address', type: 'text', ph: '123 Main Street', span: true },
                                    { label: 'City', name: 'city', type: 'text', ph: 'Lahore' },
                                    { label: 'Zip Code', name: 'zipCode', type: 'text', ph: '54000' },
                                ].map(f => (
                                    <div key={f.name} className={f.span ? 'sm:col-span-2' : ''}>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
                                        <input type={f.type} name={f.name} value={formData[f.name]} onChange={handleChange}
                                            className="w-full p-2.5 sm:p-3 rounded-xl bg-white border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 outline-none transition-all text-sm" placeholder={f.ph} required />
                                    </div>
                                ))}
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-6 sm:mt-8 mb-4">Payment</h2>
                            <div className="bg-white p-4 rounded-xl border-2 border-gray-900">
                                <div className="flex items-center gap-3">
                                    <input type="radio" id="cod" name="payment" checked readOnly className="accent-gray-900 w-4 h-4" />
                                    <label htmlFor="cod" className="font-bold text-gray-900 text-sm cursor-pointer">Cash on Delivery</label>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl sticky top-[76px]">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                        <div className="space-y-3 mb-5">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex gap-3 items-center">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center p-1 border border-gray-100 shrink-0">
                                        <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" onError={(e) => { e.target.src = 'https://placehold.co/48/f3f3f3/999' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{item.title}</p>
                                        <p className="text-[0.65rem] text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-xs sm:text-sm text-gray-900">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pt-3 space-y-2 mb-4">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-bold text-gray-900">Rs.{cartTotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>{shipping === 0 ? 'Free' : `Rs.${shipping}`}</span></div>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mb-5">
                            <div className="flex justify-between items-center"><span className="text-sm font-bold text-gray-500">Total</span><span className="text-xl sm:text-2xl font-black text-gray-900">Rs.{Number(grandTotal).toLocaleString()}</span></div>
                        </div>
                        <button type="submit" form="checkout-form" className="w-full bg-black text-white py-3 sm:py-3.5 rounded-full font-bold text-sm cursor-pointer hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed" disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Checkout

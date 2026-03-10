// =============================================
// Cart.jsx — Clean Cart Page (no sidebar)
// =============================================

import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'

function Cart() {
    const { cartItems, cartTotal, updateQty, removeFromCart } = useCart()
    const navigate = useNavigate()
    const shipping = cartTotal >= 100 ? 0 : 9.99
    const grandTotal = (cartTotal + shipping).toFixed(2)

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar />
            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">Shopping Cart</h1>
                <p className="text-sm text-gray-500 mb-6 sm:mb-8">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>

                {cartItems.length === 0 && (
                    <div className="text-center py-16 sm:py-20 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-4">🛒</div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 text-sm mb-6">Add products to get started!</p>
                        <Link to="/products" className="bg-black text-white px-6 sm:px-8 py-3 rounded-full font-bold text-sm no-underline hover:bg-gray-800 transition-all inline-block">
                            Browse Products
                        </Link>
                    </div>
                )}

                {cartItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                        <div>
                            {cartItems.map(item => (
                                <CartItem key={item._id} item={item} onUpdate={updateQty} onRemove={removeFromCart} />
                            ))}
                        </div>

                        <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl sticky top-[76px]">
                            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
                            <div className="space-y-3 mb-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">Rs.{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                        {shipping === 0 ? 'Free' : `Rs.${shipping}`}
                                    </span>
                                </div>
                                {cartTotal < 100 && <p className="text-xs text-red-500 font-medium">Add Rs.{(100 - cartTotal).toFixed(2)} more for free shipping!</p>}
                            </div>
                            <div className="border-t border-gray-200 pt-4 mb-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-500">Total</span>
                                    <span className="text-xl sm:text-2xl font-black text-gray-900">Rs.{grandTotal}</span>
                                </div>
                            </div>
                            <button className="w-full bg-black text-white py-3 sm:py-3.5 rounded-full font-bold text-sm cursor-pointer hover:bg-gray-800 transition-all"
                                onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </button>
                            <Link to="/products" className="block text-center mt-4 text-gray-500 text-sm font-medium no-underline hover:text-gray-900 transition-colors">
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Cart

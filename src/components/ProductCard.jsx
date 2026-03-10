// =============================================
// ProductCard.jsx — ZeroLifestyle-style product card
// Buy It Now → checkout (logged in) or sign-in (guest)
// Add to Cart → adds to cart (logged in) or sign-in (guest)
// =============================================

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProductCard({ _id, title, description, price, image, originalPrice, discount, rating, reviews, category }) {
    const { addToCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [added, setAdded] = useState(false)

    const discountPercent = discount || (originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0)
    const displayOriginalPrice = originalPrice || (discountPercent > 0 ? Math.round(price / (1 - discountPercent / 100)) : Math.round(price * 1.5))
    const displayRating = rating || (4.5 + Math.random() * 0.5).toFixed(1)

    function handleAddToCart() {
        if (!user) { navigate('/signin'); return }
        addToCart({ _id, title, description, price, image })
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    function handleBuyNow() {
        if (!user) { navigate('/signin'); return }
        addToCart({ _id, title, description, price, image })
        navigate('/checkout')
    }

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
            {/* Image */}
            <div className="relative bg-[#F3F3F3] h-[220px] sm:h-[260px] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
                <span className="absolute top-3 left-3 text-[0.6rem] font-bold text-red-500 uppercase tracking-wider bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {category || 'NEW'}
                </span>
                <img src={image} alt={title}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://placehold.co/300x300/f3f3f3/999?text=Product' }} />
            </div>

            {/* Info */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug line-clamp-1 flex-1">{title}</h3>
                    {discountPercent > 0 && (
                        <span className="text-[0.7rem] font-bold text-red-500 whitespace-nowrap shrink-0">{discountPercent}% OFF</span>
                    )}
                </div>
                <p className="text-xs sm:text-[0.8rem] text-gray-500 leading-relaxed mb-2 sm:mb-3 line-clamp-1">{description}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(displayRating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-[0.7rem] font-semibold text-gray-500">{displayRating}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">Rs.{price.toLocaleString()}</span>
                    <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">Rs.{displayOriginalPrice.toLocaleString()}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                    {!added ? (
                        <>
                            <button onClick={handleAddToCart}
                                className="flex-1 bg-white text-gray-900 border border-gray-200 py-2 sm:py-2.5 rounded-full font-bold text-[0.75rem] sm:text-[0.8rem] cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50 active:scale-95">
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow}
                                className="flex-1 bg-black text-white py-2 sm:py-2.5 rounded-full font-bold text-[0.75rem] sm:text-[0.8rem] cursor-pointer transition-all hover:bg-gray-800 active:scale-95">
                                Buy It Now
                            </button>
                        </>
                    ) : (
                        <button onClick={() => navigate('/cart')}
                            className="flex-1 bg-green-500 text-white py-2 sm:py-2.5 rounded-full font-bold text-[0.75rem] sm:text-[0.8rem] cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-green-600">
                            ✓ Added! View Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductCard

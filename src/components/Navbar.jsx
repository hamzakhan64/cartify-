// =============================================
// Navbar.jsx — Clean white navbar with user dropdown
// =============================================

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState, useRef, useEffect } from 'react'

function Navbar() {
    const { user, logout } = useAuth()
    const { cartCount } = useCart()
    const navigate = useNavigate()
    const [showDropdown, setShowDropdown] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleLogout() {
        logout()
        setShowDropdown(false)
        navigate('/')
    }

    return (
        <nav className="bg-white sticky top-0 z-[100] border-b border-gray-100 font-sans">
            <div className="max-w-[1320px] mx-auto flex justify-between items-center h-[60px] sm:h-[68px] px-4 sm:px-6">

                {/* Logo */}
                <Link to="/" className="no-underline flex items-center gap-2 shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-black">C</span>
                    </div>
                    <span className="text-lg sm:text-[1.25rem] font-black text-black tracking-tight">CARTIFY</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-8">
                    <Link to="/" className="text-gray-900 no-underline font-semibold text-[0.85rem] hover:text-red-500 transition-colors">Home</Link>
                    <Link to="/products?category=Smart Watches" className="text-gray-600 no-underline font-semibold text-[0.85rem] hover:text-gray-900 transition-colors">Smart Watches</Link>
                    <Link to="/products?category=Airpods" className="text-gray-600 no-underline font-semibold text-[0.85rem] hover:text-gray-900 transition-colors">Earbuds</Link>
                    <Link to="/products?category=Headphones" className="text-gray-600 no-underline font-semibold text-[0.85rem] hover:text-gray-900 transition-colors">Headphones</Link>
                    <Link to="/products?category=Shoes" className="text-gray-600 no-underline font-semibold text-[0.85rem] hover:text-gray-900 transition-colors">Shoes</Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Cart */}
                    {(!user || user.role !== 'admin') && (
                        <Link to={user ? "/cart" : "/signin"} className="relative text-gray-600 hover:text-black transition-colors p-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <path d="M16 10a4 4 0 0 1-8 0"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.55rem] font-bold rounded-full w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* Auth */}
                    {!user ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/signin" className="text-gray-600 no-underline font-semibold text-xs sm:text-[0.85rem] hover:text-black transition-colors hidden sm:block">Sign In</Link>
                            <Link to="/signup" className="bg-black text-white no-underline font-bold text-xs sm:text-[0.8rem] px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-all">Sign Up</Link>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-1">
                                <span className="text-[0.85rem] font-bold text-gray-700 hidden sm:block">{user.name}</span>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm hover:bg-gray-200 transition-colors">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <svg className={`w-3 h-3 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                    <Link to="/products" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 no-underline transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        Products
                                    </Link>
                                    <Link to="/cart" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 no-underline transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                        My Cart
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 no-underline transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="border-t border-gray-50 mt-1 pt-1">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer text-left">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-600 p-1 bg-transparent border-none cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            {showMobileMenu
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
                    <Link to="/" onClick={() => setShowMobileMenu(false)} className="block py-2.5 text-sm font-semibold text-gray-900 no-underline">Home</Link>
                    <Link to="/products?category=Smart Watches" onClick={() => setShowMobileMenu(false)} className="block py-2.5 text-sm font-semibold text-gray-600 no-underline">Smart Watches</Link>
                    <Link to="/products?category=Airpods" onClick={() => setShowMobileMenu(false)} className="block py-2.5 text-sm font-semibold text-gray-600 no-underline">Earbuds</Link>
                    <Link to="/products?category=Headphones" onClick={() => setShowMobileMenu(false)} className="block py-2.5 text-sm font-semibold text-gray-600 no-underline">Headphones</Link>
                    <Link to="/products?category=Shoes" onClick={() => setShowMobileMenu(false)} className="block py-2.5 text-sm font-semibold text-gray-600 no-underline">Shoes</Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar
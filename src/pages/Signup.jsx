// =============================================
// Signup.jsx — Clean White Registration Page
// Route: /signup — Client-side validation
// =============================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup as signupApi } from '../services/authService'

function Signup() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function validate() {
        if (!formData.name.trim()) return 'Name is required.'
        if (!formData.email.includes('@')) return 'Enter a valid email.'
        if (formData.password.length < 6) return 'Password must be 6+ characters.'
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match.'
        return null
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(''); setSuccess('')
        const err = validate()
        if (err) { setError(err); return }
        setLoading(true)
        try {
            await signupApi({ name: formData.name, email: formData.email, password: formData.password })
            setSuccess('Account created! Redirecting...')
            setTimeout(() => navigate('/signin'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-start justify-center p-6 sm:p-8 md:p-16 bg-[#f0f4f8] font-sans">
            <div className="bg-white border border-gray-200 rounded-[1.25rem] p-6 sm:p-10 w-full max-w-[420px] m-auto shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="text-center mb-8">
                    <Link to="/" className="no-underline block mb-5">
                        <span className="text-[1.4rem] font-black text-gray-900 tracking-wider"><span className="text-[#7c3aed]"></span> CARTIFY</span>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h1>
                    <p className="text-gray-500 text-[0.88rem]">Join thousands of happy shoppers</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-4 font-medium text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 mb-4 font-medium text-sm">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" name="name" placeholder="John Doe"
                            value={formData.name} onChange={handleChange} className="w-full p-3 px-4.5 rounded-xl bg-white border border-gray-200 focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 outline-none transition-all duration-200" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input type="email" name="email" placeholder="you@example.com"
                            value={formData.email} onChange={handleChange} className="w-full p-3 px-4.5 rounded-xl bg-white border border-gray-200 focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 outline-none transition-all duration-200" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                        <input type="password" name="password" placeholder="Minimum 6 characters"
                            value={formData.password} onChange={handleChange} className="w-full p-3 px-4.5 rounded-xl bg-white border border-gray-200 focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 outline-none transition-all duration-200" required />
                    </div>
                    <div className="mb-7">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder="Repeat password"
                            value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 px-4.5 rounded-xl bg-white border border-gray-200 focus:border-[#7c3aed] focus:ring-4 focus:ring-[#7c3aed]/10 outline-none transition-all duration-200" required />
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-3.5 px-6 rounded-full font-bold text-[0.95rem] cursor-pointer mb-3 mt-4 transition-all hover:bg-gray-800 shadow-lg disabled:bg-gray-400"
                        disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 text-[0.85rem]">
                    Already have an account? <Link to="/signin" className="text-[#7c3aed] font-bold no-underline hover:underline ml-1">Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
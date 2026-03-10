import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productService'

function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const categoryFilter = queryParams.get('category')

    useEffect(() => { fetchProducts() }, [])

    async function fetchProducts() {
        try {
            const data = await getProducts()
            setProducts(data.length > 0 ? data : DEMO_PRODUCTS)
        } catch { setProducts(DEMO_PRODUCTS) }
        finally { setLoading(false) }
    }

    const categories = ['All Products', 'Smart Watches', 'Airpods', 'Headphones', 'Shoes']

    const filtered = products.filter(p => {
        const matchesCategory = categoryFilter && categoryFilter !== 'All Products' ? p.category === categoryFilter : true
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <Navbar />
            <main className="flex-1 max-w-[1320px] mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
                {/* Header + Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
                            {categoryFilter || 'All Products'}
                        </h1>
                        <p className="text-sm text-gray-500">{filtered.length} products found</p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-gray-200 focus:border-gray-300 outline-none transition-all" />
                        <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <Link key={cat}
                            to={cat === 'All Products' ? '/products' : `/products?category=${encodeURIComponent(cat)}`}
                            className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all no-underline shrink-0 ${(categoryFilter === cat || (!categoryFilter && cat === 'All Products'))
                                    ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}>
                            {cat}
                        </Link>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                        {[...Array(8)].map((_, i) => <div key={i} className="h-[300px] sm:h-[420px] bg-gray-50 animate-pulse rounded-2xl" />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                        {filtered.map(p => <ProductCard key={p._id} {...p} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-500 text-sm">Try a different search or category.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}

const DEMO_PRODUCTS = [
    { _id: '1', title: 'Z-Elite Smartwatch', description: 'Premium AMOLED display with 24/7 heart rate.', price: 4999, originalPrice: 12999, category: 'Smart Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', rating: 4.8 },
    { _id: '2', title: 'Z-Flow Air Buds', description: 'True wireless noise-canceling earbuds.', price: 2999, originalPrice: 8999, category: 'Airpods', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', rating: 4.9 },
    { _id: '3', title: 'Z-Bass Headphones', description: 'Studio-quality sound with deep bass.', price: 3499, originalPrice: 7999, category: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', rating: 4.7 },
    { _id: '4', title: 'Z-Runner Shoes', description: 'Lightweight performance running shoes.', price: 5999, originalPrice: 12999, category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', rating: 4.6 },
]

export default Products
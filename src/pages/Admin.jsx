import { useState, useEffect } from 'react'
import { getProducts, addProduct, deleteProduct, updateProduct } from '../services/productService'
import { getAdminOrders, updateOrderStatus, getAdminStats } from '../services/orderService'

function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0 })
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '' })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [adding, setAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [orderFilter, setOrderFilter] = useState('all')
    const [showNotif, setShowNotif] = useState(false)

    useEffect(() => { fetchAllData() }, [])

    async function fetchAllData() {
        setLoading(true)
        try {
            const [prodData, orderData, statsData] = await Promise.all([
                getProducts(), getAdminOrders(), getAdminStats()
            ])
            setProducts(prodData)
            setOrders(orderData)
            setStats(statsData)
        } catch { setError('Failed to fetch data.') }
        finally { setLoading(false) }
    }

    function handleChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }) }
    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) { setImageFile(file); const r = new FileReader(); r.onloadend = () => setImagePreview(r.result); r.readAsDataURL(file) }
    }
    function handleEdit(p) {
        setEditingId(p._id)
        setFormData({ title: p.title, description: p.description, price: p.price, image: p.image, category: p.category })
        setImagePreview(p.image)
        setActiveTab('products')
    }
    function cancelEdit() { setEditingId(null); setFormData({ title: '', description: '', price: '', category: '' }); setImageFile(null); setImagePreview(''); setError('') }

    async function handleSubmit(e) {
        e.preventDefault(); setAdding(true); setError(''); setSuccess('')
        try {
            const d = new FormData()
            d.append('title', formData.title); d.append('description', formData.description)
            d.append('price', formData.price); d.append('category', formData.category)
            if (imageFile) d.append('image', imageFile)
            if (editingId) { const u = await updateProduct(editingId, d); setProducts(products.map(p => p._id === editingId ? u : p)); setSuccess('Updated!'); setEditingId(null) }
            else { const n = await addProduct(d); setProducts([n, ...products]); setSuccess('Added!') }
            setFormData({ title: '', description: '', price: '', category: '' }); setImageFile(null); setImagePreview('')
            const s = await getAdminStats(); setStats(s)
        } catch (err) { setError(err.response?.data?.message || 'Failed. Check server.') }
        finally { setAdding(false); setTimeout(() => setSuccess(''), 3000) }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this product?')) return
        try { await deleteProduct(id); setProducts(products.filter(p => p._id !== id)); const s = await getAdminStats(); setStats(s) }
        catch { alert('Delete failed.') }
    }

    async function handleStatusUpdate(orderId, newStatus) {
        try { const u = await updateOrderStatus(orderId, newStatus); setOrders(orders.map(o => o._id === orderId ? { ...o, status: u.status } : o)); const s = await getAdminStats(); setStats(s) }
        catch { alert('Status update failed.') }
    }

    const pendingOrders = orders.filter(o => o.status === 'pending')
    const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter)

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
        { id: 'products', label: 'Products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { id: 'orders', label: 'Orders', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
        { id: 'support', label: 'Support', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    ]

    return (
        <div className="min-h-screen bg-white font-sans flex text-gray-800">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen bg-gray-50 border-r border-gray-100 flex flex-col shrink-0 z-50 w-60 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="p-5 flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm font-black">C</div>
                    <span className="text-lg font-black tracking-tight text-gray-900">CARTIFY</span>
                    <button 
                        className="md:hidden ml-auto text-gray-500 hover:text-gray-900 bg-transparent border-none cursor-pointer"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => { setActiveTab(t.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer border-none ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-500 hover:bg-white hover:text-gray-700'}`}>
                            {t.icon} {t.label}
                            {t.id === 'orders' && pendingOrders.length > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[0.6rem] font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingOrders.length}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-gray-100">
                    <button onClick={() => window.location.href = '/'} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all cursor-pointer bg-transparent border-none">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Exit to Store
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden text-gray-500 hover:text-gray-900 bg-transparent border-none cursor-pointer p-1"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-sm font-bold text-gray-900 capitalize">{activeTab}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notification bell */}
                        <div className="relative">
                            <button onClick={() => setShowNotif(!showNotif)} className="relative text-gray-400 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none p-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                {pendingOrders.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[0.5rem] font-bold rounded-full flex items-center justify-center">{pendingOrders.length}</span>
                                )}
                            </button>
                            {showNotif && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Notifications</span>
                                        <span className="text-[0.65rem] font-bold text-red-500">{pendingOrders.length} new</span>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {pendingOrders.length === 0 ? (
                                            <p className="p-4 text-sm text-gray-400 text-center">No new notifications</p>
                                        ) : pendingOrders.slice(0, 5).map(o => (
                                            <div key={o._id} onClick={() => { setActiveTab('orders'); setShowNotif(false) }}
                                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                                                <p className="text-xs font-bold text-gray-900">New Order #{o._id.slice(-6).toUpperCase()}</p>
                                                <p className="text-[0.65rem] text-gray-500">Rs.{o.total?.toLocaleString()} • {o.items?.length} items</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs">A</div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">

                    {/* ============ DASHBOARD TAB ============ */}
                    {activeTab === 'dashboard' && (
                        <>
                            <div className="mb-6">
                                <h1 className="text-xl font-black text-gray-900">Dashboard Overview</h1>
                                <p className="text-sm text-gray-400">Welcome back. Here's what's happening.</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {[
                                    { label: 'Revenue', value: `Rs.${stats.revenue?.toLocaleString() || 0}`, color: 'text-green-600', sub: 'Total earnings' },
                                    { label: 'Orders', value: stats.totalOrders || 0, color: 'text-blue-600', sub: `${pendingOrders.length} pending` },
                                    { label: 'Products', value: stats.totalProducts || products.length, color: 'text-purple-600', sub: 'In inventory' },
                                    { label: 'Customers', value: stats.totalUsers || 0, color: 'text-amber-600', sub: 'Registered users' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                                        <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                                        <h3 className={`text-2xl font-black ${s.color}`}>{s.value}</h3>
                                        <p className="text-[0.65rem] text-gray-400 mt-1">{s.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Sales Overview</h3>
                                    <div className="h-48 flex items-end gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => {
                                            const h = [35, 55, 40, 85, 60, 75, 50][i]
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                    <div className="w-full bg-gray-900 rounded-t-lg transition-all hover:bg-gray-700 cursor-pointer relative group" style={{ height: `${h}%` }}>
                                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[0.5rem] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">{h * 12}</span>
                                                    </div>
                                                    <span className="text-[0.55rem] text-gray-400 font-bold">{d}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4">Order Status</h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-amber-500', total: orders.length },
                                            { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-500', total: orders.length },
                                            { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500', total: orders.length },
                                            { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: 'bg-red-500', total: orders.length },
                                        ].map((s, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                                                    <span>{s.label}</span><span>{s.count}</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: s.total > 0 ? `${(s.count / s.total) * 100}%` : '0%' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
                                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer bg-transparent border-none">View all →</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.slice(0, 5).map(o => (
                                                <tr key={o._id} className="hover:bg-gray-50/50">
                                                    <td className="px-6 py-3"><span className="text-xs font-bold text-gray-900">#{o._id.slice(-6).toUpperCase()}</span></td>
                                                    <td className="px-4 py-3"><span className="text-xs text-gray-500">{o.userId?.name || 'Guest'}</span></td>
                                                    <td className="px-4 py-3"><span className="text-xs font-bold text-gray-900">Rs.{o.total?.toLocaleString()}</span></td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-[0.6rem] font-bold uppercase px-2.5 py-1 rounded-full ${o.status === 'pending' ? 'bg-amber-50 text-amber-600' : o.status === 'confirmed' ? 'bg-blue-50 text-blue-600' : o.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{o.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-300 text-sm">No orders yet</td></tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ============ PRODUCTS TAB ============ */}
                    {activeTab === 'products' && (
                        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">
                            {/* Add/Edit Form */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 sticky top-4">
                                <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">{editingId ? '✎' : '+'}</span>
                                    {editingId ? 'Edit Product' : 'Add Product'}
                                </h2>
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold mb-4">{error}</div>}
                                {success && <div className="bg-green-50 text-green-600 p-3 rounded-xl text-xs font-semibold mb-4">✓ {success}</div>}
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-medium focus:border-gray-300 transition-all" placeholder="Product title" required />
                                    <div className="grid grid-cols-2 gap-3">
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-medium cursor-pointer" required>
                                            <option value="">Category</option>
                                            <option value="Smart Watches">Smart Watches</option>
                                            <option value="Airpods">Airpods</option>
                                            <option value="Headphones">Headphones</option>
                                            <option value="Shoes">Shoes</option>
                                        </select>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-medium" placeholder="Price" required />
                                    </div>
                                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-sm font-medium resize-none h-20" placeholder="Description" required />
                                    <div className="relative border-2 border-dashed border-gray-100 rounded-xl p-3 text-center hover:bg-gray-50 transition-all">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-28 mx-auto object-contain" />
                                        ) : (
                                            <div className="py-4"><p className="text-xs text-gray-400 font-semibold">📷 Click to upload image</p></div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required={!editingId} />
                                    </div>
                                    <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-800 transition-all disabled:bg-gray-300" disabled={adding}>
                                        {adding ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                                    </button>
                                    {editingId && <button type="button" onClick={cancelEdit} className="w-full bg-gray-50 text-gray-500 py-2.5 rounded-xl font-semibold text-xs cursor-pointer border-none hover:bg-gray-100">Cancel</button>}
                                </form>
                            </div>

                            {/* Product List */}
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-900">Inventory ({products.length})</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead><tr className="bg-gray-50/50">
                                            <th className="px-6 py-3 text-left text-[0.6rem] font-bold text-gray-400 uppercase">Product</th>
                                            <th className="px-4 py-3 text-center text-[0.6rem] font-bold text-gray-400 uppercase">Price</th>
                                            <th className="px-4 py-3 text-right text-[0.6rem] font-bold text-gray-400 uppercase pr-6">Actions</th>
                                        </tr></thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {products.length === 0 ? (
                                                <tr><td colSpan="3" className="p-12 text-center text-gray-300 text-sm">No products yet</td></tr>
                                            ) : products.map(p => (
                                                <tr key={p._id} className={`hover:bg-gray-50/50 transition-colors ${editingId === p._id ? 'bg-blue-50/30' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center p-1 border border-gray-100 shrink-0">
                                                                <img src={p.image} alt="" className="max-h-full max-w-full object-contain" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.title}</p>
                                                                <p className="text-[0.6rem] font-semibold text-gray-400 uppercase">{p.category}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-center"><span className="text-sm font-bold text-gray-900">Rs.{p.price?.toLocaleString()}</span></td>
                                                    <td className="px-4 py-4 text-right pr-6">
                                                        <div className="flex justify-end gap-1.5">
                                                            <button onClick={() => handleEdit(p)} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-900 hover:text-white transition-all cursor-pointer border-none"><EditIcon /></button>
                                                            <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer border-none"><TrashIcon /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============ ORDERS TAB ============ */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center flex-wrap gap-3">
                                <h3 className="text-sm font-bold text-gray-900">Order Management</h3>
                                <div className="flex bg-gray-50 p-0.5 rounded-lg">
                                    {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map(f => (
                                        <button key={f} onClick={() => setOrderFilter(f)}
                                            className={`px-3 py-1.5 rounded-md text-[0.65rem] font-bold uppercase cursor-pointer border-none transition-all ${orderFilter === f ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-gray-400 hover:text-gray-600'}`}>
                                            {f} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="bg-gray-50/50">
                                        <th className="px-6 py-3 text-left text-[0.6rem] font-bold text-gray-400 uppercase">Order</th>
                                        <th className="px-4 py-3 text-left text-[0.6rem] font-bold text-gray-400 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-center text-[0.6rem] font-bold text-gray-400 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-center text-[0.6rem] font-bold text-gray-400 uppercase">Items</th>
                                        <th className="px-4 py-3 text-center text-[0.6rem] font-bold text-gray-400 uppercase">Status</th>
                                        <th className="px-4 py-3 text-right text-[0.6rem] font-bold text-gray-400 uppercase pr-6">Update</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredOrders.length === 0 ? (
                                            <tr><td colSpan="6" className="p-12 text-center text-gray-300 text-sm">No {orderFilter !== 'all' ? orderFilter : ''} orders</td></tr>
                                        ) : filteredOrders.map(o => (
                                            <tr key={o._id} className="hover:bg-gray-50/50">
                                                <td className="px-6 py-4">
                                                    <p className="text-xs font-bold text-gray-900">#{o._id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[0.55rem] text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-xs font-bold text-gray-900">{o.userId?.name || 'Guest'}</p>
                                                    <p className="text-[0.55rem] text-gray-400">{o.userId?.email || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-4 text-center"><span className="text-sm font-bold text-gray-900">Rs.{o.total?.toLocaleString()}</span></td>
                                                <td className="px-4 py-4 text-center"><span className="text-xs font-semibold text-gray-500">{o.items?.length}</span></td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`text-[0.6rem] font-bold uppercase px-2.5 py-1 rounded-full ${o.status === 'pending' ? 'bg-amber-50 text-amber-600' : o.status === 'confirmed' ? 'bg-blue-50 text-blue-600' : o.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{o.status}</span>
                                                </td>
                                                <td className="px-4 py-4 text-right pr-6">
                                                    <select value={o.status} onChange={e => handleStatusUpdate(o._id, e.target.value)}
                                                        className="bg-gray-50 border border-gray-100 text-[0.65rem] font-semibold py-1.5 px-2.5 rounded-lg cursor-pointer outline-none">
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ============ SUPPORT TAB ============ */}
                    {activeTab === 'support' && (
                        <div className="max-w-2xl">
                            <h1 className="text-xl font-black text-gray-900 mb-1">Help & Support</h1>
                            <p className="text-sm text-gray-400 mb-6">Get help with managing your store</p>
                            <div className="space-y-4">
                                {[
                                    { q: 'How do I add a new product?', a: 'Go to the Products tab, fill in the form on the left with product details, upload an image, and click "Add Product".' },
                                    { q: 'How do I manage orders?', a: 'Go to the Orders tab. You can filter orders by status and update their status using the dropdown on each row.' },
                                    { q: 'How do I update a product?', a: 'Click the edit (pencil) icon on any product in the Products tab. The form will populate with the product details for editing.' },
                                    { q: 'How do I delete a product?', a: 'Click the trash icon on any product in the Products tab. Confirm the deletion in the dialog that appears.' },
                                    { q: 'How do I contact support?', a: 'Email us at support@cartify.pk or reach out via our social media channels.' },
                                ].map((item, i) => (
                                    <details key={i} className="bg-white rounded-2xl border border-gray-100 group">
                                        <summary className="px-6 py-4 cursor-pointer text-sm font-bold text-gray-900 list-none flex justify-between items-center">
                                            {item.q}
                                            <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </summary>
                                        <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</div>
                                    </details>
                                ))}
                            </div>
                            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Us</h3>
                                <div className="flex gap-3">
                                    <a href="mailto:support@cartify.pk" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 no-underline hover:bg-gray-100 transition-all">📧 Email</a>
                                    <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 no-underline hover:bg-gray-100 transition-all">💬 Live Chat</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function EditIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L181.31,120ZM192.63,108.68,147.31,63.37,160,50.68,205.31,96Z"></path></svg>
}
function TrashIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path></svg>
}

export default Admin

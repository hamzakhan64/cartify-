import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import { getProducts } from '../services/productService'

const categoryList = [
  { name: 'Smart Watches', img: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?auto=format&fit=crop&q=80&w=300&h=300', link: '/products?category=Smart Watches' },
  { name: 'Earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=300&h=300', link: '/products?category=Airpods' },
  { name: 'Headphones', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=300&h=300', link: '/products?category=Headphones' },
  { name: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300&h=300', link: '/products?category=Shoes' },
]

const promises = [
  { icon: '👍', title: 'No Questions Asked Returns', sub: 'Full refund, no hassle' },
  { icon: '📦', title: 'Easy 7 Days Replacement', sub: 'Quick swap guarantee' },
  { icon: '🚚', title: 'FREE Shipping', sub: 'On all orders nationwide' },
  { icon: '✅', title: 'Easy Warranty Claim', sub: 'Hassle-free process' },
]

const faqs = [
  { q: 'What payment methods do you accept?', a: 'We currently accept Cash on Delivery (COD) across Pakistan. More payment options coming soon!' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days within major cities and 5-7 business days for other areas.' },
  { q: 'Do you offer warranty on products?', a: 'Yes! All our products come with a 1-year warranty. We also offer easy 7-day replacement for defective items.' },
  { q: 'Can I return or exchange a product?', a: 'Absolutely. We have a no-questions-asked return policy. Simply contact us within 7 days of delivery.' },
  { q: 'Are all products original?', a: 'Yes, we source all products from authorized distributors and guarantee 100% authenticity.' },
  { q: 'Do you ship nationwide?', a: 'Yes! We deliver to all cities and towns across Pakistan with FREE shipping on all orders.' },
]

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [heroIdx, setHeroIdx] = useState(0)
  const [heroSlides, setHeroSlides] = useState([])

  useEffect(() => {
    async function fetch() {
      try {
        const d = await getProducts()
        setProducts(d)
        // Build hero from actual products
        if (d.length > 0) {
          const slides = []
          const cats = ['Smart Watches', 'Headphones', 'Airpods', 'Shoes']
          cats.forEach(cat => {
            const p = d.find(item => item.category === cat)
            if (p) {
              const orig = Math.round(p.price * 1.45)
              const disc = Math.round((1 - p.price / orig) * 100)
              slides.push({ title: p.title, sub: p.description, img: p.image, price: p.price, originalPrice: orig, discount: disc, cta: `/products?category=${encodeURIComponent(cat)}` })
            }
          })
          if (slides.length === 0) {
            d.slice(0, 3).forEach(p => {
              const orig = Math.round(p.price * 1.45)
              slides.push({ title: p.title, sub: p.description, img: p.image, price: p.price, originalPrice: orig, discount: Math.round((1 - p.price / orig) * 100), cta: '/products' })
            })
          }
          setHeroSlides(slides)
        }
      } catch { console.error('Failed to fetch') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (heroSlides.length === 0) return
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroSlides.length), 5000)
    return () => clearInterval(t)
  }, [heroSlides])

  const exclusiveOffers = products.slice(0, 8)
  const bestSellers = [...products].reverse().slice(0, 8)
  const justLaunched = products.slice(2, 10)
  const hero = heroSlides[heroIdx] || { title: 'Welcome to Cartify', sub: 'Premium Tech Accessories', img: '', price: 0, originalPrice: 0, discount: 0, cta: '/products' }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      {/* ====== HERO CAROUSEL ====== */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 flex flex-col md:flex-row items-center gap-6 md:gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-red-400 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3">🔥 New Collection 2026</p>
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight mb-3 sm:mb-4 transition-all duration-500">
              {hero.title}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-5 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed line-clamp-2">
              {hero.sub}
            </p>
            {hero.price > 0 && (
              <div className="flex items-center gap-3 justify-center md:justify-start mb-5">
                <span className="text-white text-xl sm:text-2xl font-black">Rs.{hero.price.toLocaleString()}</span>
                <span className="text-gray-500 line-through text-sm">Rs.{hero.originalPrice.toLocaleString()}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{hero.discount}% OFF</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/products" className="bg-white text-black no-underline px-6 sm:px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-lg">
                Shop Now
              </Link>
              <Link to={hero.cta} className="border border-white/30 text-white no-underline px-6 sm:px-8 py-3 rounded-full font-bold text-sm hover:bg-white/10 transition-all">
                Explore →
              </Link>
            </div>
            {heroSlides.length > 1 && (
              <div className="flex gap-2 mt-6 justify-center md:justify-start">
                {heroSlides.map((_, i) => (
                  <button key={i} onClick={() => setHeroIdx(i)}
                    className={`h-2 rounded-full transition-all border-none cursor-pointer ${i === heroIdx ? 'bg-white w-6' : 'bg-white/30 w-2'}`} />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            {hero.img ? (
              <img src={hero.img} alt={hero.title}
                className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] object-contain rounded-3xl transition-all duration-500 drop-shadow-2xl"
                onError={(e) => { e.target.src = 'https://placehold.co/300/222/fff?text=Cartify' }} />
            ) : (
              <div className="w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] bg-gray-800 rounded-3xl flex items-center justify-center">
                <span className="text-gray-500 text-4xl font-black">C</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
      </section>

      {/* ====== CATEGORIES ====== */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {categoryList.map((c, i) => {
              const matchedProduct = products.find(p => p.category === (c.name === 'Earbuds' ? 'Airpods' : c.name))
              const displayImg = matchedProduct?.image || c.img
              return (
                <Link key={i} to={c.link} className="no-underline text-center group">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-100 transition-all duration-300 group-hover:border-red-400 group-hover:shadow-lg mx-auto mb-2 sm:mb-3 bg-[#F3F3F3]">
                    <img src={displayImg} alt={c.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://placehold.co/120/f3f3f3/999?text=' + c.name[0] }} />
                  </div>
                  <p className="text-[0.65rem] sm:text-xs font-bold text-gray-700 group-hover:text-red-500 transition-colors">{c.name}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== EXCLUSIVE OFFERS ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Exclusive Offers</h2>
            <Link to="/products" className="text-gray-500 font-semibold text-xs sm:text-sm no-underline hover:text-red-500 transition-colors">View all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
            {loading
              ? [1, 2, 3, 4].map(i => <div key={i} className="min-w-[240px] sm:min-w-0 h-[360px] sm:h-[400px] bg-gray-50 animate-pulse rounded-2xl snap-start" />)
              : exclusiveOffers.slice(0, 4).map(p => (
                <div key={p._id} className="min-w-[240px] sm:min-w-0 snap-start"><ProductCard {...p} /></div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ====== PROMO BANNER ====== */}
      <section className="mx-4 sm:mx-6 my-4">
        <div className="max-w-[1320px] mx-auto bg-gradient-to-r from-gray-900 to-black rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 p-8 sm:p-10 md:p-14">
              <p className="text-red-400 font-bold text-xs uppercase tracking-widest mb-3">Limited Time Offer</p>
              <h3 className="text-white text-2xl sm:text-3xl font-black mb-3 leading-tight">Up to 75% OFF<br />on Best Sellers</h3>
              <p className="text-gray-400 mb-5 text-sm max-w-md">Premium quality at unbeatable prices. Don't miss out!</p>
              <Link to="/products" className="inline-block bg-white text-black px-6 sm:px-8 py-3 rounded-full font-bold text-sm no-underline hover:bg-gray-100 transition-all">Shop Now</Link>
            </div>
            <div className="flex-1 flex justify-center p-6 sm:p-8">
              {products[1] && <img src={products[1].image} alt={products[1].title} className="w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />}
            </div>
          </div>
        </div>
      </section>

      {/* ====== BEST SELLERS ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Best Sellers</h2>
            <Link to="/products" className="text-gray-500 font-semibold text-xs sm:text-sm no-underline hover:text-red-500 transition-colors">View all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
            {loading
              ? [1, 2, 3, 4].map(i => <div key={i} className="min-w-[240px] sm:min-w-0 h-[360px] sm:h-[400px] bg-gray-50 animate-pulse rounded-2xl snap-start" />)
              : bestSellers.slice(0, 4).map(p => (
                <div key={p._id} className="min-w-[240px] sm:min-w-0 snap-start"><ProductCard {...p} /></div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ====== JUST LAUNCHED ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Just Launched 🚀</h2>
            <Link to="/products" className="text-gray-500 font-semibold text-xs sm:text-sm no-underline hover:text-red-500 transition-colors">View all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
            {loading
              ? [1, 2, 3, 4].map(i => <div key={i} className="min-w-[240px] sm:min-w-0 h-[360px] sm:h-[400px] bg-gray-100 animate-pulse rounded-2xl snap-start" />)
              : justLaunched.slice(0, 4).map(p => (
                <div key={p._id} className="min-w-[240px] sm:min-w-0 snap-start"><ProductCard {...p} /></div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ====== CARTIFY'S PROMISE ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-[1320px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8">Cartify's Promise</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {promises.map((p, i) => (
              <div key={i} className="bg-[#F3F3F3] rounded-2xl p-5 sm:p-7 flex flex-col items-start">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-xl sm:text-3xl mb-4 sm:mb-5 shadow-sm">{p.icon}</div>
                <h3 className="text-xs sm:text-sm font-black text-gray-900 mb-1 leading-snug">{p.title}</h3>
                <p className="text-[0.6rem] sm:text-xs text-gray-500 mb-3">{p.sub}</p>
                <Link to="/products" className="inline-block bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.6rem] sm:text-xs font-bold no-underline hover:bg-gray-800 transition-all">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CARTIFY REVOLUTION ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-5">
            Cartify — A technological Lifestyle revolution is on the horizon
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>Everything revolutionary has begun from Zero. From the singularity to the big bang, and from the earth to the greatest feat of the human race — The wheel, everything has conceived its shape from the pursuit of innovation. The Lifestyle revolution is here — And it is starting from Cartify all over again!</p>
            <p>Cartify is not just a tech brand, not just a marketplace for smart watches or tech products, but rather the harbinger of a new age of reformation. Every Cartify product is curated with the intent of revolutionizing life as we know it, blending cutting-edge technology with everyday convenience.</p>
            <p>At Cartify, we're committed to offering you the Best Smart Watches, Premium Earbuds, Studio-Quality Headphones, and more — the perfect blend of style and technology, right at your fingertips. Our diverse selection stands as a testament to our dedication in providing superior quality and innovative features at a price that doesn't break the bank.</p>
          </div>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="py-8 sm:py-14 px-4 sm:px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white rounded-2xl border border-gray-100 group">
                <summary className="px-5 sm:px-6 py-4 cursor-pointer text-sm font-bold text-gray-900 list-none flex justify-between items-center gap-4">
                  {f.q}
                  <svg className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-5 sm:px-6 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home

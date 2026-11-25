import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products as fallbackProducts, categories as fallbackCategories } from '../data/products'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const sizes = ['35', '36', '37', '38', '39', '40', '41', '42']
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price (Low–High)' },
  { value: 'price-high', label: 'Price (High–Low)' },
]

export default function ShopPage() {
  const { addToCart } = useCart()
  const [addedId, setAddedId] = useState(null)
  const [productList, setProductList] = useState(fallbackProducts)
  const [categoryList, setCategoryList] = useState(fallbackCategories)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const pageRef = useRef(null)

  // Fetch products and categories from backend
  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setIsLoading(true)
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ])
        if (isMounted) {
          if (fetchedProducts && fetchedProducts.length > 0) {
            setProductList(fetchedProducts)
          }
          if (fetchedCategories && fetchedCategories.length > 0) {
            setCategoryList(fetchedCategories)
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [])

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const filtered = productList
    .filter((p) => {
      const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(p.category)
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return a.id - b.id
    })

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    const els = pageRef.current?.querySelectorAll('.reveal-up') || []
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [filtered])

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24 flex flex-col md:flex-row gap-6">
        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="hidden md:block w-64 flex-shrink-0 pr-8 border-r border-outline-variant/30 sticky top-[88px] h-[calc(100vh-88px)] overflow-y-auto no-scrollbar">
          <div className="mb-10">
            <h1 className="font-headline-md text-headline-md text-primary mb-2">Shop All</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Discover the complete ETERNA collection.
            </p>
          </div>

          <div className="space-y-8">
            {/* Category */}
            <div>
              <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase border-b border-outline-variant/30 pb-2">
                Category
              </h3>
              <ul className="space-y-3">
                {categoryList.map((cat) => (
                  <li key={cat}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                        {cat}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Size */}
            <div>
              <h3 className="font-label-caps text-label-caps text-primary mb-4 uppercase border-b border-outline-variant/30 pb-2">
                Size (EU)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`border text-center py-2 font-label-caps text-label-caps transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-primary text-on-primary border-primary'
                        : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────── */}
        <section className="flex-grow flex flex-col">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Mobile header */}
            <div className="w-full md:hidden flex justify-between items-center">
              <h1 className="font-headline-sm text-headline-sm text-primary">Shop All</h1>
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center gap-2 font-label-caps text-label-caps border border-outline-variant px-4 py-2 hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-sm">tune</span>
                <span>Filters</span>
              </button>
            </div>

            {/* Search */}
            <div className="w-full md:flex-grow md:max-w-md relative">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant pb-2 pl-8 font-body-md text-body-md focus:outline-none focus:border-primary transition-colors placeholder:italic placeholder:text-on-surface-variant/70"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant hidden md:inline-block">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-outline-variant pb-2 font-body-md text-body-md focus:outline-none focus:border-primary cursor-pointer appearance-none pr-6"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filters panel */}
          {mobileFiltersOpen && (
            <div className="md:hidden mb-8 p-5 bg-surface-container-lowest border border-outline-variant/30">
              <h3 className="font-label-caps text-label-caps text-primary mb-4">Category</h3>
              <div className="space-y-3 mb-6">
                {categoryList.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant">{cat}</span>
                  </label>
                ))}
              </div>
              <h3 className="font-label-caps text-label-caps text-primary mb-4">Size (EU)</h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSize(s)}
                    className={`border text-center py-2 font-label-caps text-label-caps transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-primary text-on-primary border-primary'
                        : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Count */}
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-8">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">search_off</span>
              <p className="font-headline-sm text-headline-sm text-primary mb-2">No products found</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 w-full">
              {filtered.map((product, i) => (
                <div
                  key={product.id}
                  className="group flex flex-col reveal-up"
                  style={{ transitionDelay: `${(i % 9) * 60}ms` }}
                >
                  <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden mb-4">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container">
                        <span className="material-symbols-outlined text-4xl text-outline">image</span>
                      </div>
                    )}
                    <button className="absolute top-4 right-4 z-10 text-on-surface-variant hover:text-primary transition-colors bg-surface/60 rounded-full p-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                    </button>
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                      <button
                        onClick={() => {
                          addToCart(product, '38', product.colors?.[0] || '')
                          setAddedId(product.id)
                          setTimeout(() => setAddedId(null), 1800)
                        }}
                        className="bg-primary text-on-primary font-label-caps text-label-caps py-3 px-8 w-full hover:opacity-90 transition-opacity"
                      >
                        {addedId === product.id ? '✓ Added to Bag' : 'Quick Add'}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-body-md text-body-md text-primary hover:opacity-70 transition-opacity">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">{product.material}</p>
                    <p className="font-body-md text-body-md text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                    {product.colors && (
                      <div className="flex items-center gap-2 mt-1">
                        {product.colors.map((c, ci) => (
                          <span
                            key={ci}
                            className="w-3 h-3 rounded-full border border-outline-variant"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

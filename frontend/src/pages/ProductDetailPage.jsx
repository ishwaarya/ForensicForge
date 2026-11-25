import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products as fallbackProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const sizes = ['35', '36', '37', '38', '39', '40', '41', '42']

const accordions = [
  {
    title: 'Description',
    content: (p) =>
      `A timeless silhouette reimagined for the modern aesthetic. The ${p.name} demands attention with its flawless finish and architectural heel. Perfect for evening affairs or elevating a sharply tailored ensemble. Handcrafted by master artisans using premium Italian leathers.`,
  },
  {
    title: 'Details & Materials',
    content: (p) => (
      <ul className="list-disc pl-5 space-y-2 font-body-md text-body-md text-on-surface-variant">
        <li>Upper: 100% Premium {p.material}</li>
        <li>Lining: 100% Goatskin Leather</li>
        <li>Sole: 100% Leather</li>
        <li>Heel Height: {p.heel}</li>
        <li>SKU: {p.sku}</li>
        <li>Made in Italy</li>
      </ul>
    ),
  },
  {
    title: 'Fit Information',
    content: () =>
      'Runs true to size. If you are between sizes, we recommend taking a half size up. The narrow toe box may require a short breaking-in period.',
  },
  {
    title: 'Shipping & Returns',
    content: () =>
      'Complimentary standard shipping on all orders over ₹15,000. Express shipping options available at checkout. Returns accepted within 14 days of delivery in pristine, unworn condition with original packaging.',
  },
]

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(() => {
    return fallbackProducts.find((p) => p.slug === slug) || fallbackProducts[0]
  })
  const [allProducts, setAllProducts] = useState(fallbackProducts)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [activeAccordion, setActiveAccordion] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    let isMounted = true
    api.getProductBySlug(slug).then((p) => {
      if (isMounted && p) {
        setProduct(p)
        setSelectedColor(p.colors?.[0] || null)
      }
    })
    api.getProducts().then((list) => {
      if (isMounted && list && list.length > 0) {
        setAllProducts(list)
      }
    })
    return () => { isMounted = false }
  }, [slug])

  const related = allProducts.filter((p) => p.category === product?.category && p.slug !== slug).slice(0, 4)

  const handleAddToCart = () => {
    if (!selectedSize) return
    addToCart(product, selectedSize, selectedColor)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="font-headline-md text-headline-md text-primary mb-4">Product not found</p>
            <Link to="/shop" className="btn-primary">Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* ── Gallery ──────────────────────────── */}
          <div className="w-full lg:w-3/5 lg:sticky lg:top-28 h-fit">
            <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container">
                  <span className="material-symbols-outlined text-6xl text-outline">image</span>
                </div>
              )}
              {/* Nav arrows */}
              <div className="absolute inset-y-0 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white/80 p-2 rounded-full shadow hover:bg-white text-primary">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white/80 p-2 rounded-full shadow hover:bg-white text-primary">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Details ──────────────────────────── */}
          <div className="w-full lg:w-2/5 flex flex-col">
            {/* Title + Rating */}
            <div className="mb-8 border-b border-outline-variant/30 pb-8">
              <h1 className="font-headline-md text-headline-md text-primary mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <span key={s} className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
                <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>star_half</span>
                <span className="font-body-md text-sm text-on-surface-variant ml-1">4.8 (124 Reviews)</span>
              </div>
              <p className="font-body-lg text-body-lg text-primary mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {product.material} — heel height {product.heel}. Meticulously crafted for enduring elegance.
              </p>
            </div>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <p className="font-label-caps text-label-caps mb-4">
                  Colour: <span className="font-body-md ml-2 normal-case">{product.material}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === c
                          ? 'ring-2 ring-offset-2 ring-primary border-primary'
                          : 'border-outline-variant hover:border-primary'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select colour ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <p className="font-label-caps text-label-caps">Select Size (EU)</p>
                <button className="font-label-caps text-label-caps text-on-surface-variant underline hover:text-primary transition-colors">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 border text-center font-body-md transition-all ${
                      selectedSize === s
                        ? 'border-primary bg-surface-container-high text-primary'
                        : 'border-outline-variant hover:border-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="mt-3 text-sm text-on-surface-variant font-body-md italic">Please select a size</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full font-label-caps text-label-caps py-4 transition-all duration-300 ${
                  !selectedSize
                    ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed'
                    : addedToCart
                    ? 'bg-on-surface text-surface'
                    : 'bg-primary text-on-primary hover:opacity-90'
                }`}
              >
                {addedToCart ? '✓ Added to Bag' : 'Add to Bag'}
              </button>
              <div className="flex gap-4">
                <Link
                  to="/checkout"
                  className="flex-grow font-label-caps text-label-caps text-primary py-4 border-b border-primary text-center hover:bg-surface-container-low transition-colors"
                >
                  Buy Now
                </Link>
                <button className="w-14 border-b border-primary flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite_border</span>
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-outline-variant/30">
              {accordions.map((acc, i) => (
                <div key={acc.title} className="border-b border-outline-variant/30">
                  <button
                    className="w-full py-5 flex justify-between items-center text-left group"
                    onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  >
                    <span className="font-label-caps text-label-caps group-hover:text-on-surface-variant">{acc.title}</span>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${
                        activeAccordion === i ? 'rotate-45' : ''
                      }`}
                    >
                      add
                    </span>
                  </button>
                  {activeAccordion === i && (
                    <div className="pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {typeof acc.content(product) === 'string' ? acc.content(product) : acc.content(product)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-outline-variant/30 my-[120px]" />

        {/* You May Also Like */}
        <section>
          <h2 className="font-headline-md text-headline-md text-center text-primary mb-12">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                <div className="aspect-[3/4] mb-4 bg-surface-container-low overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container">
                      <span className="material-symbols-outlined text-3xl text-outline">image</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-body-md text-body-md text-primary mb-1 group-hover:opacity-70 transition-opacity">{p.name}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant">₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

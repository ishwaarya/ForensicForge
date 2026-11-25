import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { products as fallbackProducts } from '../data/products'
import api from '../services/api'

const HERO_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm8eahqRF6AHonZwuiPUabEQP-Qbve1LLgP_dlASz-CEeCxMaRR2zHQr_hSyFDkwGzHPN8Je8tcqoA9Y8gtR4rJnMF27EnJmfTyWP13Cc25o-tSD1DqPrY8MRtrXB9yGvKkOs5eqVBcCFmE-iJjk_y-lM9RCgkQvcFLJhntsmpxGJ_3A4yIUujpIx0Wp5nJkmqof_-dTqR5p0wjvAv5plAYCzblprTfHBsSTGBpMFUx7z1fRqx-u0'

const categories = [
  { label: 'Stiletto Heels', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGYaSzfBRQ2u1X-v3Qcpi1nf7_e_RcQXluw3TMQ_EpDUzDtsl62xLVl-nBUeI4Z9BzNv6iyUW379sCI2KLaQ3MOkvTdIneMGZ8RSVW36plmFjL-bfBaXjQrkDf3a1tk9_rjMUYyKHZDlP0oaUCDzEkAjM141rsc352yOvXMEgPe8j5gdgsRShFIUB4xPcPuQAjL2BOtFghPhk0yQpkUC7l_zrNGKZyzgB49ZFlUSI3tdJhQwOj-yM' },
  { label: 'Block Heels', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2AUdkxBopspmiLYH-VS5FC4XIjdky8stHjLeOrbIHulx5weKjlGcn1grPhGwfbFi2zqh_bF3A9_0SH8Sr_q7w4oQFYpC_vZjPkklEb5_0-IcE2lAyIhqNfusFYemSPqJNvAjaZX41OolpM87z01nPuf2c1GQvTHVpLTZuB3rKwiClJiWNjjQdLkQNJ6DELVRDW3OvISvsFkiImhiBLClNU9wkr58XtAvqS3R8OBXw2948QMoDo40' },
  { label: 'Kitten Heels', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGlgB8J9BzrwvjNEyRmDieznDfgFxfHDEBBIKFyCIA-H0eibKkeqMOjp3irTiW1iZ8bdCeswLnYPzmUocvNunKoTluCRrkLncHH7pE23oJok6GiojYzKCJk27A4KNG09R9P5y00DhQrQsQO-sKoFfWdysAOnqqbIlrd2ZiQf6kPFZugWPmUZbCE3bf1BRLRIO81ygd2dWlT7oBbbt4sUcVTLDEnMfjnul04ivzYvRTM7MYT7OgJus' },
  { label: 'Platform Heels', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-gF2dWvsk1oNwbxthZl12tp7JzJro9G9uHJp55ORtLRWSrFxDwgEv_mz60ybLA0ZH-TfjGatma376CFvQLjWZ8JUwmA_sRHvWUxMhzOBVCzRg4RiSMzRBi6_Eu9WE5mBXPEVQCk9zzMKjZfy8RSsF--lbpbrxyPIFI80PF1kHy_v8eER7r1KjZULVkQohPlK_aJ_f9MCln1S70ocyZWN3BTYV0QLXMMpcCT3Dp9PQbjjnmAll8iw' },
]

const newArrivals = [
  { name: 'The Classic Stiletto', sub: 'Noir Leather', price: '₹12,500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh3M_qH3e2DAmeNxqWWs3Edcj4DqV-HYk6Oo90l9jnVSuf3g-AYu83pdiy0Vr5ZD2XrV7TpzyaqeVUJcO1Bc2fuO7v4bavk5WEcxyk-ZAB6hjoqNJZl3mg4jScU6NqQGftL1PDPGqJ9HWjS5-Omah44I2XURAxGEm6g-uz5SZedfczy8vrIubAMjNRF7EQ7f4_SCUybGt3qdo701STFHL1q3msVrmm1FtkwksWE5AzzFCP3969buw', slug: 'aurelia-stiletto' },
  { name: 'The Evening Sandal', sub: 'Champagne Satin', price: '₹14,200', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw-m78uECS15sClyVFTLGvWuNOr3VrrNcB-HpJgpxaTz67GLmtJhHoUcgxARjaHJsKk0qYacwQQExSLwI10h0x_n_vWXmlKhd4Ov1Wtnk2kbhi_yqMDUuZ8OuYtr4rwZWGYw2TeBIBtzZpPppHjypKC6v4dba1Eu4tXx9p7ja_fdF08AqB4tFGT66T-gws9MLEBZGtPSdA9xY3KXCAxlsPKv5i2VFHr7eM8aLyyp7s50U4NFNx_0E', slug: 'celeste-pump' },
  { name: 'The Architectural Pump', sub: 'Nude Suede', price: '₹11,800', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrGG4AccZZvEb4kb6mVdKP-DxYfdfA4yd6TAs85KFEU7qOF86IxdVvdRaHxoHRwqPqSOcVHhKzqfcknqKTJMGB-WCNflc1KNQicuPmUosEtzEcyzZXzuB2qEMs2gR9ufmN3GpWpFzb8uAiHw_R9ozw0G18v4hx9IchfAE080uJ_MzblJ3PrMTnA4EC_r5I-RaMQMMOQdeTWydJL_6z2rt8vifTSBfbFjyI-gphsc8VTYMh4BbVYDs', slug: 'elan-slingback' },
]

function useRevealOnScroll(ref) {
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
      { threshold: 0.1 }
    )
    const elements = ref.current?.querySelectorAll('.reveal-up') || []
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

export default function HomePage() {
  const pageRef = useRef(null)
  useRevealOnScroll(pageRef)
  const { addToCart } = useCart()
  const [addedSlug, setAddedSlug] = useState(null)
  const [allProducts, setAllProducts] = useState(fallbackProducts)

  useEffect(() => {
    let isMounted = true
    api.getProducts().then((res) => {
      if (isMounted && res && res.length > 0) {
        setAllProducts(res)
      }
    })
    return () => { isMounted = false }
  }, [])

  const handleQuickAdd = (slug) => {
    const item = allProducts.find((p) => p.slug === slug) || fallbackProducts.find((p) => p.slug === slug)
    if (item) {
      addToCart(item, '38', item.colors?.[0] || '')
      setAddedSlug(slug)
      setTimeout(() => setAddedSlug(null), 1800)
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center bg-no-repeat w-full h-full"
              style={{ backgroundImage: `url('${HERO_IMG}')` }}
            />
            <div className="absolute inset-0 bg-surface/20 mix-blend-multiply" />
          </div>
          <div className="relative z-10 text-center px-5 max-w-4xl mx-auto flex flex-col items-center reveal-up">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4 tracking-widest uppercase">
              ETERNA
            </h1>
            <p className="font-headline-sm text-headline-sm text-primary mb-6 italic">Timeless by Design.</p>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
              Refined silhouettes designed to become part of your signature.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/shop" className="btn-primary">Shop Heels</Link>
              <Link to="/collections" className="btn-secondary">Explore Collection</Link>
            </div>
          </div>
        </section>

        {/* ── Brand Statement ───────────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto text-center reveal-up">
            <h2 className="font-headline-md text-headline-md text-primary mb-8 uppercase tracking-wide">
              ETERNA <br />
              <span className="italic font-light">Timeless by Design</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              We believe in the enduring power of quiet luxury. Every pair is meticulously crafted to balance timeless design
              with modern femininity. ETERNA is not just about footwear; it's about stepping into your own confidence with
              effortless grace.
            </p>
          </div>
        </section>

        {/* ── Featured Categories ───────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20">
          <h2 className="font-headline-md text-headline-md text-primary mb-12 text-center uppercase tracking-wider reveal-up">
            Curated Silhouettes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-[1440px] mx-auto">
            {categories.map((cat, i) => (
              <Link
                key={cat.label}
                to="/shop"
                className="group block relative overflow-hidden aspect-[3/4] reveal-up"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div
                  className="bg-cover bg-center w-full h-full absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-6 left-6 right-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span className="font-label-caps text-label-caps text-on-primary border-b border-on-primary pb-1 inline-block">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center reveal-up">
            <Link to="/shop" className="btn-secondary">View All Silhouettes</Link>
          </div>
        </section>

        {/* ── New Arrivals ──────────────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal-up">
              <div className="max-w-xl">
                <h2 className="font-headline-md text-headline-md text-primary mb-4 uppercase tracking-wide">New Arrivals</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Discover the latest expressions of ETERNA.</p>
              </div>
              <Link to="/shop" className="btn-secondary hidden md:inline-block">Shop the Collection</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((product, i) => (
                <div key={product.name} className="group flex flex-col reveal-up" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="relative aspect-[4/5] mb-4 bg-surface-container overflow-hidden">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <button className="absolute top-4 right-4 text-outline hover:text-primary transition-colors z-10 bg-surface/50 rounded-full p-2 backdrop-blur-sm">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 flex justify-center">
                      <button
                        onClick={() => handleQuickAdd(product.slug)}
                        className="bg-primary/90 text-on-primary font-label-caps text-label-caps px-8 py-3 w-full hover:bg-primary transition-colors backdrop-blur-sm"
                      >
                        {addedSlug === product.slug ? '✓ Added to Bag' : 'Quick Add'}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-body-md text-body-md text-primary mb-1 hover:opacity-70 transition-opacity">{product.name}</h3>
                    </Link>
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{product.sub}</p>
                    <p className="font-body-md text-body-md text-primary">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center md:hidden reveal-up">
              <Link to="/shop" className="btn-secondary">Shop the Collection</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

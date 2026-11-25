import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const collections = [
  {
    title: 'The Noir Edit',
    subtitle: 'Power. Precision. Obsidian.',
    description: 'Unapologetically bold. Crafted for the woman who commands every room.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiJM0YunEmsGU6pbFqbL32CZ2hw_Uud5yRbu9TQQRQpPYkgLgsXRVCPXtfGxHbrf95h8fpeamzoUg2U7-GvgOyONQR7aneUtoR7_X7MYJAjiZc1MjZjBdCzLpaB0AwZyR5FArkpW9IsLUIlFdw3CIrpztPAv3CtLmSg5JmoVbMNJ9qJ2UlnvAbyLemEb6KQXeWL-fgZW9VX7T3dgKS6sYQGlGLhGmiHn712zA1OuPX9m-kgrhvSlY',
    count: '8 pieces',
    accent: '#1a1a1a',
  },
  {
    title: 'Champagne & Ivory',
    subtitle: 'Bridal & Evening',
    description: 'Ethereal silhouettes for your most unforgettable moments. Satin, lace, and shimmer.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw-m78uECS15sClyVFTLGvWuNOr3VrrNcB-HpJgpxaTz67GLmtJhHoUcgxARjaHJsKk0qYacwQQExSLwI10h0x_n_vWXmlKhd4Ov1Wtnk2kbhi_yqMDUuZ8OuYtr4rwZWGYw2TeBIBtzZpPppHjypKC6v4dba1Eu4tXx9p7ja_fdF08AqB4tFGT66T-gws9MLEBZGtPSdA9xY3KXCAxlsPKv5i2VFHr7eM8aLyyp7s50U4NFNx_0E',
    count: '6 pieces',
    accent: '#e8d5a3',
  },
  {
    title: 'The Nude Palette',
    subtitle: 'Effortless Refinement',
    description: 'Versatile neutrals that blend seamlessly into every wardrobe, elevated by masterful craftsmanship.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXHahU5JNjhrQMGTJ8TkR2dLsOo1RBMJUgO8wdh6SuneCh1Lqb0Iw64tUz-k-kBgmvQFi5lnlmRfYPRbpbcLJTNi7Ou70WTDK3rlrVD_U4ZZiUVkCHkWqetPdDRN69SDqLHtzoZ1lJ6_dlsJG6G9z0k07OsyDEBoDfxHX91HS_M0-tH2yYZRKjqFQ-fVRK72jAfItAnvJNQ051h-fJ0_030kIyUArbQqE11LIMglN6wAnGU8cieZI',
    count: '7 pieces',
    accent: '#d4b896',
  },
  {
    title: 'Golden Hour',
    subtitle: 'Metallics & Statement',
    description: 'Catch every light. Warm metallic leathers and embellished heels for those who dare to shimmer.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2sGbRPBNr2NPC08vr3o_Ft_s9Pww91VQb5a3m97fzHAM1x3tSsLOPUTxJWcjMg0bbT_lnosjQLa8zd4cYY5kfaAPWl2vB8Dc9OD-LAR--cMVCZlujg0MihoRTR9TZAke-v4hf6HihRSVqm_yOqOIexORMZyjr4hys1eitukU5ak07aoRtNilApEfdfwT33kUH9qaZlcCFWO7sZdZPVKqItKPlQPvflfAWZ19Ek8jk74ET7EBUd8',
    count: '5 pieces',
    accent: '#c5a028',
  },
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
    const els = ref.current?.querySelectorAll('.reveal-up') || []
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

export default function CollectionsPage() {
  const pageRef = useRef(null)
  useRevealOnScroll(pageRef)

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 text-center bg-surface-container-lowest">
          <div className="max-w-3xl mx-auto reveal-up">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">
              ETERNA COLLECTIONS
            </p>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
              The Atelier
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Each collection is a world unto itself — a mood, an era, a quiet declaration of taste.
            </p>
          </div>
        </section>

        {/* ── Collections ──────────────────────── */}
        <section className="py-[120px] px-5 md:px-20">
          <div className="max-w-[1440px] mx-auto space-y-24">
            {collections.map((col, i) => (
              <div
                key={col.title}
                className={`flex flex-col ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-12 items-center reveal-up`}
              >
                {/* Image */}
                <div className="w-full md:w-3/5 relative overflow-hidden group aspect-[4/3]">
                  <img
                    src={col.img}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 left-6">
                    <span
                      className="font-label-caps text-label-caps text-on-primary bg-primary/80 px-3 py-1 backdrop-blur-sm"
                    >
                      {col.count}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-2/5 flex flex-col justify-center">
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">
                    {col.subtitle}
                  </p>
                  <h2 className="font-headline-md text-headline-md text-primary mb-6">{col.title}</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">
                    {col.description}
                  </p>
                  <Link to="/shop" className="btn-secondary self-start">
                    Explore Collection
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-lowest text-center reveal-up">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">Can't decide?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Browse the complete ETERNA catalogue to discover your perfect pair.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop All Styles
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

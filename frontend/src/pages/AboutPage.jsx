import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STORY_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw-m78uECS15sClyVFTLGvWuNOr3VrrNcB-HpJgpxaTz67GLmtJhHoUcgxARjaHJsKk0qYacwQQExSLwI10h0x_n_vWXmlKhd4Ov1Wtnk2kbhi_yqMDUuZ8OuYtr4rwZWGYw2TeBIBtzZpPppHjypKC6v4dba1Eu4tXx9p7ja_fdF08AqB4tFGT66T-gws9MLEBZGtPSdA9xY3KXCAxlsPKv5i2VFHr7eM8aLyyp7s50U4NFNx_0E'
const CRAFT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiJM0YunEmsGU6pbFqbL32CZ2hw_Uud5yRbu9TQQRQpPYkgLgsXRVCPXtfGxHbrf95h8fpeamzoUg2U7-GvgOyONQR7aneUtoR7_X7MYJAjiZc1MjZjBdCzLpaB0AwZyR5FArkpW9IsLUIlFdw3CIrpztPAv3CtLmSg5JmoVbMNJ9qJ2UlnvAbyLemEb6KQXeWL-fgZW9VX7T3dgKS6sYQGlGLhGmiHn712zA1OuPX9m-kgrhvSlY'

const values = [
  {
    icon: 'diamond',
    title: 'Uncompromising Quality',
    desc: 'Every component is sourced from the finest tanneries in Italy and Spain. We accept nothing less than perfection.',
  },
  {
    icon: 'auto_stories',
    title: 'Timeless Design',
    desc: 'We reject the tyranny of trend. Our designs are built to transcend seasons and grow more beautiful with time.',
  },
  {
    icon: 'spa',
    title: 'Conscious Craft',
    desc: 'Sustainability is integral to who we are. From responsible sourcing to carbon-offset shipping, we tread lightly.',
  },
  {
    icon: 'people',
    title: 'For Every Woman',
    desc: 'ETERNA is an ethos: confidence, grace, and the quiet power of a woman who knows exactly who she is.',
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

export default function AboutPage() {
  const pageRef = useRef(null)
  useRevealOnScroll(pageRef)

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main>
        {/* ── Hero ─────────────────────────────── */}
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${STORY_IMG}')` }}
          />
          <div className="absolute inset-0 bg-primary/40" />
          <div className="relative z-10 text-center px-5 max-w-3xl mx-auto reveal-up">
            <p className="font-label-caps text-label-caps text-on-primary mb-4 tracking-widest">OUR STORY</p>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-primary mb-6">
              Born from a Love of Craft
            </h1>
          </div>
        </section>

        {/* ── Founding Story ───────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-lowest">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2 reveal-up">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={CRAFT_IMG}
                  alt="ETERNA craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 reveal-up">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-widest">
                SINCE 2018
              </p>
              <h2 className="font-headline-md text-headline-md text-primary mb-8">
                Rooted in Artisan Tradition
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                ETERNA was founded in Mumbai in 2018 with a single conviction: that Indian women deserve footwear of the highest global standard, crafted with the same reverence for materials and process found in the ateliers of Milan and Paris.
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                Our founder, Priya Mehta, spent a decade in the fashion capitals of Europe before returning home with a vision — to marry the heritage of Indian feminine elegance with the precision of European shoemaking.
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Every pair of ETERNA heels is handcrafted to order in our workshop in Agra, using premium leathers from Florence and hardware from the finest foundries in Germany.
              </p>
            </div>
          </div>
        </section>

        {/* ── Values ───────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-16 reveal-up">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">
                OUR VALUES
              </p>
              <h2 className="font-headline-md text-headline-md text-primary">What We Stand For</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className="flex flex-col items-start p-8 bg-surface-container-lowest reveal-up"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <span className="material-symbols-outlined text-3xl text-primary mb-6">{v.icon}</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-4">{v.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-primary text-on-primary">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center reveal-up">
            {[
              { num: '2018', label: 'Founded' },
              { num: '24+', label: 'Signature Styles' },
              { num: '12', label: 'Countries Shipped' },
              { num: '50K+', label: 'Happy Clients' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display-lg-mobile text-display-lg-mobile text-on-primary mb-2">{stat.num}</p>
                <p className="font-label-caps text-label-caps text-on-primary/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Team Quote ───────────────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-lowest">
          <div className="max-w-2xl mx-auto text-center reveal-up">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-8 block">format_quote</span>
            <blockquote className="font-headline-sm text-headline-sm text-primary italic mb-8 leading-relaxed">
              "We don't make shoes. We make the heel-click of a woman who has arrived — on her own terms, in her own time."
            </blockquote>
            <p className="font-label-caps text-label-caps text-on-surface-variant">
              — Priya Mehta, Founder &amp; Creative Director
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

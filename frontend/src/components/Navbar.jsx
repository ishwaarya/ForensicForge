import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LOGO_URL } from '../data/products'
import { useCart } from '../context/CartContext'

const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'New Arrivals', to: '/shop' },
  { label: 'Best Sellers', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Store Locator', to: '/stores' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const isActive = (to) => location.pathname === to

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-outline-variant/30 transition-all duration-500 ease-in-out ${
        scrolled ? 'bg-surface/90 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-5 md:px-20 py-6 w-full max-w-[1440px] mx-auto">

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-primary hover:opacity-70 transition-opacity duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>

        {/* Desktop Left Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`font-label-caps text-label-caps transition-colors duration-300 hover:opacity-70 ${
                isActive(link.to)
                  ? 'text-primary border-b border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={LOGO_URL}
            alt="ETERNA Logo"
            className="h-8 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity duration-300"
          />
        </Link>

        {/* Desktop Right Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.slice(3).map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`font-label-caps text-label-caps transition-colors duration-300 hover:opacity-70 ${
                isActive(link.to)
                  ? 'text-primary border-b border-primary pb-0.5'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-primary hover:opacity-70 transition-opacity duration-300" aria-label="Search">
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link to="/account" className="hidden md:block text-primary hover:opacity-70 transition-opacity duration-300" aria-label="Account">
            <span className="material-symbols-outlined">person</span>
          </Link>
          <button className="hidden md:block text-primary hover:opacity-70 transition-opacity duration-300" aria-label="Wishlist">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <Link to="/cart" className="text-primary hover:opacity-70 transition-opacity duration-300 relative" aria-label="Cart">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-label-caps leading-none">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-outline-variant/30 px-5 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`font-label-caps text-label-caps ${
                isActive(link.to) ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-outline-variant/30" />
          <Link to="/account" className="font-label-caps text-label-caps text-on-surface-variant">Account</Link>
        </div>
      )}
    </header>
  )
}

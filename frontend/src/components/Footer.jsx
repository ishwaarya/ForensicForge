import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setFeedback('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      const res = await api.subscribeNewsletter(email)
      setStatus('success')
      setFeedback(res.message || 'Thank you for subscribing to The Atelier.')
      setEmail('')
    } catch (err) {
      console.warn('Newsletter subscription error:', err)
      setStatus('success')
      setFeedback('Thank you for subscribing to The Atelier.')
      setEmail('')
    }
  }

  return (
    <footer className="bg-surface-container-low w-full pt-[120px] pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-5 md:px-20 max-w-[1440px] mx-auto">
        {/* Brand */}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
          <div>
            <span className="font-headline-md text-headline-md text-primary block mb-6">ETERNA</span>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-8">
              Timeless elegance crafted for the modern woman. Redefining luxury through minimalist design and uncompromising quality.
            </p>
          </div>
          {/* Newsletter */}
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-primary mb-4">The Atelier</p>
            <form onSubmit={handleNewsletterSubmit} className="relative flex items-end max-w-sm">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); setFeedback('') }}
                required
                className="input-underline flex-1"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-0 bottom-2 text-primary hover:opacity-70 transition-opacity"
                aria-label="Subscribe"
              >
                <span className="material-symbols-outlined text-sm">
                  {status === 'loading' ? 'hourglass_empty' : 'arrow_forward'}
                </span>
              </button>
            </form>
            {feedback && (
              <p className={`font-body-md text-xs mt-2 ${status === 'error' ? 'text-error' : 'text-primary'}`}>
                {feedback}
              </p>
            )}
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">© 2024 ETERNA. Timeless by Design.</p>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary mb-2">Explore</h4>
          {[
            { label: 'Shop', to: '/shop' },
            { label: 'Collections', to: '/collections' },
            { label: 'New Arrivals', to: '/shop' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all ease-in-out duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Support + Company */}
        <div className="flex flex-col gap-4">
          <h4 className="font-label-caps text-label-caps text-primary mb-2">Support</h4>
          {[
            { label: 'About', to: '/about' },
            { label: 'Store Locator', to: '/stores' },
            { label: 'Customer Care', to: '/' },
            { label: 'Size Guide', to: '/' },
            { label: 'Returns', to: '/' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary underline transition-all ease-in-out duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 md:px-20 max-w-[1440px] mx-auto mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-sm text-on-surface-variant font-body-md gap-4">
        <p>© 2024 ETERNA. Timeless by Design.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

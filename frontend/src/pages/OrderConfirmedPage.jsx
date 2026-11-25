import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

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

export default function OrderConfirmedPage() {
  const pageRef = useRef(null)
  useRevealOnScroll(pageRef)
  const location = useLocation()
  const { cartItems, subtotal, clearCart } = useCart()

  // Retrieve real order details passed from backend response or cache
  const [order] = useState(() => {
    if (location.state?.order) return location.state.order
    try {
      const cached = localStorage.getItem('eterna-last-order')
      if (cached) return JSON.parse(cached)
    } catch {}
    return null
  })

  // Clear cart upon arriving on confirmation page
  useEffect(() => {
    if (cartItems.length > 0) {
      clearCart()
    }
  }, [cartItems, clearCart])

  const orderNumber = order?.orderNumber || `ET-ORD-${Math.floor(Math.random() * 9000 + 1000)}`
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const items = order?.items || cartItems
  const displayTotal = order?.total || (subtotal + (subtotal >= 15000 ? 0 : 500))

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-5 py-24">
        <div className="w-full max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-10 reveal-up">
            <div className="w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
              <span
                className="material-symbols-outlined text-5xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mb-3">
              ORDER CONFIRMED
            </p>
            <h1 className="font-display-lg-mobile md:font-headline-md text-display-lg-mobile md:text-headline-md text-primary mb-4">
              Thank You for Your Order
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Your selection has been received and recorded in our atelier ledger.
            </p>
          </div>

          {/* Order Card */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-10 mb-10 reveal-up">
            <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 text-left">
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Order Number</p>
                <p className="font-headline-sm text-headline-sm text-primary tracking-wider">{orderNumber}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Order Date</p>
                <p className="font-body-md text-body-md text-primary">{orderDate}</p>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Estimated Delivery</p>
                <p className="font-body-md text-body-md text-primary">
                  {order?.shippingMethod?.includes('Same Day') ? 'Today by 8 PM' : order?.shippingMethod?.includes('Express') ? '2–3 Business Days' : '5–7 Business Days'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-outline-variant/20 pt-6 space-y-4 text-left">
              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={item.id || idx} className="flex justify-between items-center">
                    <div>
                      <p className="font-body-md text-body-md text-primary">
                        {item.name} (x{item.qty})
                      </p>
                      <p className="font-body-md text-sm text-on-surface-variant">
                        {item.material ? `${item.material} / ` : ''}Size {item.size || item.selectedSize} EU
                      </p>
                    </div>
                    <p className="font-body-md text-body-md text-primary">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-body-md text-sm text-on-surface-variant">Order confirmed</p>
              )}
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                <span className="font-headline-sm text-headline-sm text-primary">Total Paid</span>
                <span className="font-headline-sm text-headline-sm text-primary">
                  ₹{displayTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* What's next */}
          <div className="mb-12 reveal-up">
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-8 tracking-widest">
              WHAT HAPPENS NEXT
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { step: '01', icon: 'inventory_2', title: 'Packaging', desc: 'Your pieces are carefully packaged in our signature ETERNA box with tissue and a handwritten note.' },
                { step: '02', icon: 'local_shipping', title: 'Dispatch', desc: "Your order will be dispatched within 24 hours. You'll receive a tracking link by email." },
                { step: '03', icon: 'home', title: 'Delivery', desc: 'Delivered within 5–7 business days. Complimentary on all orders over ₹15,000.' },
              ].map((item) => (
                <div key={item.step} className="p-6 bg-surface-container-lowest border border-outline-variant/30">
                  <span className="material-symbols-outlined text-2xl text-primary mb-4 block">{item.icon}</span>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{item.step}</p>
                  <h3 className="font-body-md text-body-md text-primary mb-2 font-semibold">{item.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal-up">
            <Link to="/account" className="btn-primary">
              View My Orders
            </Link>
            <Link to="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

          {/* Footer note */}
          <p className="mt-10 font-body-md text-body-md text-on-surface-variant italic reveal-up">
            A confirmation has been sent to your email address. Questions? Contact us at{' '}
            <a href="mailto:care@eterna.in" className="text-primary underline">care@eterna.in</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

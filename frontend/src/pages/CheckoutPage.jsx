import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const steps = ['Contact', 'Shipping', 'Payment']

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, subtotal } = useCart()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState({
    email: 'priya@example.com',
    firstName: 'Priya',
    lastName: 'Mehta',
    address: '42 Marine Drive, Apt 7B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400020',
    phone: '+91 98765 43210',
    shippingMethod: 'Standard Delivery',
    cardName: 'Priya Mehta',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12 / 28',
    cvv: '888',
  })

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleNext = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }

    if (cartItems.length === 0) {
      setErrorMessage('Your bag is empty. Please add items to checkout.')
      return
    }

    setIsSubmitting(true)
    try {
      const orderPayload = {
        contact: {
          email: form.email,
          phone: form.phone,
        },
        shipping: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        shippingMethod: form.shippingMethod,
        cartItems: cartItems.map((item) => ({
          id: item.id,
          qty: item.qty,
          size: String(item.selectedSize || '38'),
          color: item.selectedColor || '',
        })),
      }

      const response = await api.createOrder(orderPayload)

      // Store in localStorage for user account orders history
      try {
        const storedOrders = JSON.parse(localStorage.getItem('eterna-orders') || '[]')
        storedOrders.unshift(response)
        localStorage.setItem('eterna-orders', JSON.stringify(storedOrders))
        localStorage.setItem('eterna-last-order', JSON.stringify(response))
      } catch (storageErr) {
        console.warn('Could not cache order to localStorage:', storageErr)
      }

      navigate('/order-confirmed', { state: { order: response } })
    } catch (err) {
      console.error('Failed to place order:', err)
      setErrorMessage(err.message || 'Unable to place order. Please verify your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-label-caps text-label-caps transition-all ${
                    i <= step ? 'bg-primary text-on-primary' : 'bg-outline-variant text-on-surface-variant'
                  }`}
                >
                  {i < step ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`font-label-caps text-label-caps ${
                    i === step ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-16 ${i < step ? 'bg-primary' : 'bg-outline-variant/50'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Form ───────────────────────────── */}
          <div className="lg:col-span-7">
            <form onSubmit={handleNext} className="space-y-8">
              {step === 0 && (
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Contact Information</h2>
                  <div className="space-y-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="input-underline"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="input-underline"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Shipping Address</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        className="input-underline"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        className="input-underline"
                      />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="input-underline"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="input-underline"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="input-underline"
                      />
                      <input
                        type="text"
                        name="pincode"
                        placeholder="PIN Code"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                        className="input-underline"
                      />
                    </div>
                  </div>

                  {/* Shipping options */}
                  <h3 className="font-label-caps text-label-caps text-primary mt-10 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Standard Delivery', sub: '5–7 business days', price: subtotal >= 15000 ? 'Complimentary' : '₹500' },
                      { label: 'Express Delivery', sub: '2–3 business days', price: '₹500' },
                      { label: 'Same Day Delivery', sub: 'Order before 12 PM', price: '₹1,500' },
                    ].map((opt) => (
                      <label
                        key={opt.label}
                        className={`flex items-center justify-between p-4 border cursor-pointer transition-colors group ${
                          form.shippingMethod === opt.label ? 'border-primary bg-surface-container-low' : 'border-outline-variant hover:border-primary'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={opt.label}
                            checked={form.shippingMethod === opt.label}
                            onChange={handleChange}
                            className="accent-black"
                          />
                          <div>
                            <p className="font-body-md text-body-md text-primary">{opt.label}</p>
                            <p className="font-body-md text-sm text-on-surface-variant">{opt.sub}</p>
                          </div>
                        </div>
                        <span className="font-label-caps text-label-caps text-primary">{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Payment Details</h2>
                  <div className="space-y-6">
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Name on Card"
                      value={form.cardName}
                      onChange={handleChange}
                      required
                      className="input-underline"
                    />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={form.cardNumber}
                      onChange={handleChange}
                      required
                      maxLength={19}
                      className="input-underline"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM / YY"
                        value={form.expiry}
                        onChange={handleChange}
                        required
                        maxLength={7}
                        className="input-underline"
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={form.cvv}
                        onChange={handleChange}
                        required
                        maxLength={4}
                        className="input-underline"
                      />
                    </div>
                  </div>

                  {/* Alternative methods */}
                  <div className="mt-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-px flex-grow bg-outline-variant/40" />
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Or pay with</span>
                      <div className="h-px flex-grow bg-outline-variant/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {['UPI', 'Net Banking', 'EMI'].map((m) => (
                        <button
                          key={m}
                          type="button"
                          className="py-3 border border-outline-variant font-label-caps text-label-caps text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-body-md">
                  {errorMessage}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-outline-variant/30">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => { setStep(step - 1); setErrorMessage('') }}
                    className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>
                ) : (
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Return to Bag
                  </Link>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-primary text-on-primary font-label-caps text-label-caps px-12 py-4 transition-opacity inline-flex items-center gap-2 group ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : step === steps.length - 1 ? 'Place Order' : 'Continue'}
                  {!isSubmitting && (
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Order Summary Sidebar ──────────── */}
          <aside className="lg:col-span-5">
            <div className="bg-surface-container-lowest p-8 sticky top-28">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/30 pb-4">
                Your Order
              </h3>

              <div className="space-y-6 mb-8">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start gap-4">
                    <div className="w-20 h-24 bg-surface-container flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-grow">
                      <p className="font-body-md text-body-md text-primary">{item.name}</p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1">{item.material} / {item.selectedSize} EU</p>
                      <p className="font-body-md text-sm text-on-surface-variant mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="font-body-md text-body-md text-primary">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Discount code */}
              <div className="flex gap-4 mb-8 border-b border-outline-variant/30 pb-8">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="input-underline flex-grow"
                />
                <button className="font-label-caps text-label-caps text-primary border border-outline-variant px-4 py-2 hover:bg-surface-container transition-colors">
                  Apply
                </button>
              </div>

              <div className="space-y-3 font-body-md text-body-md">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping ({form.shippingMethod})</span>
                  <span>
                    {form.shippingMethod === 'Same Day Delivery'
                      ? '₹1,500'
                      : form.shippingMethod === 'Express Delivery'
                      ? '₹500'
                      : subtotal >= 15000
                      ? 'Complimentary'
                      : '₹500'}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-outline-variant/30 font-headline-sm text-headline-sm text-primary">
                  <span>Total</span>
                  <span>
                    ₹{(
                      subtotal +
                      (form.shippingMethod === 'Same Day Delivery'
                        ? 1500
                        : form.shippingMethod === 'Express Delivery'
                        ? 500
                        : subtotal >= 15000
                        ? 0
                        : 500)
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

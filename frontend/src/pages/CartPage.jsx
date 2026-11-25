import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, updateQty, removeItem, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState('')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        <div className="mb-12">
          <h1 className="font-display-lg-mobile md:font-headline-md text-display-lg-mobile md:text-headline-md text-primary mb-2">
            Your Bag
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-6xl text-outline mb-6">shopping_bag</span>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-4">Your bag is empty</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">
              Discover our collection of timeless footwear.
            </p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6">
            {/* ── Cart Items ──────────────────── */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 pb-8 border-b border-outline-variant/30 group">
                  <div className="w-32 h-40 bg-surface-container-low overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container">
                        <span className="material-symbols-outlined text-3xl text-outline">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{item.name}</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-1">
                          {item.material}
                        </p>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          Size: {item.selectedSize} EU
                        </p>
                      </div>
                      <p className="font-body-lg text-body-lg text-primary whitespace-nowrap">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      {/* Qty */}
                      <div className="flex items-center border-b border-outline-variant pb-1 w-24 justify-between">
                        <button
                          onClick={() => updateQty(item.id, item.selectedSize, item.selectedColor, -1)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                          aria-label="Decrease"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-body-md text-body-md">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.selectedSize, item.selectedColor, 1)}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                          aria-label="Increase"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                        className="font-label-caps text-label-caps text-on-surface-variant hover:text-error border-b border-transparent hover:border-error pb-1 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="hidden lg:block">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order Summary ────────────────── */}
            <div className="lg:col-span-4">
              <div className="bg-surface-bright p-8 md:p-10 sticky top-28">
                <h2 className="font-headline-sm text-headline-sm text-primary mb-8 border-b border-outline-variant/30 pb-4">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-4 mb-8 font-body-md text-body-md">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span>{subtotal >= 15000 ? 'Complimentary' : '₹500'}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-8">
                  <div className="relative flex items-end">
                    <input
                      type="text"
                      placeholder="Gift card or discount code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant focus:border-primary text-body-md py-2 px-0 placeholder:italic placeholder:text-on-surface-variant/70 outline-none transition-colors"
                    />
                    <button className="absolute right-0 bottom-2 font-label-caps text-label-caps text-primary hover:opacity-70">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-outline-variant/30 pt-6 mb-10">
                  <span className="font-body-lg text-body-lg text-primary">Total</span>
                  <span className="font-headline-sm text-headline-sm text-primary">
                    ₹{(subtotal + (subtotal >= 15000 ? 0 : 500)).toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>

                <div className="lg:hidden text-center mt-6">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-center font-body-md text-body-md text-on-surface-variant text-sm mt-4 italic">
                  Complimentary shipping on orders over ₹15,000.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

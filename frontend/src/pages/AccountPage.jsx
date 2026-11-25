import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

const tabs = ['Overview', 'Orders', 'Wishlist', 'Settings']

const initialFallbackOrders = [
  {
    id: 'ET-ORD-0001',
    date: '12 Aug 2026',
    status: 'Delivered',
    items: ['Aurelia Stiletto / 38 EU (x1)', 'Élan Slingback / 38 EU (x1)'],
    total: '₹16,998',
  },
  {
    id: 'ET-ORD-0002',
    date: '28 Jun 2026',
    status: 'Delivered',
    items: ['Celeste Pump / 37 EU (x1)'],
    total: '₹9,499',
  },
  {
    id: 'ET-ORD-0003',
    date: '3 Mar 2026',
    status: 'Delivered',
    items: ['Noire Stiletto / 38 EU (x1)', 'Luna Slingback / 38 EU (x1)'],
    total: '₹19,298',
  },
]

const wishlistItems = [
  { name: 'Valentina Heel', material: 'Burgundy velvet', price: '₹11,999', slug: 'valentina-heel' },
  { name: 'Solenne Platform', material: 'Metallic gold', price: '₹13,499', slug: 'solenne-platform' },
  { name: 'Rosé Crystal Heel', material: 'Rose gold embellished', price: '₹12,999', slug: 'rose-crystal-heel' },
]

const statusColor = {
  Delivered: 'text-on-surface bg-surface-container-high',
  Shipped: 'text-on-surface bg-secondary-container',
  Processing: 'text-on-surface bg-surface-container',
  Pending: 'text-amber-800 bg-amber-100',
  pending: 'text-amber-800 bg-amber-100',
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [editingField, setEditingField] = useState(null)
  const [orders, setOrders] = useState(initialFallbackOrders)
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadOrders() {
      setIsLoadingOrders(true)
      try {
        const backendOrders = await api.getOrders()
        // Also check cached local orders
        let localOrders = []
        try {
          localOrders = JSON.parse(localStorage.getItem('eterna-orders') || '[]')
        } catch {}

        // Deduplicate and merge by orderNumber or id
        const map = new Map()

        // 1. Process backend orders
        if (Array.isArray(backendOrders)) {
          for (const ord of backendOrders) {
            const key = ord.orderNumber || String(ord.id)
            map.set(key, ord)
          }
        }

        // 2. Process locally placed orders
        for (const ord of localOrders) {
          const key = ord.orderNumber || String(ord.id)
          if (!map.has(key)) {
            map.set(key, ord)
          }
        }

        const merged = Array.from(map.values())

        if (merged.length > 0 && isMounted) {
          const formatted = merged.map((ord) => ({
            id: ord.orderNumber || `ET-ORD-${String(ord.id).padStart(4, '0')}`,
            date: ord.createdAt
              ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recent',
            status: ord.status
              ? ord.status.charAt(0).toUpperCase() + ord.status.slice(1)
              : 'Pending',
            items: Array.isArray(ord.items) && ord.items.length > 0
              ? ord.items.map((it) =>
                  typeof it === 'string'
                    ? it
                    : `${it.name} / ${it.size || ''} EU (x${it.qty || 1})`
                )
              : ['Handcrafted footwear piece'],
            total: `₹${Number(ord.total || 0).toLocaleString('en-IN')}`,
          }))
          setOrders(formatted)
        }
      } catch (err) {
        console.warn('Could not load dynamic orders:', err)
      } finally {
        if (isMounted) setIsLoadingOrders(false)
      }
    }

    loadOrders()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-5 md:px-20 py-12 md:py-24">
        {/* ── Header ─────────────────────── */}
        <div className="flex items-center justify-between mb-12 pb-8 border-b border-outline-variant/30">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Welcome back,</p>
            <h1 className="font-headline-md text-headline-md text-primary">Priya Mehta</h1>
          </div>
          <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-error border-b border-transparent hover:border-error pb-1 transition-colors">
            Sign Out
          </button>
        </div>

        {/* ── Tabs ───────────────────────── */}
        <div className="flex gap-8 border-b border-outline-variant/30 mb-12 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-label-caps text-label-caps pb-4 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview ───────────────────── */}
        {activeTab === 'Overview' && (
          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Orders', value: String(orders.length), icon: 'shopping_bag' },
                { label: 'Wishlist Items', value: String(wishlistItems.length), icon: 'favorite' },
                { label: 'Loyalty Points', value: (orders.length * 1400 + 50).toLocaleString('en-IN'), icon: 'stars' },
              ].map((stat) => (
                <div key={stat.label} className="p-8 bg-surface-container-lowest border border-outline-variant/30">
                  <span className="material-symbols-outlined text-2xl text-primary mb-4 block">{stat.icon}</span>
                  <p className="font-display-lg-mobile text-display-lg-mobile text-primary mb-1">{stat.value}</p>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders Preview */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-primary">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab('Orders')}
                  className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {orders.slice(0, 2).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant/30 gap-4">
                    <div>
                      <p className="font-body-md text-body-md text-primary mb-1">{order.id}</p>
                      <p className="font-body-md text-sm text-on-surface-variant">{order.date}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{order.items[0]}{order.items.length > 1 ? ` +${order.items.length - 1}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-label-caps text-label-caps px-3 py-1 ${statusColor[order.status] || statusColor['Delivered']}`}>
                        {order.status}
                      </span>
                      <span className="font-body-md text-body-md text-primary">{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ─────────────────────── */}
        {activeTab === 'Orders' && (
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Order History</h2>
            {orders.length === 0 ? (
              <div className="text-center py-24">
                <span className="material-symbols-outlined text-5xl text-outline mb-4 block">shopping_bag</span>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">No orders yet.</p>
                <Link to="/shop" className="btn-primary">Shop Now</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="p-8 bg-surface-container-lowest border border-outline-variant/30">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                      <div>
                        <p className="font-headline-sm text-headline-sm text-primary mb-1">{order.id}</p>
                        <p className="font-body-md text-sm text-on-surface-variant">Placed on {order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-label-caps text-label-caps px-3 py-1 ${statusColor[order.status] || statusColor['Delivered']}`}>
                          {order.status}
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary">{order.total}</span>
                      </div>
                    </div>
                    <div className="border-t border-outline-variant/20 pt-4 space-y-2">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="font-body-md text-body-md text-on-surface-variant">{item}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-4">
                      <button className="font-label-caps text-label-caps text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity">
                        View Details
                      </button>
                      <button className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant pb-1 hover:text-primary hover:border-primary transition-colors">
                        Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Wishlist ───────────────────── */}
        {activeTab === 'Wishlist' && (
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary mb-8">
              Saved Pieces ({wishlistItems.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.name} className="bg-surface-container-lowest border border-outline-variant/30 p-6">
                  <div className="aspect-[4/5] bg-surface-container mb-4 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-outline">image</span>
                  </div>
                  <h3 className="font-body-md text-body-md text-primary mb-1">{item.name}</h3>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{item.material}</p>
                  <p className="font-body-md text-body-md text-primary mb-4">{item.price}</p>
                  <div className="flex gap-3">
                    <Link to={`/product/${item.slug}`} className="btn-primary text-center flex-1 py-3">
                      View
                    </Link>
                    <button className="border border-outline-variant text-on-surface-variant p-3 hover:border-error hover:text-error transition-colors">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        favorite
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings ───────────────────── */}
        {activeTab === 'Settings' && (
          <div className="max-w-2xl space-y-12">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Profile Information</h2>
              <div className="space-y-6">
                {[
                  { label: 'Full Name', value: 'Priya Mehta', field: 'name' },
                  { label: 'Email Address', value: 'priya@example.com', field: 'email' },
                  { label: 'Phone Number', value: '+91 98765 43210', field: 'phone' },
                ].map((item) => (
                  <div key={item.field} className="flex items-end justify-between border-b border-outline-variant/30 pb-4">
                    <div className="flex-grow">
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{item.label}</p>
                      {editingField === item.field ? (
                        <input
                          type="text"
                          defaultValue={item.value}
                          className="input-underline"
                          autoFocus
                        />
                      ) : (
                        <p className="font-body-md text-body-md text-primary">{item.value}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingField(editingField === item.field ? null : item.field)}
                      className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors ml-4"
                    >
                      {editingField === item.field ? 'Save' : 'Edit'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-8">Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Marketing Emails', desc: 'New arrivals, exclusive offers, and style guides.' },
                  { label: 'SMS Notifications', desc: 'Order updates and shipping confirmations.' },
                  { label: 'The Atelier Newsletter', desc: 'Monthly editorial featuring ETERNA collections.' },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-start justify-between py-4 border-b border-outline-variant/20">
                    <div>
                      <p className="font-body-md text-body-md text-primary mb-1">{pref.label}</p>
                      <p className="font-body-md text-sm text-on-surface-variant">{pref.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-6 flex-shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-10 h-5 bg-outline-variant peer-checked:bg-primary rounded-full peer transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

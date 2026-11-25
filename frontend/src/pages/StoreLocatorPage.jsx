import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

const stores = [
  {
    city: 'Mumbai',
    name: 'ETERNA Flagship — Bandra',
    address: '14 Linking Road, Bandra West, Mumbai 400050',
    phone: '+91 22 4567 8901',
    hours: 'Mon–Sat 10am–8pm, Sun 11am–7pm',
    services: ['Personal Styling', 'Bespoke Orders', 'Alterations'],
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    city: 'Delhi',
    name: 'ETERNA — Khan Market',
    address: '23 Khan Market, New Delhi 110003',
    phone: '+91 11 4321 0987',
    hours: 'Mon–Sat 10am–8pm, Sun 11am–7pm',
    services: ['Personal Styling', 'Gift Wrapping'],
    lat: 28.6003,
    lng: 77.2304,
  },
  {
    city: 'Bengaluru',
    name: 'ETERNA — Indiranagar',
    address: '56 12th Main, Indiranagar, Bengaluru 560038',
    phone: '+91 80 2345 6789',
    hours: 'Mon–Sat 10am–8pm, Sun 11am–7pm',
    services: ['Personal Styling', 'Bespoke Orders'],
    lat: 12.9716,
    lng: 77.6412,
  },
  {
    city: 'Hyderabad',
    name: 'ETERNA — Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
    phone: '+91 40 3456 7890',
    hours: 'Tue–Sun 10am–8pm, Mon Closed',
    services: ['Gift Wrapping', 'Alterations'],
    lat: 17.4239,
    lng: 78.4074,
  },
  {
    city: 'Chennai',
    name: 'ETERNA — Nungambakkam',
    address: '12 Nungambakkam High Road, Chennai 600034',
    phone: '+91 44 2234 5678',
    hours: 'Mon–Sat 10am–8pm, Sun 11am–7pm',
    services: ['Personal Styling'],
    lat: 13.0569,
    lng: 80.2425,
  },
  {
    city: 'Kolkata',
    name: 'ETERNA — Park Street',
    address: '78 Park Street, Kolkata 700016',
    phone: '+91 33 3456 7891',
    hours: 'Mon–Sat 10am–8pm, Sun 11am–7pm',
    services: ['Personal Styling', 'Gift Wrapping'],
    lat: 22.5514,
    lng: 88.3509,
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
      { threshold: 0.08 }
    )
    const els = ref.current?.querySelectorAll('.reveal-up') || []
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

export default function StoreLocatorPage() {
  const [selectedStore, setSelectedStore] = useState(stores[0])
  const [searchCity, setSearchCity] = useState('')
  const pageRef = useRef(null)
  useRevealOnScroll(pageRef)

  const filteredStores = stores.filter((s) =>
    s.city.toLowerCase().includes(searchCity.toLowerCase()) ||
    s.name.toLowerCase().includes(searchCity.toLowerCase())
  )

  const [appointmentEmail, setAppointmentEmail] = useState('')
  const [appointmentStatus, setAppointmentStatus] = useState('idle')
  const [appointmentMsg, setAppointmentMsg] = useState('')

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault()
    if (!appointmentEmail || !appointmentEmail.includes('@')) {
      setAppointmentMsg('Please provide a valid email address.')
      setAppointmentStatus('error')
      return
    }

    setAppointmentStatus('loading')
    try {
      const res = await api.bookAppointment({
        email: appointmentEmail,
        city: selectedStore?.city || 'Mumbai',
        notes: `Appointment request for ${selectedStore?.name || 'Flagship boutique'}`,
      })
      setAppointmentStatus('success')
      setAppointmentMsg(res.message || 'Appointment request received. Our concierge will contact you shortly.')
      setAppointmentEmail('')
    } catch (err) {
      console.warn('Appointment booking error:', err)
      setAppointmentStatus('success')
      setAppointmentMsg('Appointment request received. Our concierge will contact you shortly.')
      setAppointmentEmail('')
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* ── Header ─────────────────────────── */}
        <section className="py-[80px] px-5 md:px-20 bg-surface-container-lowest text-center">
          <div className="max-w-2xl mx-auto reveal-up">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">
              FIND US
            </p>
            <h1 className="font-headline-md text-headline-md text-primary mb-6">Our Boutiques</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Discover the ETERNA experience in person. Six boutiques across India, each offering an intimate sanctuary of quiet luxury.
            </p>
          </div>
        </section>

        {/* ── Main ───────────────────────────── */}
        <section className="py-12 px-5 md:px-20 max-w-[1440px] mx-auto">
          {/* Search */}
          <div className="max-w-md mb-12 reveal-up">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant">
                location_on
              </span>
              <input
                type="text"
                placeholder="Search city or store name…"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full bg-transparent border-b border-outline-variant pb-2 pl-8 font-body-md text-body-md focus:outline-none focus:border-primary transition-colors placeholder:italic placeholder:text-on-surface-variant/70"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Store List */}
            <div className="w-full lg:w-2/5 space-y-4">
              {filteredStores.length === 0 && (
                <p className="font-body-md text-body-md text-on-surface-variant italic">No stores found.</p>
              )}
              {filteredStores.map((store, i) => (
                <button
                  key={store.city}
                  onClick={() => setSelectedStore(store)}
                  className={`w-full text-left p-6 border transition-all duration-300 reveal-up ${
                    selectedStore.city === store.city
                      ? 'border-primary bg-surface-container-lowest'
                      : 'border-outline-variant/30 hover:border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">{store.city}</p>
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{store.name}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">{store.address}</p>
                    </div>
                    <span
                      className={`material-symbols-outlined transition-colors ${
                        selectedStore.city === store.city ? 'text-primary' : 'text-outline-variant'
                      }`}
                    >
                      location_on
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Store Detail */}
            <div className="w-full lg:w-3/5 lg:sticky lg:top-28 h-fit">
              {selectedStore && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-10 reveal-up">
                  {/* Map placeholder */}
                  <div className="w-full h-56 bg-surface-container mb-8 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-container via-surface-container-high to-outline-variant/20" />
                    <div className="relative z-10 text-center">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2 block">map</span>
                      <p className="font-label-caps text-label-caps text-on-surface-variant">
                        {selectedStore.lat.toFixed(4)}, {selectedStore.lng.toFixed(4)}
                      </p>
                    </div>
                    {/* decorative pins */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        location_on
                      </span>
                    </div>
                  </div>

                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{selectedStore.city}</p>
                  <h2 className="font-headline-sm text-headline-sm text-primary mb-6">{selectedStore.name}</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-sm mt-1">location_on</span>
                      <p className="font-body-md text-body-md text-on-surface-variant">{selectedStore.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-sm">call</span>
                      <a href={`tel:${selectedStore.phone}`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors">
                        {selectedStore.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary text-sm mt-1">schedule</span>
                      <p className="font-body-md text-body-md text-on-surface-variant">{selectedStore.hours}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="font-label-caps text-label-caps text-primary mb-3">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedStore.services.map((s) => (
                        <span
                          key={s}
                          className="border border-outline-variant font-label-caps text-label-caps text-on-surface-variant px-3 py-1"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${selectedStore.lat},${selectedStore.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Get Directions
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Book Appointment ──────────────── */}
        <section className="py-[120px] px-5 md:px-20 bg-surface-container-lowest mt-24">
          <div className="max-w-2xl mx-auto text-center reveal-up">
            <h2 className="font-headline-md text-headline-md text-primary mb-6">
              Book a Private Appointment
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
              Experience ETERNA exclusively. Book a private styling session with our expert consultants and discover your signature pair.
            </p>
            <form onSubmit={handleAppointmentSubmit} className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={appointmentEmail}
                  onChange={(e) => { setAppointmentEmail(e.target.value); setAppointmentStatus('idle'); setAppointmentMsg('') }}
                  required
                  className="input-underline max-w-xs flex-grow"
                />
                <button
                  type="submit"
                  disabled={appointmentStatus === 'loading'}
                  className="btn-primary"
                >
                  {appointmentStatus === 'loading' ? 'Requesting...' : 'Request Appointment'}
                </button>
              </div>
              {appointmentMsg && (
                <p className={`font-body-md text-sm mt-3 ${appointmentStatus === 'error' ? 'text-error' : 'text-primary'}`}>
                  {appointmentMsg}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

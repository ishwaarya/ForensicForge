import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CollectionsPage from './pages/CollectionsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import StoreLocatorPage from './pages/StoreLocatorPage'
import AccountPage from './pages/AccountPage'
import OrderConfirmedPage from './pages/OrderConfirmedPage'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stores" element={<StoreLocatorPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

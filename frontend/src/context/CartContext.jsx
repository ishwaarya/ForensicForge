import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('eterna-cart')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('eterna-cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, size, color) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      )
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, qty: 1 }]
    })
  }

  const updateQty = (id, size, color, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, qty: item.qty + delta }
            : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const removeItem = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === id && item.selectedSize === size && item.selectedColor === color)
      )
    )
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeItem, clearCart, cartCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}

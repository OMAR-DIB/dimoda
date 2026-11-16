import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
}

const STORAGE_KEY = 'dimoda.cart.v1'

const load = (): CartState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CartState
      if (Array.isArray(parsed.items)) return parsed
    }
  } catch {
    /* ignore */
  }
  return { items: [] }
}

export const persistCart = (state: CartState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

export const cartKey = (productId: string, size: string, color: string) =>
  `${productId}__${size}__${color}`

const cartSlice = createSlice({
  name: 'cart',
  initialState: load(),
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ product: Product; size: string; color: string; quantity?: number }>,
    ) {
      const { product, size, color, quantity = 1 } = action.payload
      const key = cartKey(product.id, size, color)
      const existing = state.items.find((i) => i.key === key)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, 10)
      } else {
        state.items.unshift({
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          size,
          color,
          quantity,
        })
      }
    },
    updateQuantity(state, action: PayloadAction<{ key: string; quantity: number }>) {
      const item = state.items.find((i) => i.key === action.payload.key)
      if (!item) return
      item.quantity = Math.max(1, Math.min(10, action.payload.quantity))
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.key !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

export const selectCartItems = (s: { cart: CartState }) => s.cart.items
export const selectCartCount = (s: { cart: CartState }) =>
  s.cart.items.reduce((n, i) => n + i.quantity, 0)
export const selectCartSubtotal = (s: { cart: CartState }) =>
  s.cart.items.reduce((n, i) => n + i.price * i.quantity, 0)

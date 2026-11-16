import { configureStore } from '@reduxjs/toolkit'
import cart, { persistCart } from './cartSlice'
import wishlist, { persistWishlist } from './wishlistSlice'
import ui from './uiSlice'
import catalog from './catalogSlice'

export const store = configureStore({
  reducer: { cart, wishlist, ui, catalog },
})

// Persist cart + wishlist to localStorage on every change.
let prevCart = store.getState().cart
let prevWishlist = store.getState().wishlist
store.subscribe(() => {
  const s = store.getState()
  if (s.cart !== prevCart) {
    prevCart = s.cart
    persistCart(s.cart)
  }
  if (s.wishlist !== prevWishlist) {
    prevWishlist = s.wishlist
    persistWishlist(s.wishlist)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

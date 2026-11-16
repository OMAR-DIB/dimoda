import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Toast {
  id: number
  title: string
  description?: string
  image?: string
  action?: { label: string; to: string }
}

interface UiState {
  cartOpen: boolean
  menuOpen: boolean
  searchOpen: boolean
  toasts: Toast[]
}

const initialState: UiState = {
  cartOpen: false,
  menuOpen: false,
  searchOpen: false,
  toasts: [],
}

let toastId = 0

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart(s) {
      s.cartOpen = true
      s.menuOpen = false
      s.searchOpen = false
    },
    closeCart(s) {
      s.cartOpen = false
    },
    toggleMenu(s, a: PayloadAction<boolean | undefined>) {
      s.menuOpen = a.payload ?? !s.menuOpen
      if (s.menuOpen) {
        s.cartOpen = false
        s.searchOpen = false
      }
    },
    toggleSearch(s, a: PayloadAction<boolean | undefined>) {
      s.searchOpen = a.payload ?? !s.searchOpen
      if (s.searchOpen) {
        s.cartOpen = false
        s.menuOpen = false
      }
    },
    pushToast: {
      reducer(s, a: PayloadAction<Toast>) {
        s.toasts.push(a.payload)
        if (s.toasts.length > 3) s.toasts.shift()
      },
      prepare(t: Omit<Toast, 'id'>) {
        return { payload: { ...t, id: ++toastId } }
      },
    },
    dismissToast(s, a: PayloadAction<number>) {
      s.toasts = s.toasts.filter((t) => t.id !== a.payload)
    },
  },
})

export const { openCart, closeCart, toggleMenu, toggleSearch, pushToast, dismissToast } =
  uiSlice.actions
export default uiSlice.reducer

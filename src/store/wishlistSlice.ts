import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface WishlistState {
  ids: string[]
}

const STORAGE_KEY = 'dimoda.wishlist.v1'

const load = (): WishlistState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as WishlistState
      if (Array.isArray(parsed.ids)) return parsed
    }
  } catch {
    /* ignore */
  }
  return { ids: [] }
}

export const persistWishlist = (state: WishlistState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: load(),
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload
      if (state.ids.includes(id)) state.ids = state.ids.filter((x) => x !== id)
      else state.ids.unshift(id)
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((x) => x !== action.payload)
    },
  },
})

export const { toggleWishlist, removeFromWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const selectWishlistIds = (s: { wishlist: WishlistState }) => s.wishlist.ids

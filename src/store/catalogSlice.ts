import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Product } from '../types'
import { fetchProducts } from '../lib/catalog'

interface CatalogState {
  products: Product[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  source: 'supabase' | 'mock' | null
  error?: string
}

const initialState: CatalogState = {
  products: [],
  status: 'idle',
  source: null,
}

export const loadCatalog = createAsyncThunk('catalog/load', async () => fetchProducts())

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadCatalog.pending, (s) => {
      s.status = 'loading'
    })
    b.addCase(loadCatalog.fulfilled, (s, a) => {
      s.status = 'ready'
      s.products = a.payload.products
      s.source = a.payload.source
    })
    b.addCase(loadCatalog.rejected, (s, a) => {
      s.status = 'error'
      s.error = a.error.message
    })
  },
})

export default catalogSlice.reducer

export const selectProducts = (s: { catalog: CatalogState }) => s.catalog.products
export const selectCatalogStatus = (s: { catalog: CatalogState }) => s.catalog.status
export const selectCatalogSource = (s: { catalog: CatalogState }) => s.catalog.source

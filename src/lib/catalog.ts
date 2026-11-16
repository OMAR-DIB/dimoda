import type { Product } from '../types'
import { products as mockProducts } from '../data/products'
import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Catalog repository.
 * - If Supabase is configured → reads from the `products` table.
 * - Otherwise → returns the bundled mock catalog (so the demo always works).
 */

interface ProductRow {
  id: string
  slug: string
  name: string
  gender: 'women' | 'men'
  category: string
  price: number
  compare_at_price: number | null
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  description: string
  details: string[] | null
  tags: string[] | null
  rating: number | null
  review_count: number | null
  in_stock: boolean
  created_at: string
}

const fromRow = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  gender: r.gender,
  category: r.category,
  price: Number(r.price),
  compareAtPrice: r.compare_at_price == null ? null : Number(r.compare_at_price),
  images: r.images ?? [],
  colors: r.colors ?? [],
  sizes: r.sizes ?? [],
  description: r.description,
  details: r.details ?? [],
  tags: (r.tags ?? []) as Product['tags'],
  rating: r.rating ?? undefined,
  reviewCount: r.review_count ?? undefined,
  inStock: r.in_stock,
  createdAt: r.created_at,
})

export async function fetchProducts(): Promise<{ products: Product[]; source: 'supabase' | 'mock' }> {
  if (!isSupabaseConfigured || !supabase) {
    return { products: mockProducts, source: 'mock' }
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    if (error) console.warn('[catalog] Supabase error, falling back to mock data:', error.message)
    return { products: mockProducts, source: 'mock' }
  }
  return { products: (data as ProductRow[]).map(fromRow), source: 'supabase' }
}

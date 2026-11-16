export type Gender = 'women' | 'men'

export type ProductTag = 'new' | 'bestseller' | 'sale' | 'limited'

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  gender: Gender
  category: string // slug of a category, e.g. "dresses"
  price: number
  compareAtPrice?: number | null
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  description: string
  details?: string[]
  tags?: ProductTag[]
  rating?: number
  reviewCount?: number
  inStock?: boolean
  createdAt?: string
}

export interface Category {
  slug: string
  name: string
  gender: Gender
  image: string
}

export interface CartItem {
  key: string // productId + size + color
  productId: string
  slug: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

export interface CustomerDetails {
  name: string
  phone: string
  city: string
  address: string
  fulfillment: 'delivery' | 'pickup'
  note?: string
}

export interface OrderPayload {
  reference: string
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

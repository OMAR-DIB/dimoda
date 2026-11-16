import { Heart } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import { selectWishlistIds } from '../store/wishlistSlice'
import { selectProducts, selectCatalogStatus } from '../store/catalogSlice'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/ui/EmptyState'

export default function Wishlist() {
  const ids = useAppSelector(selectWishlistIds)
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectCatalogStatus)
  const list = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products

  return (
    <div className="container-x pt-8 sm:pt-12">
      <p className="eyebrow">Saved for later</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Wishlist</h1>
      <div className="mt-10">
        {status === 'ready' && list.length === 0 ? (
          <EmptyState
            icon={<Heart className="h-12 w-12" strokeWidth={1} />}
            title="No favourites yet"
            description="Tap the heart on any product to save it here."
            action={{ label: 'Discover pieces', to: '/shop' }}
          />
        ) : (
          <ProductGrid products={list} loading={status !== 'ready'} />
        )}
      </div>
    </div>
  )
}

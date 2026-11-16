import type { Product } from '../../types'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from '../ui/Skeleton'
import { cx } from '../../lib/format'

export function ProductGrid({
  products,
  loading = false,
  columns = 4,
  className,
}: {
  products: Product[]
  loading?: boolean
  columns?: 3 | 4
  className?: string
}) {
  const cols = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  return (
    <div className={cx('grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6', cols, className)}>
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} eager={i < 4} />)}
    </div>
  )
}

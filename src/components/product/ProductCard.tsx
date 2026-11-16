import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '../../types'
import { Price } from '../ui/Price'
import { Badge } from '../ui/Badge'
import { ProductImage } from '../ui/ProductImage'
import { categoryName } from '../../data/categories'
import { cx } from '../../lib/format'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleWishlist, selectWishlistIds } from '../../store/wishlistSlice'
import { addToCart } from '../../store/cartSlice'
import { pushToast } from '../../store/uiSlice'

export function ProductCard({ product, index = 0, eager = false }: { product: Product; index?: number; eager?: boolean }) {
  const dispatch = useAppDispatch()
  const wishlist = useAppSelector(selectWishlistIds)
  const wished = wishlist.includes(product.id)
  const [quickSize, setQuickSize] = useState<string | null>(null)
  const singleSize = product.sizes.length === 1

  const quickAdd = (size: string) => {
    dispatch(addToCart({ product, size, color: product.colors[0]?.name ?? 'Default' }))
    dispatch(
      pushToast({
        title: 'Added to bag',
        description: `${product.name} · ${size}`,
        image: product.images[0],
        action: { label: 'View bag', to: '/cart' },
      }),
    )
    setQuickSize(null)
  }

  return (
    <article
      className="group relative animate-fadeUp"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="relative">
        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            eager={eager}
            className="aspect-[3/4] w-full"
            imgClassName="transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
            />
          )}
        </Link>

        {/* tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
            {product.tags.slice(0, 2).map((t) => (
              <Badge key={t} tag={t} />
            ))}
          </div>
        )}

        {/* wishlist */}
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => dispatch(toggleWishlist(product.id))}
          className={cx(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-all hover:scale-105',
            wished ? 'text-gold-600' : 'text-ink opacity-0 group-hover:opacity-100 focus:opacity-100',
          )}
        >
          <Heart className={cx('h-4 w-4', wished && 'fill-current')} />
        </button>

        {/* quick add */}
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          {singleSize ? (
            <button
              type="button"
              onClick={() => quickAdd(product.sizes[0])}
              className="flex w-full items-center justify-center gap-2 bg-white/95 py-3 text-[11px] font-medium uppercase tracking-wide2 backdrop-blur transition hover:bg-ink hover:text-ivory"
            >
              <Plus className="h-3.5 w-3.5" /> Quick add
            </button>
          ) : (
            <div className="bg-white/95 backdrop-blur">
              <p className="pt-2 text-center text-[10px] uppercase tracking-wide2 text-stone">Quick add · size</p>
              <div className="no-scrollbar flex gap-1 overflow-x-auto px-2 pb-2 pt-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => quickAdd(s)}
                    onMouseEnter={() => setQuickSize(s)}
                    className={cx(
                      'min-w-[36px] flex-1 border px-2 py-1.5 text-[11px] font-medium transition',
                      quickSize === s ? 'border-ink bg-ink text-ivory' : 'border-ivory-300 hover:border-ink',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide2 text-stone-light">{categoryName(product.category)}</p>
          <h3 className="mt-0.5 truncate font-sans text-[15px] font-normal tracking-normal">
            <Link to={`/product/${product.slug}`} className="hover:text-gold-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          <Price price={product.price} compareAt={product.compareAtPrice} size="sm" className="mt-1" />
        </div>
        {product.colors.length > 0 && (
          <div className="mt-1 flex shrink-0 items-center gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full ring-1 ring-ivory-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-light">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

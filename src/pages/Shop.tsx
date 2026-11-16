import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import { selectProducts, selectCatalogStatus } from '../store/catalogSlice'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { categoriesByGender, categoryName } from '../data/categories'
import { cx } from '../lib/format'
import type { Gender, Product } from '../types'

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc'

const sortOptions: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const titleFor = (gender?: Gender, category?: string, tag?: string | null, q?: string | null) => {
  if (q) return `Results for “${q}”`
  if (tag === 'new') return 'New in'
  if (tag === 'sale') return 'Sale'
  if (tag === 'bestseller') return 'Bestsellers'
  if (category) return categoryName(category)
  if (gender) return gender === 'women' ? 'Women' : 'Men'
  return 'All products'
}

export default function Shop() {
  const { gender, category } = useParams<{ gender?: Gender; category?: string }>()
  const [params, setParams] = useSearchParams()
  const products = useAppSelector(selectProducts)
  const status = useAppSelector(selectCatalogStatus)
  const loading = status !== 'ready'

  const tag = params.get('tag')
  const q = params.get('q')
  const sort = (params.get('sort') as Sort) || 'featured'
  const sizes = params.get('sizes')?.split(',').filter(Boolean) ?? []
  const colors = params.get('colors')?.split(',').filter(Boolean) ?? []
  const maxPrice = params.get('max') ? Number(params.get('max')) : null
  const [filtersOpen, setFiltersOpen] = useState(false)

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const toggleList = (key: 'sizes' | 'colors', v: string) => {
    const list = key === 'sizes' ? sizes : colors
    const next = list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
    setParam(key, next.join(','))
  }

  // base set by route
  const base = useMemo(() => {
    let list = products
    if (gender) list = list.filter((p) => p.gender === gender)
    if (category) list = list.filter((p) => p.category === category)
    if (tag) list = list.filter((p) => p.tags?.includes(tag as never))
    if (q) {
      const t = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          categoryName(p.category).toLowerCase().includes(t) ||
          p.description.toLowerCase().includes(t) ||
          p.gender.includes(t),
      )
    }
    return list
  }, [products, gender, category, tag, q])

  const availableSizes = useMemo(() => {
    const set = new Set<string>()
    base.forEach((p) => p.sizes.forEach((s) => set.add(s)))
    return Array.from(set).sort((a, b) => {
      const na = Number(a), nb = Number(b)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
      return order.indexOf(a) - order.indexOf(b)
    })
  }, [base])
  const availableColors = useMemo(() => {
    const map = new Map<string, string>()
    base.forEach((p) => p.colors.forEach((c) => map.set(c.name, c.hex)))
    return Array.from(map.entries())
  }, [base])
  const priceCeil = useMemo(() => Math.max(50, ...base.map((p) => p.price)), [base])

  const filtered = useMemo(() => {
    let list: Product[] = base
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)))
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c.name)))
    if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice)
    switch (sort) {
      case 'newest':
        list = [...list].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        break
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      default:
        list = [...list].sort((a, b) => (b.tags?.length ?? 0) - (a.tags?.length ?? 0) || (b.rating ?? 0) - (a.rating ?? 0))
    }
    return list
  }, [base, sizes, colors, maxPrice, sort])

  const activeCount = sizes.length + colors.length + (maxPrice != null ? 1 : 0)
  const clearFilters = () => {
    const next = new URLSearchParams(params)
    ;['sizes', 'colors', 'max'].forEach((k) => next.delete(k))
    setParams(next, { replace: true })
  }

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [filtersOpen])

  const title = titleFor(gender, category, tag, q)
  const cats = gender ? categoriesByGender(gender) : []

  const Filters = (
    <div className="space-y-8">
      {cats.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide2 text-stone">Category</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to={`/shop/${gender}`} className={cx('hover:text-gold-600', !category && 'font-medium text-gold-600')}>
                All {gender}
              </Link>
            </li>
            {cats.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/shop/${gender}/${c.slug}`}
                  className={cx('hover:text-gold-600', category === c.slug && 'font-medium text-gold-600')}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {availableSizes.length > 1 && (
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide2 text-stone">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleList('sizes', s)}
                className={cx(
                  'min-w-[40px] border px-2.5 py-1.5 text-xs transition',
                  sizes.includes(s) ? 'border-ink bg-ink text-ivory' : 'border-ivory-300 hover:border-ink',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {availableColors.length > 1 && (
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wide2 text-stone">Colour</p>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(([name, hex]) => (
              <button
                key={name}
                title={name}
                aria-label={name}
                aria-pressed={colors.includes(name)}
                onClick={() => toggleList('colors', name)}
                className={cx(
                  'h-7 w-7 rounded-full ring-1 ring-ivory-300 ring-offset-2 ring-offset-ivory transition',
                  colors.includes(name) && 'ring-2 ring-ink',
                )}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide2 text-stone">
          Max price · <span className="text-ink">{maxPrice ?? priceCeil}</span>
        </p>
        <input
          type="range"
          min={20}
          max={priceCeil}
          step={5}
          value={maxPrice ?? priceCeil}
          onChange={(e) => setParam('max', Number(e.target.value) >= priceCeil ? null : e.target.value)}
          className="w-full accent-gold-500"
        />
      </div>

      {activeCount > 0 && (
        <button onClick={clearFilters} className="text-[11px] font-medium uppercase tracking-wide2 text-gold-600 hover:text-ink">
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="container-x pt-6 sm:pt-10">
      {/* breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-[11px] uppercase tracking-wide2 text-stone-light" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-ink">Shop</Link>
        {gender && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/shop/${gender}`} className="capitalize hover:text-ink">{gender}</Link>
          </>
        )}
        {category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <span className="text-ink">{categoryName(category)}</span>
          </>
        )}
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-stone">
            {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-outline !px-4 !py-2.5 lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
          <label className="flex items-center gap-2 text-xs">
            <span className="hidden uppercase tracking-wide2 text-stone sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'featured' ? null : e.target.value)}
              className="field !w-auto !py-2.5"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* gender quick switch when no gender */}
      {!gender && !q && (
        <div className="mt-6 flex gap-2">
          {(['women', 'men'] as const).map((g) => (
            <Link key={g} to={`/shop/${g}${tag ? `?tag=${tag}` : ''}`} className="border border-ivory-300 px-4 py-2 text-xs uppercase tracking-wide2 hover:border-ink">
              {g}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>

        <div>
          {!loading && filtered.length === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="Try removing a filter or browse another category."
              action={{ label: 'Browse all', to: '/shop' }}
            />
          ) : (
            <ProductGrid products={filtered} loading={loading} columns={3} />
          )}
        </div>
      </div>

      {/* mobile filters drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/40 animate-fadeIn" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-ivory animate-slideInRight">
            <div className="flex items-center justify-between border-b border-ivory-300 px-6 py-5">
              <span className="text-sm font-medium uppercase tracking-luxe">Filters</span>
              <button aria-label="Close" onClick={() => setFiltersOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{Filters}</div>
            <div className="border-t border-ivory-300 p-4">
              <button className="btn-primary w-full" onClick={() => setFiltersOpen(false)}>
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

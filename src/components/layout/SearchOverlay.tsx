import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleSearch } from '../../store/uiSlice'
import { selectProducts } from '../../store/catalogSlice'
import { categoryName } from '../../data/categories'
import { Price } from '../ui/Price'

const suggestions = ['Dresses', 'Blazer', 'Linen', 'Sneakers', 'Denim', 'Leather jacket']

export function SearchOverlay() {
  const open = useAppSelector((s) => s.ui.searchOpen)
  const products = useAppSelector(selectProducts)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => ref.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dispatch(toggleSearch(false))
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dispatch])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 2) return []
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          categoryName(p.category).toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.gender.includes(term),
      )
      .slice(0, 6)
  }, [q, products])

  if (!open) return null
  const close = () => dispatch(toggleSearch(false))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
      close()
    }
  }

  return (
    <div className="fixed inset-0 z-[85] animate-fadeIn" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={close} />
      <div className="absolute inset-x-0 top-0 bg-ivory shadow-soft">
        <div className="container-x py-6 sm:py-8">
          <form onSubmit={submit} className="flex items-center gap-4 border-b border-ink pb-3">
            <Search className="h-5 w-5 shrink-0 text-stone" />
            <input
              ref={ref}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dresses, blazers, sneakers…"
              className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-stone-light sm:text-3xl"
            />
            <button type="button" aria-label="Close search" onClick={close} className="p-1 hover:text-gold-600">
              <X className="h-6 w-6" />
            </button>
          </form>

          {q.trim().length < 2 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="mr-2 self-center text-[11px] uppercase tracking-wide2 text-stone">Popular</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="border border-ivory-300 px-3 py-1.5 text-sm hover:border-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="mt-6 text-stone">No results for “{q}”. Try another word.</p>
          ) : (
            <div className="mt-5">
              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link to={`/product/${p.slug}`} onClick={close} className="flex items-center gap-4 py-1 hover:text-gold-600">
                      <img src={p.images[0]} alt="" className="h-16 w-12 object-cover bg-ivory-200" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs capitalize text-stone">{p.gender} · {categoryName(p.category)}</p>
                        <Price price={p.price} compareAt={p.compareAtPrice} size="sm" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={submit} className="mt-5 text-[11px] font-medium uppercase tracking-wide2 link-underline">
                See all results for “{q}”
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { openCart, toggleMenu, toggleSearch } from '../../store/uiSlice'
import { selectCartCount } from '../../store/cartSlice'
import { selectWishlistIds } from '../../store/wishlistSlice'
import { categoriesByGender } from '../../data/categories'
import { cx } from '../../lib/format'

const nav = [
  { label: 'Women', to: '/shop/women', gender: 'women' as const },
  { label: 'Men', to: '/shop/men', gender: 'men' as const },
  { label: 'New In', to: '/shop?tag=new' },
  { label: 'Sale', to: '/shop?tag=sale' },
  { label: 'About', to: '/about' },
]

export function Header() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCartCount)
  const wishCount = useAppSelector(selectWishlistIds).length
  const menuOpen = useAppSelector((s) => s.ui.menuOpen)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<'women' | 'men' | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    dispatch(toggleMenu(false))
    setHovered(null)
  }, [location.pathname, location.search, dispatch])

  const [bump, setBump] = useState(false)
  useEffect(() => {
    if (count === 0) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 400)
    return () => clearTimeout(t)
  }, [count])

  return (
    <header
      className={cx(
        'sticky top-0 z-[60] transition-all duration-300',
        scrolled ? 'bg-ivory/90 shadow-[0_1px_0_0_#E4E1D8] backdrop-blur-md' : 'bg-ivory',
      )}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="container-x flex h-16 items-center justify-between lg:h-20">
        {/* left: burger + nav */}
        <div className="flex flex-1 items-center gap-6">
          <button
            className="-ml-2 p-2 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => dispatch(toggleMenu())}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((n) => (
              <NavLink
                key={n.label}
                to={n.to}
                onMouseEnter={() => setHovered(n.gender ?? null)}
                className={({ isActive }) =>
                  cx(
                    'link-underline text-[12px] font-medium uppercase tracking-wide2 transition-colors',
                    isActive && !n.to.includes('?') ? 'text-gold-600' : 'text-ink',
                    n.label === 'Sale' && 'text-[#6E1E2B]',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* center logo */}
        <Logo className="shrink-0" />

        {/* right actions */}
        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <button className="p-2 hover:text-gold-600" aria-label="Search" onClick={() => dispatch(toggleSearch(true))}>
            <Search className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <Link to="/wishlist" className="relative hidden p-2 hover:text-gold-600 sm:block" aria-label="Wishlist">
            <Heart className="h-5 w-5" strokeWidth={1.6} />
            {wishCount > 0 && (
              <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-gold-500" />
            )}
          </Link>
          <button
            className="relative -mr-2 p-2 hover:text-gold-600"
            aria-label="Open bag"
            onClick={() => dispatch(openCart())}
          >
            <ShoppingBag className={cx('h-5 w-5 transition-transform', bump && 'scale-125')} strokeWidth={1.6} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mega menu (desktop) */}
      <div
        className={cx(
          'absolute inset-x-0 top-full hidden border-t border-ivory-300 bg-ivory shadow-soft transition-all duration-300 lg:block',
          hovered ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
        )}
        onMouseEnter={() => hovered && setHovered(hovered)}
      >
        {hovered && (
          <div className="container-x grid grid-cols-12 gap-8 py-8">
            <div className="col-span-3">
              <p className="eyebrow mb-4">Shop {hovered}</p>
              <ul className="space-y-2.5">
                <li>
                  <Link to={`/shop/${hovered}`} className="link-underline text-sm font-medium">
                    View all
                  </Link>
                </li>
                {categoriesByGender(hovered).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/shop/${hovered}/${c.slug}`} className="link-underline text-sm text-stone hover:text-ink">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-9 grid grid-cols-4 gap-4">
              {categoriesByGender(hovered)
                .slice(0, 4)
                .map((c) => (
                  <Link key={c.slug} to={`/shop/${hovered}/${c.slug}`} className="group relative overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 bg-ivory/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide2">
                      {c.name}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

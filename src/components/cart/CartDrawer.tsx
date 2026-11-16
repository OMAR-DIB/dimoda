import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeCart } from '../../store/uiSlice'
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartSubtotal,
} from '../../store/cartSlice'
import { QuantityStepper } from '../ui/QuantityStepper'
import { formatPrice } from '../../lib/format'
import { site } from '../../config/site'

export function CartDrawer() {
  const open = useAppSelector((s) => s.ui.cartOpen)
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dispatch(closeCart())
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, dispatch])

  if (!open) return null

  const remaining = site.freeDeliveryOver - subtotal
  const progress = Math.min(100, (subtotal / site.freeDeliveryOver) * 100)

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fadeIn" onClick={() => dispatch(closeCart())} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-soft animate-slideInRight">
        <header className="flex items-center justify-between border-b border-ivory-300 px-6 py-5">
          <h2 className="font-sans text-sm font-medium uppercase tracking-luxe">
            Your bag <span className="text-stone-light">({items.reduce((n, i) => n + i.quantity, 0)})</span>
          </h2>
          <button aria-label="Close" onClick={() => dispatch(closeCart())} className="p-1 hover:text-gold-600">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="mb-4 h-10 w-10 text-gold-500" strokeWidth={1.2} />
            <p className="text-2xl">Your bag is empty</p>
            <p className="mt-2 text-sm text-stone">Discover the new collection and find your next favourite piece.</p>
            <button className="btn-primary mt-8" onClick={() => { dispatch(closeCart()); navigate('/shop') }}>
              Start shopping
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <p className="text-xs text-stone">
                {remaining > 0 ? (
                  <>Add <span className="font-medium text-ink">{formatPrice(remaining)}</span> more for free delivery</>
                ) : (
                  <span className="font-medium text-gold-600">You've unlocked free delivery ✦</span>
                )}
              </p>
              <div className="mt-2 h-px w-full bg-ivory-300">
                <div className="h-px bg-gold-500 transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="drawer-scroll flex-1 divide-y divide-ivory-300 overflow-y-auto px-6">
              {items.map((it) => (
                <li key={it.key} className="flex gap-4 py-5 animate-fadeIn">
                  <Link to={`/product/${it.slug}`} onClick={() => dispatch(closeCart())} className="shrink-0">
                    <img src={it.image} alt={it.name} className="h-28 w-[84px] object-cover bg-ivory-200" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${it.slug}`}
                          onClick={() => dispatch(closeCart())}
                          className="block truncate text-sm font-medium hover:text-gold-600"
                        >
                          {it.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-stone">
                          {it.size} · {it.color}
                        </p>
                      </div>
                      <button
                        aria-label="Remove"
                        onClick={() => dispatch(removeFromCart(it.key))}
                        className="p-1 text-stone-light hover:text-ink"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <QuantityStepper
                        size="sm"
                        value={it.quantity}
                        onChange={(q) => dispatch(updateQuantity({ key: it.key, quantity: q }))}
                      />
                      <span className="text-sm font-medium tabular-nums">{formatPrice(it.price * it.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-ivory-300 bg-white px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-wide2 text-stone">Subtotal</span>
                <span className="text-lg font-medium tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-stone-light">Delivery calculated at checkout.</p>
              <button
                className="btn-gold mt-5 w-full"
                onClick={() => {
                  dispatch(closeCart())
                  navigate('/checkout')
                }}
              >
                Checkout via WhatsApp
              </button>
              <button
                className="mt-2 w-full py-2 text-[11px] uppercase tracking-wide2 text-stone hover:text-ink"
                onClick={() => {
                  dispatch(closeCart())
                  navigate('/cart')
                }}
              >
                View full bag
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeFromCart, updateQuantity, selectCartItems, selectCartSubtotal } from '../store/cartSlice'
import { QuantityStepper } from '../components/ui/QuantityStepper'
import { EmptyState } from '../components/ui/EmptyState'
import { formatPrice } from '../lib/format'
import { site } from '../config/site'

export default function Cart() {
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const dispatch = useAppDispatch()
  const delivery = subtotal >= site.freeDeliveryOver ? 0 : site.deliveryFee

  if (items.length === 0) {
    return (
      <div className="container-x">
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" strokeWidth={1} />}
          title="Your bag is empty"
          description="Add a few pieces and come back. Your bag is saved on this device."
          action={{ label: 'Browse the collection', to: '/shop' }}
        />
      </div>
    )
  }

  return (
    <div className="container-x pt-8 sm:pt-12">
      <p className="eyebrow">Your selection</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Shopping bag</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-ivory-300 border-y border-ivory-300">
          {items.map((it) => (
            <li key={it.key} className="flex gap-5 py-6 animate-fadeIn">
              <Link to={`/product/${it.slug}`} className="shrink-0">
                <img src={it.image} alt={it.name} className="h-36 w-28 object-cover bg-ivory-200 sm:h-44 sm:w-32" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={`/product/${it.slug}`} className="block text-base font-medium hover:text-gold-600 sm:text-lg">
                      {it.name}
                    </Link>
                    <p className="mt-1 text-sm text-stone">Size {it.size} · {it.color}</p>
                    <p className="mt-1 text-sm text-stone">{formatPrice(it.price)} each</p>
                  </div>
                  <span className="text-base font-medium tabular-nums sm:text-lg">{formatPrice(it.price * it.quantity)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <QuantityStepper size="sm" value={it.quantity} onChange={(q) => dispatch(updateQuantity({ key: it.key, quantity: q }))} />
                  <button onClick={() => dispatch(removeFromCart(it.key))} className="flex items-center gap-1.5 text-xs uppercase tracking-wide2 text-stone hover:text-ink">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-ivory-300 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="font-sans text-sm font-medium uppercase tracking-luxe">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-stone">Delivery</dt>
              <dd className="tabular-nums">{delivery === 0 ? <span className="text-gold-600">Free</span> : formatPrice(delivery)}</dd>
            </div>
            <div className="hairline" />
            <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(subtotal + delivery)}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-stone-light">Pickup from store is always free. Choose at checkout.</p>
          <Link to="/checkout" className="btn-gold mt-6 w-full">
            Checkout via WhatsApp <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-[11px] uppercase tracking-wide2 text-stone hover:text-ink">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

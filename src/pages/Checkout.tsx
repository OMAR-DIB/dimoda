import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, MessageCircle, Store, Truck, AlertTriangle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearCart, selectCartItems, selectCartSubtotal } from '../store/cartSlice'
import { EmptyState } from '../components/ui/EmptyState'
import { formatPrice, orderReference, cx } from '../lib/format'
import { site, isWhatsappConfigured } from '../config/site'
import { buildOrderMessage, whatsappLink } from '../lib/whatsapp'
import { saveOrder } from '../lib/orders'
import type { CustomerDetails, OrderPayload } from '../types'

const CUSTOMER_KEY = 'dimoda.customer.v1'

const loadCustomer = (): CustomerDetails => {
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY)
    if (raw) return { fulfillment: 'delivery', ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { name: '', phone: '', city: '', address: '', fulfillment: 'delivery', note: '' }
}

export default function Checkout() {
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState<CustomerDetails>(loadCustomer)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const deliveryFee = form.fulfillment === 'pickup' ? 0 : subtotal >= site.freeDeliveryOver ? 0 : site.deliveryFee
  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="container-x">
        <EmptyState title="Nothing to check out" description="Your bag is empty. Add some pieces first." action={{ label: 'Go shopping', to: '/shop' }} />
      </div>
    )
  }

  const set = (k: keyof CustomerDetails, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your name.'
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number.'
    if (form.fulfillment === 'delivery') {
      if (!form.city.trim()) e.city = 'City is required for delivery.'
      if (form.address.trim().length < 5) e.address = 'Please enter your full address.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const order: OrderPayload = {
      reference: orderReference(),
      customer: { ...form, name: form.name.trim(), phone: form.phone.trim() },
      items,
      subtotal,
      deliveryFee,
      total,
    }
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ ...form, note: '' }))
    } catch {
      /* ignore */
    }

    const message = buildOrderMessage(order)
    const link = whatsappLink(message)

    // Open WhatsApp first (must happen synchronously in the click handler for mobile browsers),
    // then persist the order in the background.
    const win = window.open(link, '_blank')
    if (!win) window.location.href = link

    void saveOrder(order)

    sessionStorage.setItem('dimoda.lastOrder', JSON.stringify({ ...order, message }))
    dispatch(clearCart())
    setSubmitting(false)
    navigate('/order/success', { replace: true })
  }

  return (
    <div className="container-x pt-8 sm:pt-12">
      <Link to="/cart" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide2 text-stone hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Back to bag
      </Link>
      <p className="eyebrow mt-6">Almost there</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-stone">
        Fill in your details and we'll open WhatsApp with your order ready to send. We confirm availability and
        delivery time in the chat. You pay on delivery or at pickup.
      </p>

      {!isWhatsappConfigured() && (
        <div className="mt-6 flex items-start gap-3 border border-gold-300 bg-gold-50 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
          <p>
            <span className="font-medium">Demo mode:</span> no WhatsApp number is configured yet. Set{' '}
            <code className="bg-white px-1">VITE_WHATSAPP_NUMBER</code> in your .env file. The order flow still works and will open WhatsApp
            with an empty recipient.
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-10">
          {/* fulfillment */}
          <section>
            <h2 className="font-sans text-sm font-medium uppercase tracking-luxe">1. How would you like it?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { v: 'delivery', icon: Truck, t: 'Home delivery', d: `${formatPrice(site.deliveryFee)} · free over ${formatPrice(site.freeDeliveryOver)}` },
                { v: 'pickup', icon: Store, t: 'Pickup from store', d: `${site.address} · Free` },
              ].map(({ v, icon: Icon, t, d }) => (
                <label
                  key={v}
                  className={cx(
                    'flex cursor-pointer items-start gap-3 border p-4 transition',
                    form.fulfillment === v ? 'border-ink bg-white' : 'border-ivory-300 hover:border-stone-light',
                  )}
                >
                  <input type="radio" name="fulfillment" value={v} checked={form.fulfillment === v} onChange={() => set('fulfillment', v)} className="sr-only" />
                  <Icon className={cx('mt-0.5 h-5 w-5', form.fulfillment === v ? 'text-gold-600' : 'text-stone')} strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium">{t}</p>
                    <p className="text-xs text-stone">{d}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* contact */}
          <section>
            <h2 className="font-sans text-sm font-medium uppercase tracking-luxe">2. Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input className={cx('field', errors.name && '!border-[#B3261E]')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jane Doe" autoComplete="name" />
              </Field>
              <Field label="Phone (WhatsApp)" error={errors.phone}>
                <input className={cx('field', errors.phone && '!border-[#B3261E]')} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 0000" inputMode="tel" autoComplete="tel" />
              </Field>
              {form.fulfillment === 'delivery' && (
                <>
                  <Field label="City" error={errors.city}>
                    <input className={cx('field', errors.city && '!border-[#B3261E]')} value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Your city" autoComplete="address-level2" />
                  </Field>
                  <Field label="Address" error={errors.address} className="sm:col-span-2">
                    <input className={cx('field', errors.address && '!border-[#B3261E]')} value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street, building, floor, landmarks" autoComplete="street-address" />
                  </Field>
                </>
              )}
              <Field label="Note (optional)" className="sm:col-span-2">
                <textarea className="field min-h-[90px]" value={form.note ?? ''} onChange={(e) => set('note', e.target.value)} placeholder="Preferred delivery time, gift wrap, alternative size…" />
              </Field>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit border border-ivory-300 bg-white p-6 lg:sticky lg:top-28">
          <h2 className="font-sans text-sm font-medium uppercase tracking-luxe">Order summary</h2>
          <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1 drawer-scroll">
            {items.map((it) => (
              <li key={it.key} className="flex gap-3">
                <div className="relative shrink-0">
                  <img src={it.image} alt="" className="h-20 w-16 object-cover bg-ivory-200" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[10px] text-ivory">{it.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <p className="text-xs text-stone">{it.size} · {it.color}</p>
                </div>
                <span className="text-sm tabular-nums">{formatPrice(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-ivory-300 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-stone">{form.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}</dt><dd className="tabular-nums">{deliveryFee === 0 ? <span className="text-gold-600">Free</span> : formatPrice(deliveryFee)}</dd></div>
            <div className="flex justify-between border-t border-ivory-300 pt-3 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
          <button type="submit" disabled={submitting} className="btn-whatsapp mt-6 w-full">
            <MessageCircle className="h-4 w-4" /> Send order on WhatsApp
          </button>
          <p className="mt-3 text-center text-[11px] text-stone-light">
            WhatsApp will open with your order pre-filled. Just press send.
          </p>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[#B3261E]">{error}</p>}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Copy, Check } from 'lucide-react'
import { whatsappLink } from '../lib/whatsapp'
import { formatPrice } from '../lib/format'
import type { OrderPayload } from '../types'

type StoredOrder = OrderPayload & { message: string }

export default function OrderSuccess() {
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('dimoda.lastOrder')
      if (raw) setOrder(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const copy = async () => {
    if (!order) return
    try {
      await navigator.clipboard.writeText(order.message)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="container-x flex flex-col items-center pt-16 text-center animate-fadeUp">
      <CheckCircle2 className="h-14 w-14 text-gold-500" strokeWidth={1.2} />
      <p className="eyebrow mt-6">Order prepared</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Thank you{order ? `, ${order.customer.name.split(' ')[0]}` : ''}.</h1>
      <p className="mt-4 max-w-md text-stone">
        WhatsApp should have opened with your order. Press <span className="font-medium text-ink">Send</span> there and we'll
        confirm everything in the chat.
      </p>

      {order && (
        <div className="mt-10 w-full max-w-lg border border-ivory-300 bg-white p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide2 text-stone">Reference</span>
            <span className="font-medium tabular-nums">{order.reference}</span>
          </div>
          <ul className="mt-4 divide-y divide-ivory-300 border-y border-ivory-300 text-sm">
            {order.items.map((it) => (
              <li key={it.key} className="flex justify-between gap-4 py-2.5">
                <span className="min-w-0 truncate">{it.quantity} × {it.name} <span className="text-stone">({it.size}, {it.color})</span></span>
                <span className="tabular-nums">{formatPrice(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between text-base font-medium">
            <span>Total</span>
            <span className="tabular-nums">{formatPrice(order.total)}</span>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href={whatsappLink(order.message)} target="_blank" rel="noreferrer" className="btn-whatsapp flex-1">
              <MessageCircle className="h-4 w-4" /> Open WhatsApp again
            </a>
            <button onClick={copy} className="btn-outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy order'}
            </button>
          </div>
        </div>
      )}

      <Link to="/shop" className="link-underline mt-10 text-[11px] font-medium uppercase tracking-wide2">
        Continue shopping
      </Link>
    </div>
  )
}

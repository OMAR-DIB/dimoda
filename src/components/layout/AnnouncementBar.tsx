import { site } from '../../config/site'
import { formatPrice } from '../../lib/format'

const messages = [
  `Free delivery on orders over ${formatPrice(site.freeDeliveryOver)}`,
  'New season arrivals — women & men',
  'Order in seconds via WhatsApp',
  'Exchanges within 7 days',
]

export function AnnouncementBar() {
  const items = [...messages, ...messages]
  return (
    <div className="overflow-hidden bg-ink text-ivory">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2 text-[11px] font-normal uppercase tracking-luxe">
        {items.map((m, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8">{m}</span>
            <span className="text-gold-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

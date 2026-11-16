import { site } from '../config/site'
import { formatPrice } from './format'
import type { OrderPayload, Product } from '../types'

const digits = () => site.whatsappNumber.replace(/\D/g, '')

/** Builds a wa.me link with a pre-filled message. Works on mobile and desktop without any API. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${digits()}?text=${encodeURIComponent(message)}`

export const buildOrderMessage = (order: OrderPayload) => {
  const { customer, items, subtotal, deliveryFee, total, reference } = order
  const lines: string[] = []

  lines.push(`🛍️ *New order — ${site.name}*`)
  lines.push(`Ref: *${reference}*`)
  lines.push('')
  lines.push('*Items*')
  items.forEach((it, i) => {
    lines.push(
      `${i + 1}. ${it.name}\n   Size: ${it.size} · Color: ${it.color} · Qty: ${it.quantity}\n   ${formatPrice(it.price)} × ${it.quantity} = ${formatPrice(it.price * it.quantity)}`,
    )
  })
  lines.push('')
  lines.push(`Subtotal: ${formatPrice(subtotal)}`)
  lines.push(
    `${customer.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'}: ${
      deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)
    }`,
  )
  lines.push(`*Total: ${formatPrice(total)}*`)
  lines.push('')
  lines.push('*Customer*')
  lines.push(`Name: ${customer.name}`)
  lines.push(`Phone: ${customer.phone}`)
  if (customer.fulfillment === 'delivery') {
    lines.push(`City: ${customer.city}`)
    lines.push(`Address: ${customer.address}`)
  } else {
    lines.push('Fulfillment: Pickup from store')
  }
  if (customer.note?.trim()) lines.push(`Note: ${customer.note.trim()}`)
  lines.push('')
  lines.push(`Sent from ${window.location.origin}`)

  return lines.join('\n')
}

export const buildProductInquiry = (product: Product, size?: string, color?: string) => {
  const url = `${window.location.origin}/product/${product.slug}`
  const parts = [`Hi ${site.name}! I'm interested in *${product.name}* (${formatPrice(product.price)}).`]
  if (size || color) parts.push(`Size: ${size ?? '-'} · Color: ${color ?? '-'}`)
  parts.push(`Is it available?`)
  parts.push(url)
  return parts.join('\n')
}

export const buildGeneralMessage = () => `Hi ${site.name}! I have a question about your collection.`

import { supabase, isSupabaseConfigured } from './supabase'
import type { OrderPayload } from '../types'

/**
 * Persists the order to Supabase (table: orders) when configured.
 * Failure is non-blocking: the WhatsApp message is the source of truth for the MVP.
 */
export async function saveOrder(order: OrderPayload): Promise<{ saved: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return { saved: false }

  const { error } = await supabase.from('orders').insert({
    reference: order.reference,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    city: order.customer.city || null,
    address: order.customer.address || null,
    fulfillment: order.customer.fulfillment,
    note: order.customer.note || null,
    items: order.items,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    status: 'pending',
    channel: 'whatsapp',
  })

  if (error) {
    console.warn('[orders] could not save order:', error.message)
    return { saved: false, error: error.message }
  }
  return { saved: true }
}

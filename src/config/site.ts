/**
 * Central store configuration.
 * Values prefixed with VITE_ come from your .env file (see .env.example).
 */
export const site = {
  name: 'DI MODA',
  tagline: 'Dress the moment.',
  description:
    'Curated fashion for women and men. Timeless pieces, modern silhouettes, delivered to your door.',

  /** WhatsApp number in international format, digits only (no +, spaces or dashes). */
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '',

  /** Currency shown across the store. */
  currency: (import.meta.env.VITE_CURRENCY as string | undefined) ?? 'USD',
  locale: (import.meta.env.VITE_LOCALE as string | undefined) ?? 'en-US',

  /** Delivery settings used on checkout. */
  deliveryFee: Number(import.meta.env.VITE_DELIVERY_FEE ?? 5),
  freeDeliveryOver: Number(import.meta.env.VITE_FREE_DELIVERY_OVER ?? 150),

  address: 'Main Street, City Center',
  hours: 'Daily 10:00 – 22:00',
  email: 'hello@dimoda.store',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
}

export const isWhatsappConfigured = () => site.whatsappNumber.replace(/\D/g, '').length >= 8

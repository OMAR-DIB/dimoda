# DI MODA — Store Website (MVP)

A fast, elegant storefront for browsing the DI MODA collection and ordering via
WhatsApp — no accounts, no payment gateway, no admin dashboard yet. Built with
React + TypeScript + Redux Toolkit + Tailwind CSS, with Supabase as an optional
database (falls back to bundled mock data when not configured).

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## WhatsApp ordering (the core feature)

This uses the simplest possible integration: **`wa.me` deep links** — no WhatsApp
Business API, no Meta app review, no backend. When a customer checks out, the app
builds a formatted order message (items, sizes, colors, totals, their delivery
details) and opens:

```
https://wa.me/<your-number>?text=<the order, pre-filled>
```

On a phone this opens the WhatsApp app directly in a chat with your number, message
already typed — the customer just taps **Send**. On desktop it opens WhatsApp Web the
same way.

**To activate it, add your number to `.env`:**

1. Copy the example file: `cp .env.example .env`
2. Set `VITE_WHATSAPP_NUMBER` to your WhatsApp number in international format,
   digits only — no `+`, spaces, or dashes.
   Example: `+1 (555) 123-4567` → `VITE_WHATSAPP_NUMBER=15551234567`
3. Restart `npm run dev` (Vite only reads `.env` on startup).

Until a number is set, the storefront still works end-to-end in "demo mode" — the
checkout page shows a small notice, and WhatsApp still opens, just without a
pre-selected recipient.

Every order is also sent to `saveOrder()` in [`src/lib/orders.ts`](src/lib/orders.ts),
which writes to a Supabase `orders` table **if** Supabase is configured — this is
optional and never blocks the WhatsApp flow, which is the real source of truth at
this stage.

## Supabase (optional, free tier)

Not required to run the app — without it, the site serves 40 bundled mock products
(women + men, real stock photos, varied prices/sizes/colors). To connect a real
database later:

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor
   — creates `products` and `orders` tables with sane defaults and public-read policies.
3. Add to `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```
4. Restart the dev server. Products now load from Supabase; mock data is the
   fallback whenever the table is empty or unreachable.

## Project structure

```
src/
  components/    UI building blocks, layout (header/footer/menus), product card, cart drawer
  pages/         Home, Shop, ProductDetail, Cart, Checkout, OrderSuccess, Wishlist, About, NotFound
  store/         Redux Toolkit slices: cart, wishlist, ui, catalog
  lib/           whatsapp.ts, catalog.ts, orders.ts, supabase.ts, format.ts
  data/          mock products.ts + categories.ts (used when Supabase isn't configured)
  config/site.ts Store name, currency, delivery fee, address — all env-overridable
```

## Scripts

| Command           | Description                      |
| ------------------ | --------------------------------- |
| `npm run dev`       | Start the dev server with HMR     |
| `npm run build`     | Type-check and build for production (outputs to `dist/`) |
| `npm run preview`   | Preview the production build locally |

## Deploying

Build output is static (`dist/`) — deploy to Vercel, Netlify, or any static host.
On Vercel: import the repo, framework preset "Vite", and add the same env vars from
`.env` in the project's Environment Variables settings before the first deploy.

## What's intentionally NOT in this MVP

- No admin dashboard — products are code/Supabase-managed for now.
- No payment gateway — cash on delivery / pay at pickup, confirmed over WhatsApp.
- No customer accounts or login.
- No inventory/ERP integration — a future phase once the owner's internal system is understood.

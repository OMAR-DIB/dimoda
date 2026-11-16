# DI MODA — Project Status

**The app is installed, type-checks cleanly, builds for production, and runs in dev.**
The earlier install failures (Windows file-lock EPERM, a broken experimental TypeScript 7
toolchain) were caused by the Vite scaffold landing on bleeding-edge/beta package
versions. Fixed by pinning to the stable line: `typescript ^5.6`, `vite ^5.4`,
`@vitejs/plugin-react ^4.3`. Also fixed two lucide-react icon imports (`Instagram`/
`Facebook` were dropped from the current icon set) with small inline SVGs in
[`Footer.tsx`](src/components/layout/Footer.tsx).

## WhatsApp ordering — confirmed working (simplest approach)

Uses `wa.me` deep links — no WhatsApp Business API, no Meta approval needed. Verified
the exact message/link output with a standalone script simulating a real checkout
(two items, delivery address, note) — output was a correctly `encodeURIComponent`-escaped
`https://wa.me/<number>?text=...` URL with a readable, WhatsApp-markdown-formatted
message (bold headers via `*asterisks*`, itemized lines, totals, customer details).

**To go live with it:** put the real store WhatsApp number in `.env` as
`VITE_WHATSAPP_NUMBER` (digits only, international format — see `.env.example`), then
restart the dev server or redeploy. That's the entire "integration" — no further setup,
no webhook, no backend. Full explanation is in [README.md](README.md).

A local `.env` was created during this session with a **placeholder** test number
(`15551234567`) just to verify the flow end-to-end — replace it with the real number
before going live, and don't commit it (`.env` is gitignored).

## What's in the repo now

- All pages, Redux store, Tailwind styling, mock catalog (40 products) — unchanged from
  before, see the file tree in `src/`.
- `.env.example` — documents every env var (WhatsApp number, Supabase, currency, delivery fee).
- `postcss.config.js` — was missing, now present (required for Tailwind v3).
- `supabase/schema.sql` — new. Full SQL to create `products` + `orders` tables with RLS
  policies (public read on active products, public insert-only on orders), plus one seed
  row. Not yet run against a real Supabase project — that's the next step whenever the
  user wants to move off mock data.
- `README.md` — rewritten from the generic Vite template into real project docs covering
  setup, the WhatsApp flow, Supabase setup, scripts, and deployment notes.
- `.gitignore` — added explicit `.env` / `.env.*` (keeping `.env.example` tracked).

## Still outstanding / not yet done

1. **Real WhatsApp number** — currently a placeholder in `.env`. Get the store's actual
   WhatsApp number from the user and swap it in before any real customer sees the site.
2. **Supabase not yet connected** — schema file exists but was never run against an
   actual Supabase project. App runs entirely on mock data until that happens. This was
   flagged as something the user wants to do together.
3. **Visual/UX QA pass** — the app compiles and serves correctly (verified via curl +
   Vite's module transform + a clean `tsc`/`vite build`), but there has been no actual
   browser-rendered visual check of layout, animations, responsive behavior, or the cart
   drawer/search overlay/mobile menu interactions. Worth a manual click-through before
   calling it demo-ready.
4. **No admin dashboard** — intentionally out of scope per the original request.
5. **No deployment** — user said they'll handle Vercel hosting themselves; just needs the
   same env vars added in Vercel's project settings.
6. **Real product photos/catalog** — still Unsplash stock placeholders; swapping in the
   actual store's inventory is a later phase, pending the owner's system/photos.

## Dev server

Currently running in the background on `http://localhost:5173` for this session with the
placeholder WhatsApp number set. Restart anytime with `npm run dev`.

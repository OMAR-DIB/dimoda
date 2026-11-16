-- DI MODA — Supabase schema (optional, free tier)
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Matches the shape expected by src/lib/catalog.ts and src/lib/orders.ts.

-- ─────────────────────────────────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id              text primary key,                 -- e.g. 'w-001'
  slug            text unique not null,              -- e.g. 'aurelia-silk-slip-dress'
  name            text not null,
  gender          text not null check (gender in ('women', 'men')),
  category        text not null,                     -- matches src/data/categories.ts slugs
  price           numeric(10,2) not null,
  compare_at_price numeric(10,2),
  images          jsonb not null default '[]',        -- array of image URLs
  colors          jsonb not null default '[]',        -- [{ "name": "Black", "hex": "#1C1A17" }, ...]
  sizes           jsonb not null default '[]',        -- ["XS","S","M","L","XL"]
  description     text not null default '',
  details         jsonb not null default '[]',        -- array of bullet strings
  tags            jsonb not null default '[]',        -- any of: new | bestseller | sale | limited
  rating          numeric(2,1),
  review_count    integer default 0,
  in_stock        boolean not null default true,
  is_active       boolean not null default true,      -- soft hide without deleting
  created_at      timestamptz not null default now()
);

create index if not exists products_gender_idx on public.products (gender);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (is_active);

alter table public.products enable row level security;

-- Public (anon) can read active products only. No write access from the client.
create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

-- ─────────────────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null,                      -- e.g. 'DM-261115-AB12'
  customer_name   text not null,
  customer_phone  text not null,
  city            text,
  address         text,
  fulfillment     text not null check (fulfillment in ('delivery', 'pickup')),
  note            text,
  items           jsonb not null,                      -- array of CartItem as sent to WhatsApp
  subtotal        numeric(10,2) not null,
  delivery_fee    numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  status          text not null default 'pending',     -- pending | confirmed | fulfilled | cancelled
  channel         text not null default 'whatsapp',
  created_at      timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- Anon (storefront) can INSERT new orders, but cannot read, update, or delete
-- anyone's orders back — that stays admin-only (service role, or a future dashboard).
create policy "Public can insert orders"
  on public.orders for insert
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Optional: seed a handful of rows to confirm the connection works end to end.
-- Delete this block once you're loading real products.
-- ─────────────────────────────────────────────────────────────────────────
insert into public.products (id, slug, name, gender, category, price, images, colors, sizes, description, tags, rating, review_count, in_stock)
values
  (
    'seed-001', 'seed-aurelia-dress', 'Aurelia Silk Slip Dress (seed)', 'women', 'dresses', 189,
    '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80"]',
    '[{"name":"Ivory","hex":"#EDE8DC"},{"name":"Black","hex":"#1C1A17"}]',
    '["XS","S","M","L","XL"]',
    'A bias-cut slip dress in fluid silk satin that skims the body.',
    '["new","bestseller"]', 4.9, 124, true
  )
on conflict (id) do nothing;

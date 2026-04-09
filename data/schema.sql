-- GlowCompare — Supabase Schema
-- Run this in the Supabase SQL Editor for your project.
-- Safe to re-run: uses IF NOT EXISTS / DO blocks.

-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
do $$ begin
  create type category_type as enum ('skincare', 'makeup');
exception when duplicate_object then null; end $$;

do $$ begin
  create type platform_type as enum ('nykaa', 'tira', 'amazon', 'flipkart', 'purplle');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sub_category_type as enum (
    -- Skincare
    'cleanser', 'moisturiser', 'serum', 'sunscreen', 'toner', 'eye_cream',
    -- Makeup
    'foundation', 'concealer', 'blush', 'lipstick', 'mascara', 'eyeshadow'
  );
exception when duplicate_object then null; end $$;

-- ─────────────────────────────────────────────
-- TABLE: products
-- ─────────────────────────────────────────────
create table if not exists products (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  brand               text not null,
  category            category_type not null,
  sub_category        sub_category_type not null,
  description         text not null,
  image_url           text not null,
  ingredients_summary text not null,
  trending_score      numeric(5,2) not null default 0 check (trending_score >= 0 and trending_score <= 100),
  created_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: platform_prices
-- ─────────────────────────────────────────────
create table if not exists platform_prices (
  id             uuid primary key default uuid_generate_v4(),
  product_id     uuid not null references products(id) on delete cascade,
  platform       platform_type not null,
  price          numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) not null check (original_price >= 0),
  discount_pct   numeric(5,2) not null default 0 check (discount_pct >= 0 and discount_pct <= 100),
  url            text not null,
  availability   boolean not null default true,
  last_updated   timestamptz not null default now(),
  unique (product_id, platform)
);

-- ─────────────────────────────────────────────
-- TABLE: trending_signals
-- ─────────────────────────────────────────────
create table if not exists trending_signals (
  id                uuid primary key default uuid_generate_v4(),
  product_id        uuid not null references products(id) on delete cascade unique,
  social_score      numeric(5,2) not null default 0 check (social_score >= 0 and social_score <= 100),
  bestseller_score  numeric(5,2) not null default 0 check (bestseller_score >= 0 and bestseller_score <= 100),
  rating_score      numeric(5,2) not null default 0 check (rating_score >= 0 and rating_score <= 100),
  search_score      numeric(5,2) not null default 0 check (search_score >= 0 and search_score <= 100),
  editorial_score   numeric(5,2) not null default 0 check (editorial_score >= 0 and editorial_score <= 100),
  composite_score   numeric(5,2) not null default 0 check (composite_score >= 0 and composite_score <= 100),
  updated_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: wishlist
-- (users table is managed by Supabase Auth — auth.users)
-- ─────────────────────────────────────────────
create table if not exists wishlist (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_id   uuid not null references products(id) on delete cascade,
  alert_price  numeric(10,2) check (alert_price > 0),
  alert_active boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
create index if not exists idx_products_category         on products(category);
create index if not exists idx_products_sub_category     on products(sub_category);
create index if not exists idx_products_trending_score   on products(trending_score desc);
create index if not exists idx_products_brand            on products(brand);
create index if not exists idx_platform_prices_product   on platform_prices(product_id);
create index if not exists idx_trending_signals_product  on trending_signals(product_id);
create index if not exists idx_wishlist_user             on wishlist(user_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- products — public read
alter table products enable row level security;
create policy "Public can read products"
  on products for select using (true);

-- platform_prices — public read
alter table platform_prices enable row level security;
create policy "Public can read platform_prices"
  on platform_prices for select using (true);

-- trending_signals — public read
alter table trending_signals enable row level security;
create policy "Public can read trending_signals"
  on trending_signals for select using (true);

-- wishlist — users own their rows
alter table wishlist enable row level security;
create policy "Users can view own wishlist"
  on wishlist for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist"
  on wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist"
  on wishlist for delete using (auth.uid() = user_id);
create policy "Users can update own wishlist"
  on wishlist for update using (auth.uid() = user_id);

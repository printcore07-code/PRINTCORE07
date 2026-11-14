-- Run this one-time migration in Supabase SQL Editor before using the new category filters.
-- It safely adds a category field to your existing products table.
alter table public.products
add column if not exists category text not null default 'Wall Posters';

-- Existing products will be categorized as Wall Posters by default.
-- You can change each product's category from the Admin dashboard.

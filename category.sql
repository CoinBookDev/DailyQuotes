-- Alleen uitvoeren als de kolom 'category' nog niet bestaat:
alter table public.quotes
add column if not exists category text default 'Leven';

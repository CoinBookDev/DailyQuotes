-- DailyQuotes Media setup for Supabase
-- Run this in Supabase SQL Editor.

create table if not exists public.media_posts (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null unique,
  caption text default '',
  created_at timestamptz not null default now()
);

alter table public.media_posts enable row level security;

-- Anyone can view the public media feed.
drop policy if exists "Public can view media posts" on public.media_posts;
create policy "Public can view media posts"
on public.media_posts
for select
to anon, authenticated
using (true);

-- Only users in admin_users can create/delete posts.
drop policy if exists "Admins can create media posts" on public.media_posts;
create policy "Admins can create media posts"
on public.media_posts
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can delete media posts" on public.media_posts;
create policy "Admins can delete media posts"
on public.media_posts
for delete
to authenticated
using (public.is_admin());

-- Storage bucket for uploaded images/videos.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone may read files from the public media bucket.
drop policy if exists "Public can view media files" on storage.objects;
create policy "Public can view media files"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

-- Only admins may upload files.
drop policy if exists "Admins can upload media files" on storage.objects;
create policy "Admins can upload media files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.is_admin()
);

-- Only admins may delete files.
drop policy if exists "Admins can delete media files" on storage.objects;
create policy "Admins can delete media files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and public.is_admin()
);

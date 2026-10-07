# DailyQuotes Media setup

The media feature now uses Supabase instead of trying to write `media.json` on GitHub Pages.

## 1. Run the SQL
Open Supabase -> SQL Editor and run `media.sql`.

This creates:
- `media_posts` table
- the public `media` Storage bucket
- RLS policies so anyone can view posts/files
- admin-only upload/delete policies using your existing `public.is_admin()` function

Your existing `admin_users` setup is used for admin permissions.

## 2. Deploy these files to GitHub
Replace the files in your repository with this version.

The site does NOT need `server.js` for GitHub Pages. GitHub Pages cannot run the Express server.

## 3. Use the admin page
Log in normally at `admin.html`. You will see a Media section where an admin can:
- choose an image or MP4/WebM/OGG video
- add a caption
- post it
- see existing posts
- delete posts

The public `media.html` automatically loads the posts from Supabase.

## Important
The Supabase publishable key in `config.js` is intended to be used in browser code. Security comes from Supabase Auth + RLS, not from hiding this key.

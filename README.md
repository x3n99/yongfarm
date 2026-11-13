# Yong Farm

Yong Farm is an Astro server-rendered application using Supabase (Postgres, Auth, and Row Level Security).

## Requirements

- Node.js 20.19+, 22.12+, or 24+
- A Supabase project

## Supabase setup

1. In the Supabase SQL Editor, run `supabase/migrations/20261113000000_initial_schema.sql`.
2. Run `supabase/seed.sql` if you want the example products and prices.
3. Create an admin user in **Authentication → Users**. In the SQL Editor, give that account the server-managed app metadata role:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   Replace the example email with the account you created. Do not put an admin role in user-editable metadata.
4. Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the Supabase project API settings. The publishable/anon key is intended for browser-facing applications; never use or expose the `service_role` secret.
5. To migrate existing records from MySQL, export the tables `produk`, `harga`, `produksi`, `penjualan`, and `pesanan` as CSV and import them into their matching Supabase tables. Import products before prices, sales, and orders. `users` is replaced by Supabase Auth; do not import it.
6. If importing rows with explicit IDs, reset each identity sequence after import so newly created rows do not reuse an existing ID:

   ```sql
   select setval(pg_get_serial_sequence('public.produk', 'id_produk'), greatest(coalesce(max(id_produk), 1), 1), max(id_produk) is not null) from public.produk;
   select setval(pg_get_serial_sequence('public.harga', 'id_harga'), greatest(coalesce(max(id_harga), 1), 1), max(id_harga) is not null) from public.harga;
   select setval(pg_get_serial_sequence('public.produksi', 'id_produksi'), greatest(coalesce(max(id_produksi), 1), 1), max(id_produksi) is not null) from public.produksi;
   select setval(pg_get_serial_sequence('public.penjualan', 'id_penjualan'), greatest(coalesce(max(id_penjualan), 1), 1), max(id_penjualan) is not null) from public.penjualan;
   select setval(pg_get_serial_sequence('public.pesanan', 'id'), greatest(coalesce(max(id), 1), 1), max(id) is not null) from public.pesanan;
   ```

RLS is enabled for every application table. Products and prices are publicly readable, public visitors may submit pending orders, and operational data is restricted to users whose Supabase **app metadata** has `role: admin`.

## Run locally

```sh
npm install
npm run dev
```

## Deploy to Vercel

1. Import the project into Vercel and set the **Root Directory** to this project.
2. Select the **Astro** framework preset. Use `npm run build` as the build command.
3. Disable the **Output Directory** override so `@astrojs/vercel` can configure its output. If Vercel requires an explicit directory, set it to `.vercel/output`. Do not use `dist` or `dist/server/entry.mjs`.
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` under **Project Settings → Environment Variables** for Production (and Preview if needed). Use the Supabase publishable/anon key, never the `service_role` secret.
5. Redeploy after changing settings or environment variables. If a function still tries to import `dist/server/entry.mjs`, clear the Vercel build cache and redeploy the latest commit; the build log should show `adapter: @astrojs/vercel`.

`npm run build` runs Astro diagnostics, TypeScript checks, and the production build. Reports can be exported as CSV or printed/saved to PDF from the browser.

# Yong Farm

Yong Farm is an Astro server-rendered farm and egg-ordering website. Supabase provides authentication and the application database.

## Requirements

- Node.js 22.12 or newer
- npm
- A Supabase project

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase project API settings.
3. Run the migration in `supabase/migrations/20261113000000_initial_schema.sql` from the Supabase SQL Editor. Optionally run `supabase/seed.sql` to add sample products.
4. Start Astro:

   ```sh
   npm run dev
   ```

Never use the Supabase `service_role` secret as the anon/publishable key or expose it to the browser.

## Create an administrator

Create a user in **Supabase Dashboard → Authentication → Users**, then grant the server-managed role in the SQL Editor:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';
```

Replace the example email with the user you created. Do not put an administrator role in user-editable metadata.

## Deploy to Vercel

1. Import the project and set its Root Directory to the folder containing `package.json`.
2. The root `vercel.json` configures the Astro framework, `npm run build`, and `.vercel/output`. Do not set `dist` or `dist/server/entry.mjs` as the output directory.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the Vercel Production environment (and Preview if required).
4. Redeploy the latest source. The build log should show `output: "server"` and `adapter: @astrojs/vercel`. If a deployment still tries to import `dist/server/entry.mjs`, clear the build cache and verify the deployment includes `astro.config.mjs`, `package.json`, and `vercel.json`.

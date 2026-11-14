import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
  if (request.headers.get('origin') !== url.origin) return new Response('Invalid request origin.', { status: 403 });
  const { error } = await locals.supabase.auth.signOut();
  if (error) throw new Error(`Supabase sign out failed: ${error.message}`);
  return redirect('/auth', 303);
};

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
  if (request.headers.get('origin') !== url.origin) return new Response('Invalid request origin.', { status: 403 });
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return redirect('/auth?error=Email%20and%20password%20are%20required', 303);
  const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
  if (error) return redirect(`/auth?error=${encodeURIComponent('Sign in failed. Check your credentials.')}`, 303);
  const { data } = await locals.supabase.auth.getUser();
  if (data.user?.app_metadata.role !== 'admin') {
    await locals.supabase.auth.signOut();
    return new Response('Administrator access is required.', { status: 403 });
  }
  return redirect('/dashboard', 303);
};

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals, redirect, url }) => {
  if (request.headers.get('origin') !== url.origin) return new Response('Invalid request origin.', { status: 403 });
  const form = await request.formData();
  const identifier = String(form.get('identifier') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!identifier || !password) {
    return redirect(`/auth?error=${encodeURIComponent('Username or email and password are required.')}`, 303);
  }

  let email = identifier;
  if (!identifier.includes('@')) {
    const supabaseUrl = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
    const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl) {
      throw new Error('Username login requires SUPABASE_URL.');
    }
    if (!serviceRoleKey) {
      throw new Error('Username login requires SUPABASE_SERVICE_ROLE_KEY. Add it as a server-only environment variable.');
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: profile, error: profileError } = await adminClient
      .from('profiles').select('id').eq('username', identifier).maybeSingle();
    if (profileError) throw new Error(`Unable to look up login username: ${profileError.message}`);
    if (!profile) {
      return redirect(`/auth?error=${encodeURIComponent('Sign in failed. Check your credentials.')}`, 303);
    }

    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(profile.id);
    if (userError) throw new Error(`Unable to look up login account: ${userError.message}`);
    if (!userData.user.email) {
      return redirect(`/auth?error=${encodeURIComponent('Sign in failed. Check your credentials.')}`, 303);
    }
    email = userData.user.email;
  }

  const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
  if (error) return redirect(`/auth?error=${encodeURIComponent('Sign in failed. Check your credentials.')}`, 303);
  const { data } = await locals.supabase.auth.getUser();
  if (data.user?.app_metadata.role !== 'admin') {
    await locals.supabase.auth.signOut();
    return new Response('Administrator access is required.', { status: 403 });
  }
  return redirect('/dashboard', 303);
};

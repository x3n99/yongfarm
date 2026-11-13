import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = import.meta.env.SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return new Response('Set SUPABASE_URL and SUPABASE_ANON_KEY to run Yong Farm.', {
      status: 503,
    });
  }

  const cookieHeader = context.request.headers.get('cookie') ?? '';
  context.locals.supabase = createServerClient(url, key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    },
    cookies: {
      getAll: () => cookieHeader.split(';').flatMap((cookie) => {
        const separator = cookie.indexOf('=');
        if (separator < 0) return [];
        const name = cookie.slice(0, separator).trim();
        const value = cookie.slice(separator + 1).trim();
        if (!name) return [];
        const safeValue = value.replace(/%(?![\da-f]{2})/gi, '%25');
        return [{ name, value: decodeURIComponent(safeValue) }];
      }),
      setAll: (cookies) => {
        cookies.forEach(({ name, value, options }) => {
          context.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await context.locals.supabase.auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError') {
    throw error;
  }
  context.locals.user = data.user;

  const protectedPaths = ['/dashboard', '/production', '/sales', '/stock', '/prices', '/orders', '/reports', '/api/reports.csv'];
  const path = context.url.pathname.replace(/\/+$/, '') || '/';
  if (protectedPaths.includes(path)) {
    if (!data.user) return context.redirect('/auth?error=Please%20sign%20in%20first');
    if (data.user.app_metadata.role !== 'admin') {
      return new Response('Administrator access is required.', { status: 403 });
    }
  }

  return next();
});

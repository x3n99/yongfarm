import { gt as defineMiddleware, t as sequence } from "./chunks/sequence_JKH1RvZ7.mjs";
import { createServerClient } from "@supabase/ssr";
// src/middleware.ts
var onRequest$1 = defineMiddleware(async (context, next) => {
	const url = "https://dqkkfigzpsafrerzmbfx.supabase.co";
	const key = "sb_publishable_lMD3dOM4c8bYxdKd9uAMaA_LIPZ8yG1";
	const cookieHeader = context.request.headers.get("cookie") ?? "";
	context.locals.supabase = createServerClient(url, key, {
		cookieOptions: {
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/"
		},
		cookies: {
			getAll: () => cookieHeader.split(";").flatMap((cookie) => {
				const separator = cookie.indexOf("=");
				if (separator < 0) return [];
				const name = cookie.slice(0, separator).trim();
				const value = cookie.slice(separator + 1).trim();
				if (!name) return [];
				const safeValue = value.replace(/%(?![\da-f]{2})/gi, "%25");
				return [{
					name,
					value: decodeURIComponent(safeValue)
				}];
			}),
			setAll: (cookies) => {
				cookies.forEach(({ name, value, options }) => {
					context.cookies.set(name, value, options);
				});
			}
		}
	});
	const { data, error } = await context.locals.supabase.auth.getUser();
	if (error && error.name !== "AuthSessionMissingError") throw error;
	context.locals.user = data.user;
	const protectedPaths = [
		"/dashboard",
		"/production",
		"/sales",
		"/stock",
		"/prices",
		"/orders",
		"/reports",
		"/api/reports.csv"
	];
	const path = context.url.pathname.replace(/\/+$/, "") || "/";
	if (protectedPaths.includes(path)) {
		if (!data.user) return context.redirect("/auth?error=Please%20sign%20in%20first");
		if (data.user.app_metadata.role !== "admin") return new Response("Administrator access is required.", { status: 403 });
	}
	return next();
});
// \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
export { onRequest };

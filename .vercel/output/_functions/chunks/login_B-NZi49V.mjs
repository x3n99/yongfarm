import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
// src/pages/api/login.ts
var login_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, locals, redirect, url }) => {
	if (request.headers.get("origin") !== url.origin) return new Response("Invalid request origin.", { status: 403 });
	const form = await request.formData();
	const email = String(form.get("email") ?? "").trim();
	const password = String(form.get("password") ?? "");
	if (!email || !password) return redirect("/auth?error=Email%20and%20password%20are%20required", 303);
	const { error } = await locals.supabase.auth.signInWithPassword({
		email,
		password
	});
	if (error) return redirect(`/auth?error=${encodeURIComponent("Sign in failed. Check your credentials.")}`, 303);
	const { data } = await locals.supabase.auth.getUser();
	if (data.user?.app_metadata.role !== "admin") {
		await locals.supabase.auth.signOut();
		return new Response("Administrator access is required.", { status: 403 });
	}
	return redirect("/dashboard", 303);
};
// \0virtual:astro:page:src/pages/api/login@_@ts
var page = () => login_exports;
export { page };

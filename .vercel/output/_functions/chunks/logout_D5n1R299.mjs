import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
// src/pages/api/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, locals, redirect, url }) => {
	if (request.headers.get("origin") !== url.origin) return new Response("Invalid request origin.", { status: 403 });
	const { error } = await locals.supabase.auth.signOut();
	if (error) throw new Error(`Supabase sign out failed: ${error.message}`);
	return redirect("/", 303);
};
// \0virtual:astro:page:src/pages/api/logout@_@ts
var page = () => logout_exports;
export { page };

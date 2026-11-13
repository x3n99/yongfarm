import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { n as createComponent, t as $$BaseLayout } from "./BaseLayout_BnSH7keM.mjs";
// src/pages/auth.astro
var auth_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Auth,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Auth = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Auth;
	if (Astro.locals.user) return Astro.redirect("/dashboard");
	const error = Astro.url.searchParams.get("error");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Sign in" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="auth-wrap"><section class="panel auth-card"><a class="auth-back" href="/">← Back to Yong Farm</a><h1>Yong Farm</h1><p class="muted">Sign in to access the administration dashboard.</p>${error && renderTemplate`<p class="notice">${error}</p>`}<form method="post" action="/api/login"><label>Email<input type="email" name="email" autocomplete="username" required></label><label>Password<input type="password" name="password" autocomplete="current-password" required></label><button type="submit">Sign in</button></form><p class="muted" style="margin-top: 1rem">Admin accounts are managed in Supabase Auth.</p></section></main>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/auth.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/auth.astro";
var $$url = "/auth";
// \0virtual:astro:page:src/pages/auth@_@astro
var page = () => auth_exports;
export { page };

import { C as renderComponent, N as addAttribute, O as renderTemplate, T as renderSlot, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { n as createComponent, t as $$BaseLayout } from "./BaseLayout_BnSH7keM.mjs";
import { a as requireAdmin } from "./data_DGCQAzsc.mjs";
// src/components/AdminLayout.astro
createAstro("https://astro.build");
var $$AdminLayout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdminLayout;
	const { title } = Astro.props;
	const user = await requireAdmin(Astro);
	if (user instanceof Response) return user;
	const navigation = [
		["/dashboard", "Dashboard"],
		["/production", "Production"],
		["/sales", "Sales"],
		["/stock", "Stock"],
		["/prices", "Prices"],
		["/orders", "Orders"],
		["/reports", "Reports"]
	];
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="admin-shell"><aside class="sidebar"><a class="brand" href="/dashboard"><img src="https://x3n99.github.io/logotelur.png" alt=""> Yong Farm</a><nav aria-label="Admin navigation">${navigation.map(([href, label]) => renderTemplate`<a${addAttribute(["nav-link", Astro.url.pathname === href && "active"], "class:list")}${addAttribute(Astro.url.pathname === href ? "page" : void 0, "aria-current")}${addAttribute(href, "href")}>${label}</a>`)}</nav><form method="post" action="/api/logout"><button class="nav-link logout" type="submit">Sign out</button></form></aside><main class="admin-main"><header class="topbar"><span>${title}</span><span class="user-label">Admin</span></header><div class="page-content">${renderSlot($$result, $$slots["default"])}</div><footer class="footer">&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Yong Farm</footer></main></div>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/components/AdminLayout.astro", void 0);
export { $$AdminLayout as t };

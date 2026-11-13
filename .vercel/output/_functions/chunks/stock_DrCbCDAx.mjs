import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { t as loadDashboard } from "./data_DGCQAzsc.mjs";
// src/pages/stock.astro
var stock_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Stock,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Stock = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Stock;
	const stats = await loadDashboard(Astro.locals.supabase);
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Stock" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel"><h1>Egg stock</h1><p class="muted">Stock is calculated as total production minus total sales.</p><p><strong style="font-size:2.5rem">${stats.stock.toLocaleString()} eggs</strong></p><p><a href="/production">View production</a> &middot; <a href="/sales">View sales</a></p></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/stock.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/stock.astro";
var $$url = "/stock";
// \0virtual:astro:page:src/pages/stock@_@astro
var page = () => stock_exports;
export { page };

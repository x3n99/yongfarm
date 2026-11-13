import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { a as requireAdmin, t as loadDashboard } from "./data_DGCQAzsc.mjs";
import { r as formatMoney } from "./dates_C_T01N82.mjs";
// src/pages/dashboard.astro
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Dashboard,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Dashboard;
	const user = await requireAdmin(Astro);
	if (user instanceof Response) return user;
	const stats = await loadDashboard(Astro.locals.supabase);
	const max = Math.max(1, ...stats.chart.flatMap((day) => [day.production, day.sales]));
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="stats"><article class="stat-card">Total stock<strong>${stats.stock.toLocaleString()} eggs</strong></article><article class="stat-card">Production today<strong>${stats.todayProduction.toLocaleString()} eggs</strong></article><article class="stat-card">Production this month<strong>${stats.monthProduction.toLocaleString()} eggs</strong></article><article class="stat-card">Sales this month<strong>${stats.monthSales.toLocaleString()} eggs</strong></article><article class="stat-card">Revenue this month<strong>${formatMoney(stats.monthRevenue)}</strong></article></div><section class="panel"><div class="section-heading"><div><h2>Production &amp; sales</h2><p class="muted">Last seven days, measured in eggs</p></div><span class="muted">■ Production &nbsp; <span style="color:#c69a3a">■ Sales</span></span></div><div class="bar-chart">${stats.chart.map((day) => renderTemplate`<div class="bar-day"><div class="bar-pair"><span class="bar"${addAttribute(`${day.production} produced`, "title")}${addAttribute(`height:${Math.max(3, day.production / max * 100)}%`, "style")}></span><span class="bar sales"${addAttribute(`${day.sales} sold`, "title")}${addAttribute(`height:${Math.max(3, day.sales / max * 100)}%`, "style")}></span></div><small>${(/* @__PURE__ */ new Date(`${day.date}T00:00:00`)).toLocaleDateString("en", {
		day: "numeric",
		month: "short"
	})}</small></div>`)}</div></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/dashboard.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/dashboard.astro";
var $$url = "/dashboard";
// \0virtual:astro:page:src/pages/dashboard@_@astro
var page = () => dashboard_exports;
export { page };

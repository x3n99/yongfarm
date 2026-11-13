import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as renderScript } from "./script_D2PPZmfR.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { n as loadReports } from "./data_DGCQAzsc.mjs";
import { r as formatMoney } from "./dates_C_T01N82.mjs";
// src/pages/reports.astro
var reports_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Reports,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Reports = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Reports;
	const filter = Astro.url.searchParams.get("filter") ?? "monthly";
	const from = Astro.url.searchParams.get("from") ?? "";
	const to = Astro.url.searchParams.get("to") ?? "";
	const data = await loadReports(Astro.locals.supabase, filter, from, to);
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Reports" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel stack"><div class="section-heading"><div><h1>Reports</h1><p class="muted">Production and sales activity</p></div><div class="no-print"><a class="button"${addAttribute(`/api/reports.csv?filter=${encodeURIComponent(filter)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, "href")}>Export CSV</a> <button id="print-report" type="button">Print / Save PDF</button></div></div><form class="filters no-print" method="get"><label>Period<select name="filter"><option value="weekly"${addAttribute(filter === "weekly", "selected")}>Last 7 days</option><option value="monthly"${addAttribute(filter === "monthly", "selected")}>This month</option><option value="range"${addAttribute(filter === "range", "selected")}>Date range</option><option value="all"${addAttribute(filter === "all", "selected")}>All time</option></select></label><label>From<input type="date" name="from"${addAttribute(from, "value")}></label><label>To<input type="date" name="to"${addAttribute(to, "value")}></label><button>Apply</button></form><div class="stats"><article class="stat-card">Production<strong>${data.totalProduction.toFixed(2)} KG</strong></article><article class="stat-card">Sales<strong>${data.totalSales.toFixed(2)} KG</strong></article><article class="stat-card">Revenue<strong>${formatMoney(data.totalRevenue)}</strong></article></div><h2>Production</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>KG</th><th>Eggs</th><th>Feed (KG)</th><th>Condition</th></tr></thead><tbody>${data.production.map((row) => renderTemplate`<tr><td>${row.tanggal}</td><td>${row.jumlah_kg}</td><td>${row.jumlah_butir}</td><td>${row.pakan_kg}</td><td>${row.kondisi_ayam}</td></tr>`)}</tbody></table></div><h2>Sales</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>Buyer</th><th>Product</th><th>KG</th><th>Total</th></tr></thead><tbody>${data.sales.map((row) => renderTemplate`<tr><td>${row.tanggal}</td><td>${row.nama_pembeli}</td><td>${row.produk}</td><td>${row.jumlah_kg}</td><td>${formatMoney(row.total_harga)}</td></tr>`)}</tbody></table></div></section>${renderScript($$result, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/reports.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/reports.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/reports.astro";
var $$url = "/reports";
// \0virtual:astro:page:src/pages/reports@_@astro
var page = () => reports_exports;
export { page };

import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { i as queryAll } from "./data_DGCQAzsc.mjs";
// src/pages/production.astro
var production_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Production,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Production = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Production;
	const params = Astro.url.searchParams;
	const from = params.get("from") ?? "";
	const to = params.get("to") ?? "";
	const q = params.get("q") ?? "";
	const rows = await queryAll((start, end) => {
		let request = Astro.locals.supabase.from("produksi").select("*").order("tanggal", { ascending: false }).order("id_produksi", { ascending: false });
		if (from) request = request.gte("tanggal", from);
		if (to) request = request.lte("tanggal", to);
		if (q) request = request.ilike("kondisi_ayam", `%${q}%`);
		return request.range(start, end);
	});
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Production" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel stack"><h1>Production records</h1><form class="filters" method="get"><label>Search condition<input name="q"${addAttribute(q, "value")}></label><label>From<input type="date" name="from"${addAttribute(from, "value")}></label><label>To<input type="date" name="to"${addAttribute(to, "value")}></label><button>Filter</button></form><details class="panel"><summary>Add production record</summary><form class="form-grid" method="post" action="/api/actions"><input type="hidden" name="action" value="production_create"><label>Date<input type="date" name="tanggal" required></label><label>Eggs<input type="number" name="jumlah_butir" min="0" step="1" required></label><label>Weight (KG)<input type="number" name="jumlah_kg" min="0" step="0.01" required></label><label>Feed (KG)<input type="number" name="pakan_kg" min="0" step="0.01" required></label><label class="wide">Chicken condition<input name="kondisi_ayam" maxlength="255" required></label><button class="wide">Save record</button></form></details><div class="table-wrap"><table><thead><tr><th>Date</th><th>Eggs</th><th>KG</th><th>Feed (KG)</th><th>Condition</th><th>Actions</th></tr></thead><tbody>${rows.map((row) => renderTemplate`<tr><td>${row.tanggal}</td><td>${row.jumlah_butir}</td><td>${row.jumlah_kg}</td><td>${row.pakan_kg}</td><td>${row.kondisi_ayam}</td><td><details><summary>Edit</summary><form class="inline-form" method="post" action="/api/actions"><input type="hidden" name="action" value="production_update"><input type="hidden" name="id"${addAttribute(row.id_produksi, "value")}><label>Date<input type="date" name="tanggal"${addAttribute(row.tanggal, "value")} required></label><label>Eggs<input type="number" name="jumlah_butir" min="0"${addAttribute(row.jumlah_butir, "value")} required></label><label>KG<input type="number" name="jumlah_kg" min="0" step=".01"${addAttribute(row.jumlah_kg, "value")} required></label><label>Feed KG<input type="number" name="pakan_kg" min="0" step=".01"${addAttribute(row.pakan_kg, "value")} required></label><label>Condition<input name="kondisi_ayam"${addAttribute(row.kondisi_ayam, "value")} required></label><button>Update</button></form></details><form method="post" action="/api/actions"><input type="hidden" name="action" value="production_delete"><input type="hidden" name="id"${addAttribute(row.id_produksi, "value")}><button class="danger">Delete</button></form></td></tr>`)}</tbody></table></div></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/production.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/production.astro";
var $$url = "/production";
// \0virtual:astro:page:src/pages/production@_@astro
var page = () => production_exports;
export { page };

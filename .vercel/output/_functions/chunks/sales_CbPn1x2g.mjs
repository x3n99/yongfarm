import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { i as queryAll, r as query } from "./data_DGCQAzsc.mjs";
import { r as formatMoney } from "./dates_C_T01N82.mjs";
// src/pages/sales.astro
var sales_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Sales,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Sales = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Sales;
	const [rows, products, prices, production] = await Promise.all([
		queryAll((from, to) => Astro.locals.supabase.from("penjualan").select("*").order("tanggal", { ascending: false }).order("id_penjualan", { ascending: false }).range(from, to)),
		query(Astro.locals.supabase.from("produk").select("nama").order("nama")),
		queryAll((from, to) => Astro.locals.supabase.from("harga").select("produk,harga,tanggal_berlaku").order("tanggal_berlaku", { ascending: false }).order("id_harga", { ascending: false }).range(from, to)),
		queryAll((from, to) => Astro.locals.supabase.from("produksi").select("id_produksi,tanggal,jumlah_butir,jumlah_kg,pakan_kg,kondisi_ayam").range(from, to))
	]);
	const latestPrices = /* @__PURE__ */ new Map();
	for (const price of prices) if (!latestPrices.has(price.produk)) latestPrices.set(price.produk, Number(price.harga));
	const kgPerEgg = production.reduce((sum, row) => sum + Number(row.jumlah_kg), 0) / Math.max(1, production.reduce((sum, row) => sum + Number(row.jumlah_butir), 0));
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Sales" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel stack"><h1>Sales records</h1><details class="panel" open><summary>Add a sale</summary><form class="form-grid" method="post" action="/api/actions"><input type="hidden" name="action" value="sales_create"><label>Date<input type="date" name="tanggal" required></label><label>Buyer<input name="nama_pembeli" maxlength="150" required></label><label>Product<select name="produk" required>${products.map((product) => renderTemplate`<option${addAttribute(product.nama, "value")}>${product.nama}</option>`)}</select></label><label>Quantity<input type="number" name="jumlah_unit" min="1" step="1" required></label><label>Unit<select name="satuan"><option value="butir">Egg</option><option value="pack_10">Pack (10)</option><option value="pack_12">Pack (12)</option><option value="tray">Tray (30)</option><option value="crate">Crate (360)</option></select></label><label>Price per egg<input type="number" name="harga_per_butir" min="0" step=".01" placeholder="Uses latest price if blank"></label><button class="wide">Save sale</button></form></details><div class="table-wrap"><table><thead><tr><th>Date</th><th>Buyer</th><th>Product</th><th>Quantity</th><th>Eggs</th><th>KG</th><th>Total</th><th>Actions</th></tr></thead><tbody>${rows.map((row) => renderTemplate`<tr><td>${row.tanggal}</td><td>${row.nama_pembeli}</td><td>${row.produk}</td><td>${row.jumlah_unit} ${row.satuan}</td><td>${row.jumlah_butir}</td><td>${row.jumlah_kg}</td><td>${formatMoney(row.total_harga)}</td><td><details><summary>Edit</summary><form class="inline-form" method="post" action="/api/actions"><input type="hidden" name="action" value="sales_update"><input type="hidden" name="id"${addAttribute(row.id_penjualan, "value")}><label>Date<input type="date" name="tanggal"${addAttribute(row.tanggal, "value")} required></label><label>Buyer<input name="nama_pembeli"${addAttribute(row.nama_pembeli, "value")} required></label><label>Product<select name="produk">${products.map((product) => renderTemplate`<option${addAttribute(row.produk === product.nama, "selected")}${addAttribute(product.nama, "value")}>${product.nama}</option>`)}</select></label><label>Qty<input type="number" name="jumlah_unit" min="1"${addAttribute(row.jumlah_unit, "value")} required></label><label>Unit<select name="satuan">${Object.entries({
		butir: "Egg",
		pack_10: "Pack (10)",
		pack_12: "Pack (12)",
		tray: "Tray (30)",
		crate: "Crate (360)"
	}).map(([value, label]) => renderTemplate`<option${addAttribute(row.satuan === value, "selected")}${addAttribute(value, "value")}>${label}</option>`)}</select></label><label>Price/egg<input type="number" name="harga_per_butir" min="0" step=".01"${addAttribute(row.harga_per_butir, "value")} required></label><button>Update</button></form></details><form method="post" action="/api/actions"><input type="hidden" name="action" value="sales_delete"><input type="hidden" name="id"${addAttribute(row.id_penjualan, "value")}><button class="danger">Delete</button></form></td></tr>`)}</tbody></table></div><p class="muted">Average weight used for new sales: ${kgPerEgg.toFixed(4)} kg per egg.</p></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/sales.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/sales.astro";
var $$url = "/sales";
// \0virtual:astro:page:src/pages/sales@_@astro
var page = () => sales_exports;
export { page };

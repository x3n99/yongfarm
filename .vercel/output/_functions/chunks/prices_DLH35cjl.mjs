import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { i as queryAll, r as query } from "./data_DGCQAzsc.mjs";
import { r as formatMoney } from "./dates_C_T01N82.mjs";
// src/pages/prices.astro
var prices_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Prices,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Prices = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Prices;
	const [prices, products] = await Promise.all([queryAll((from, to) => Astro.locals.supabase.from("harga").select("*").order("tanggal_berlaku", { ascending: false }).order("id_harga", { ascending: false }).range(from, to)), query(Astro.locals.supabase.from("produk").select("nama").order("nama"))]);
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Prices" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel stack"><h1>Price records</h1><details class="panel"><summary>Add a price</summary><form class="form-grid" method="post" action="/api/actions"><input type="hidden" name="action" value="price_create"><label>Product<select name="produk" required>${products.map((product) => renderTemplate`<option${addAttribute(product.nama, "value")}>${product.nama}</option>`)}</select></label><label>Price per egg<input type="number" name="harga" min="0" step=".01" required></label><label>Effective date<input type="date" name="tanggal_berlaku" required></label><button class="wide">Save price</button></form></details><div class="table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Effective date</th><th>Action</th></tr></thead><tbody>${prices.map((price) => renderTemplate`<tr><td>${price.produk}</td><td>${formatMoney(price.harga)}</td><td>${price.tanggal_berlaku}</td><td><form method="post" action="/api/actions"><input type="hidden" name="action" value="price_delete"><input type="hidden" name="id"${addAttribute(price.id_harga, "value")}><button class="danger">Delete</button></form></td></tr>`)}</tbody></table></div></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/prices.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/prices.astro";
var $$url = "/prices";
// \0virtual:astro:page:src/pages/prices@_@astro
var page = () => prices_exports;
export { page };

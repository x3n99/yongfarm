import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { C as renderComponent, N as addAttribute, O as renderTemplate, k as maybeRenderHead } from "./sequence_JKH1RvZ7.mjs";
import { n as createComponent } from "./BaseLayout_BnSH7keM.mjs";
import { t as createAstro } from "./compiler_BqEGlqGl.mjs";
import { t as $$AdminLayout } from "./AdminLayout_qkMR3C7H.mjs";
import { i as queryAll } from "./data_DGCQAzsc.mjs";
// src/pages/orders.astro
var orders_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Orders,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Orders = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Orders;
	const rows = await queryAll((from, to) => Astro.locals.supabase.from("pesanan").select("*").order("created_at", { ascending: false }).order("id", { ascending: false }).range(from, to));
	return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Orders" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<section class="panel stack"><h1>Customer orders</h1><div class="table-wrap"><table><thead><tr><th>Received</th><th>Name / contact</th><th>Address</th><th>Product</th><th>Quantity</th><th>Message</th><th>Status</th></tr></thead><tbody>${rows.map((row) => renderTemplate`<tr><td>${new Date(row.created_at).toLocaleString()}</td><td>${row.nama}<br><a${addAttribute(`tel:${row.no_hp}`, "href")}>${row.no_hp}</a></td><td>${row.alamat}</td><td>${row.produk}</td><td>${row.jumlah} ${row.satuan}</td><td>${row.pesan}</td><td><form class="stack" method="post" action="/api/actions"><input type="hidden" name="action" value="order_status"><input type="hidden" name="id"${addAttribute(row.id, "value")}><select name="status"><option${addAttribute(row.status === "Pending", "selected")}>Pending</option><option${addAttribute(row.status === "Processing", "selected")}>Processing</option><option${addAttribute(row.status === "Completed", "selected")}>Completed</option></select><button>Update</button></form></td></tr>`)}</tbody></table></div></section>` })}`;
}, "D:/xen/random stuffs/xenweb/testtelur2/src/pages/orders.astro", void 0);
var $$file = "D:/xen/random stuffs/xenweb/testtelur2/src/pages/orders.astro";
var $$url = "/orders";
// \0virtual:astro:page:src/pages/orders@_@astro
var page = () => orders_exports;
export { page };

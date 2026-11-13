import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { n as units, t as calculateSale } from "./sales_C05vEtpp.mjs";
import { t as businessDate } from "./dates_C_T01N82.mjs";
// src/pages/api/actions.ts
var actions_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var numeric = (form, key, minimum = 0, integer = false, allowBlank = false) => {
	const input = form.get(key);
	if (input === null || input === "") {
		if (allowBlank) return 0;
		throw new Error(`Invalid ${key}.`);
	}
	const value = Number(input);
	if (!Number.isFinite(value) || value < minimum || integer && !Number.isInteger(value)) throw new Error(`Invalid ${key}.`);
	return value;
};
var text = (form, key, max = 255) => {
	const value = String(form.get(key) ?? "").trim();
	if (!value || value.length > max) throw new Error(`Invalid ${key}.`);
	return value;
};
var id = (form) => {
	const value = Number(form.get("id"));
	if (!Number.isInteger(value) || value < 1) throw new Error("Invalid record ID.");
	return value;
};
var POST = async ({ request, locals, redirect, url }) => {
	if (request.headers.get("origin") !== url.origin) return new Response("Invalid request origin.", { status: 403 });
	const form = await request.formData();
	const action = String(form.get("action") ?? "");
	if (action !== "order_create" && (!locals.user || locals.user.app_metadata.role !== "admin")) return redirect("/auth?error=Please%20sign%20in%20as%20an%20administrator", 303);
	if (action === "order_create") {
		const product = text(form, "produk", 100);
		const unit = text(form, "satuan", 20);
		if (!Object.hasOwn(units, unit)) throw new Error("Invalid unit.");
		const { data: productRecord, error: productError } = await locals.supabase.from("produk").select("nama").eq("nama", product).maybeSingle();
		if (productError) throw new Error(`Unable to validate product: ${productError.message}`);
		if (!productRecord) throw new Error("The selected product does not exist.");
		const { error } = await locals.supabase.from("pesanan").insert({
			nama: text(form, "nama", 150),
			no_hp: text(form, "no_hp", 50),
			alamat: text(form, "alamat", 2e3),
			produk: product,
			satuan: unit,
			jumlah: numeric(form, "jumlah", 1, true),
			pesan: String(form.get("pesan") ?? "").trim().slice(0, 2e3),
			status: "Pending"
		});
		if (error) throw new Error(`Unable to submit order: ${error.message}`);
		return redirect("/?success=Order%20submitted%20successfully", 303);
	}
	if (action.startsWith("production_")) {
		if (action === "production_delete") {
			const { error } = await locals.supabase.from("produksi").delete().eq("id_produksi", id(form));
			if (error) throw new Error(`Unable to delete production record: ${error.message}`);
			return redirect("/production", 303);
		}
		if (!["production_create", "production_update"].includes(action)) return new Response("Unknown action.", { status: 400 });
		const record = {
			tanggal: text(form, "tanggal", 10),
			jumlah_butir: numeric(form, "jumlah_butir", 0, true),
			jumlah_kg: numeric(form, "jumlah_kg"),
			pakan_kg: numeric(form, "pakan_kg"),
			kondisi_ayam: text(form, "kondisi_ayam")
		};
		const result = action === "production_create" ? await locals.supabase.from("produksi").insert(record) : await locals.supabase.from("produksi").update(record).eq("id_produksi", id(form));
		if (result.error) throw new Error(`Production update failed: ${result.error.message}`);
		return redirect("/production", 303);
	}
	if (action === "sales_create" || action === "sales_update") {
		const quantity = numeric(form, "jumlah_unit", 1, true);
		const unit = text(form, "satuan", 20);
		if (!Object.hasOwn(units, unit)) throw new Error("Invalid unit.");
		const product = text(form, "produk", 100);
		let price = numeric(form, "harga_per_butir", 0, false, true);
		const { data: productRecord, error: productError } = await locals.supabase.from("produk").select("nama").eq("nama", product).maybeSingle();
		if (productError) throw new Error(`Unable to validate product: ${productError.message}`);
		if (!productRecord) throw new Error("The selected product does not exist.");
		if (!price) {
			const { data, error } = await locals.supabase.from("harga").select("harga").eq("produk", product).lte("tanggal_berlaku", businessDate()).order("tanggal_berlaku", { ascending: false }).limit(1).maybeSingle();
			if (error) throw new Error(`Unable to read current price: ${error.message}`);
			if (!data) throw new Error("No current price exists for this product.");
			price = Number(data.harga);
		}
		const { data: production, error: productionError } = await locals.supabase.from("produksi").select("jumlah_kg,jumlah_butir");
		if (productionError) throw new Error(`Unable to calculate egg weight: ${productionError.message}`);
		const kgPerEgg = (production ?? []).reduce((sum, row) => sum + Number(row.jumlah_kg), 0) / Math.max(1, (production ?? []).reduce((sum, row) => sum + Number(row.jumlah_butir), 0));
		const calculated = calculateSale(quantity, unit, price, kgPerEgg || .07);
		const record = {
			tanggal: text(form, "tanggal", 10),
			nama_pembeli: text(form, "nama_pembeli", 150),
			produk: product,
			jumlah_unit: quantity,
			satuan: unit,
			jumlah_butir: calculated.eggs,
			jumlah_kg: calculated.kg,
			harga_per_unit: price * units[unit],
			harga_unit: unit,
			harga_per_butir: price,
			harga_per_kg: calculated.pricePerKg,
			total_harga: calculated.total
		};
		const result = action === "sales_create" ? await locals.supabase.from("penjualan").insert(record) : await locals.supabase.from("penjualan").update(record).eq("id_penjualan", id(form));
		if (result.error) throw new Error(`Sales update failed: ${result.error.message}`);
		return redirect("/sales", 303);
	}
	if (action === "sales_delete") {
		const { error } = await locals.supabase.from("penjualan").delete().eq("id_penjualan", id(form));
		if (error) throw new Error(`Unable to delete sale: ${error.message}`);
		return redirect("/sales", 303);
	}
	if (action === "price_create") {
		const { error } = await locals.supabase.from("harga").insert({
			produk: text(form, "produk", 100),
			harga: numeric(form, "harga"),
			tanggal_berlaku: text(form, "tanggal_berlaku", 10)
		});
		if (error) throw new Error(`Unable to save price: ${error.message}`);
		return redirect("/prices", 303);
	}
	if (action === "price_delete") {
		const { error } = await locals.supabase.from("harga").delete().eq("id_harga", id(form));
		if (error) throw new Error(`Unable to delete price: ${error.message}`);
		return redirect("/prices", 303);
	}
	if (action === "order_status") {
		const status = text(form, "status", 20);
		if (![
			"Pending",
			"Processing",
			"Completed"
		].includes(status)) throw new Error("Invalid order status.");
		const { error } = await locals.supabase.from("pesanan").update({ status }).eq("id", id(form));
		if (error) throw new Error(`Unable to update order status: ${error.message}`);
		return redirect("/orders", 303);
	}
	return new Response("Unknown action.", { status: 400 });
};
// \0virtual:astro:page:src/pages/api/actions@_@ts
var page = () => actions_exports;
export { page };

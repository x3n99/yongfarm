import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { a as requireAdmin, n as loadReports } from "./data_DGCQAzsc.mjs";
import { n as escapeCsv } from "./dates_C_T01N82.mjs";
// src/pages/api/reports.csv.ts
var reports_csv_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ locals, url, redirect }) => {
	const user = await requireAdmin({
		locals,
		redirect
	});
	if (user instanceof Response) return user;
	const report = await loadReports(locals.supabase, url.searchParams.get("filter") ?? "monthly", url.searchParams.get("from"), url.searchParams.get("to"));
	const csv = `\uFEFF${[
		["Production report"],
		[
			"Date",
			"KG",
			"Eggs",
			"Feed (KG)",
			"Condition"
		],
		...report.production.map((row) => [
			row.tanggal,
			row.jumlah_kg,
			row.jumlah_butir,
			row.pakan_kg,
			row.kondisi_ayam
		]),
		[],
		["Sales report"],
		[
			"Date",
			"Buyer",
			"Product",
			"KG",
			"Total"
		],
		...report.sales.map((row) => [
			row.tanggal,
			row.nama_pembeli,
			row.produk,
			row.jumlah_kg,
			row.total_harga
		])
	].map((line) => line.map(escapeCsv).join(",")).join("\r\n")}`;
	return new Response(csv, { headers: {
		"Content-Type": "text/csv; charset=utf-8",
		"Content-Disposition": "attachment; filename=\"yongfarm-report.csv\"",
		"Cache-Control": "private, no-store"
	} });
};
// \0virtual:astro:page:src/pages/api/reports.csv@_@ts
var page = () => reports_csv_exports;
export { page };

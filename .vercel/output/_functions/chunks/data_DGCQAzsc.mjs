import { i as getRelativeDate, t as businessDate } from "./dates_C_T01N82.mjs";
// src/lib/data.ts
async function requireAdmin(context) {
	const user = context.locals.user;
	if (!user) return context.redirect("/auth");
	if (user.app_metadata.role !== "admin") return new Response("Administrator access is required.", { status: 403 });
	return user;
}
async function query(request) {
	const { data, error } = await request;
	if (error) throw new Error(`Supabase request failed: ${error.message}`);
	if (data === null) throw new Error("Supabase returned no data.");
	return data;
}
async function queryAll(fetchPage) {
	const rows = [];
	for (let from = 0;; from += 1e3) {
		const page = await query(fetchPage(from, from + 999));
		rows.push(...page);
		if (page.length < 1e3) return rows;
	}
}
async function loadDashboard(supabase) {
	const [production, sales] = await Promise.all([queryAll((from, to) => supabase.from("produksi").select("tanggal,jumlah_butir,jumlah_kg").order("id_produksi").range(from, to)), queryAll((from, to) => supabase.from("penjualan").select("tanggal,jumlah_butir,jumlah_kg,total_harga").order("id_penjualan").range(from, to))]);
	const today = businessDate();
	const month = today.slice(0, 7);
	const days = Array.from({ length: 7 }, (_, index) => getRelativeDate(index - 6));
	const productionByDay = /* @__PURE__ */ new Map();
	const salesByDay = /* @__PURE__ */ new Map();
	for (const row of production) productionByDay.set(row.tanggal, (productionByDay.get(row.tanggal) ?? 0) + Number(row.jumlah_butir));
	for (const row of sales) salesByDay.set(row.tanggal, (salesByDay.get(row.tanggal) ?? 0) + Number(row.jumlah_butir));
	return {
		stock: production.reduce((sum, row) => sum + Number(row.jumlah_butir), 0) - sales.reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
		todayProduction: productionByDay.get(today) ?? 0,
		monthProduction: production.filter((row) => row.tanggal.startsWith(month)).reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
		monthSales: sales.filter((row) => row.tanggal.startsWith(month)).reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
		monthRevenue: sales.filter((row) => row.tanggal.startsWith(month)).reduce((sum, row) => sum + Number(row.total_harga), 0),
		chart: days.map((date) => ({
			date,
			production: productionByDay.get(date) ?? 0,
			sales: salesByDay.get(date) ?? 0
		}))
	};
}
function reportDateFilter(filter, from, to) {
	if (filter === "range" && from && to) return {
		from,
		to
	};
	const today = businessDate();
	if (filter === "weekly") {
		const start = /* @__PURE__ */ new Date(`${today}T00:00:00`);
		start.setDate(start.getDate() - 6);
		return {
			from: start.toISOString().slice(0, 10),
			to: today
		};
	}
	if (filter === "monthly") return {
		from: `${today.slice(0, 7)}-01`,
		to: today
	};
	return {};
}
async function loadReports(supabase, filter, from, to) {
	const dates = reportDateFilter(filter, from, to);
	const productionPage = (from, to) => {
		let request = supabase.from("produksi").select("*");
		if ("from" in dates && dates.from) request = request.gte("tanggal", dates.from);
		if ("to" in dates && dates.to) request = request.lte("tanggal", dates.to);
		return request.order("tanggal", { ascending: true }).order("id_produksi").range(from, to);
	};
	const salesPage = (from, to) => {
		let request = supabase.from("penjualan").select("*");
		if ("from" in dates && dates.from) request = request.gte("tanggal", dates.from);
		if ("to" in dates && dates.to) request = request.lte("tanggal", dates.to);
		return request.order("tanggal", { ascending: true }).order("id_penjualan").range(from, to);
	};
	const [production, sales] = await Promise.all([queryAll(productionPage), queryAll(salesPage)]);
	return {
		production,
		sales,
		totalProduction: production.reduce((sum, row) => sum + Number(row.jumlah_kg), 0),
		totalSales: sales.reduce((sum, row) => sum + Number(row.jumlah_kg), 0),
		totalRevenue: sales.reduce((sum, row) => sum + Number(row.total_harga), 0),
		dates
	};
}
export { requireAdmin as a, queryAll as i, loadReports as n, query as r, loadDashboard as t };

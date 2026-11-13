// src/lib/dates.ts
function businessDate(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Kuala_Lumpur",
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(date);
	const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
	return `${values.year}-${values.month}-${values.day}`;
}
function getRelativeDate(offset) {
	const [year, month, day] = businessDate().split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, day + offset)).toISOString().slice(0, 10);
}
function formatMoney(value) {
	return new Intl.NumberFormat("en-MY", {
		style: "currency",
		currency: "MYR"
	}).format(Number(value));
}
function escapeCsv(value) {
	const text = String(value ?? "");
	return `"${(/^[\t\r\n ]*[=+\-@]/.test(text) ? `'${text}` : text).replaceAll("\"", "\"\"")}"`;
}
export { getRelativeDate as i, escapeCsv as n, formatMoney as r, businessDate as t };

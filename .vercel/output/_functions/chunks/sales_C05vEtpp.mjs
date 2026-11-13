// src/lib/sales.ts
var units = {
	butir: 1,
	pack_10: 10,
	pack_12: 12,
	tray: 30,
	crate: 360
};
function calculateSale(quantity, unit, pricePerEgg, kgPerEgg) {
	const eggs = quantity * units[unit];
	return {
		eggs,
		kg: Math.round(eggs * kgPerEgg * 100) / 100,
		pricePerKg: kgPerEgg > 0 ? Math.round(pricePerEgg / kgPerEgg * 100) / 100 : 0,
		total: Math.round(eggs * pricePerEgg * 100) / 100
	};
}
export { units as n, calculateSale as t };

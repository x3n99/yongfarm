export const units = {
  butir: 1,
  pack_10: 10,
  pack_12: 12,
  tray: 30,
  crate: 360,
} as const;

export function calculateSale(quantity: number, unit: keyof typeof units, pricePerEgg: number, kgPerEgg: number) {
  const eggs = quantity * units[unit];
  return {
    eggs,
    kg: Math.round(eggs * kgPerEgg * 100) / 100,
    pricePerKg: kgPerEgg > 0 ? Math.round((pricePerEgg / kgPerEgg) * 100) / 100 : 0,
    total: Math.round(eggs * pricePerEgg * 100) / 100,
  };
}

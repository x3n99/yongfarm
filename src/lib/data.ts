import type { AstroGlobal } from 'astro';
import { businessDate, getRelativeDate } from './dates';

type RequestContext = Pick<AstroGlobal, 'locals' | 'redirect'>;

type DashboardProductionRow = { tanggal: string; jumlah_butir: number; jumlah_kg: number };
type DashboardSalesRow = { tanggal: string; jumlah_butir: number; jumlah_kg: number; total_harga: number };
type ProductionReportRow = {
  tanggal: string;
  jumlah_butir: number;
  jumlah_kg: number;
  pakan_kg: number;
  kondisi_ayam: string | null;
};
type SalesReportRow = {
  tanggal: string;
  nama_pembeli: string;
  produk: string;
  jumlah_kg: number;
  total_harga: number;
};
export type ProductRecord = { id_produk: number; nama: string; deskripsi: string | null; image: string | null };
export type PriceRecord = { id_harga: number; produk: string; harga: number | string; tanggal_berlaku: string };
export type ProductionRecord = {
  id_produksi: number;
  tanggal: string;
  jumlah_butir: number | string;
  jumlah_kg: number | string;
  pakan_kg: number | string;
  kondisi_ayam: string | null;
};
export type SaleRecord = {
  id_penjualan: number;
  order_id: number | null;
  tanggal: string;
  nama_pembeli: string;
  produk: string;
  jumlah_unit: number;
  satuan: string;
  jumlah_butir: number | string;
  jumlah_kg: number | string;
  harga_per_unit: number | string;
  harga_unit: string;
  harga_per_butir: number | string;
  harga_per_kg: number | string;
  total_harga: number | string;
};
export type OrderRecord = {
  id: number;
  nama: string;
  no_hp: string;
  alamat: string;
  produk: string;
  satuan: string;
  jumlah: number;
  pesan: string | null;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  created_at: string;
};

export async function requireAdmin(context: RequestContext) {
  const user = context.locals.user;
  if (!user) return context.redirect('/auth');
  if (user.app_metadata.role !== 'admin') {
    return new Response('Administrator access is required.', { status: 403 });
  }
  return user;
}

export async function query<T>(
  request: PromiseLike<{ data: T | null; error: { message: string } | null }>,
): Promise<T> {
  const { data, error } = await request;
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  if (data === null) throw new Error('Supabase returned no data.');
  return data;
}

export async function queryAll<T>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
): Promise<T[]> {
  const rows: T[] = [];
  for (let from = 0; ; from += 1000) {
    const page = await query<T[]>(fetchPage(from, from + 999));
    rows.push(...page);
    if (page.length < 1000) return rows;
  }
}

export async function loadDashboard(supabase: App.Locals['supabase']) {
  const [production, sales] = await Promise.all([
    queryAll<DashboardProductionRow>((from, to) => supabase.from('produksi')
      .select('tanggal,jumlah_butir,jumlah_kg').order('id_produksi').range(from, to)),
    queryAll<DashboardSalesRow>((from, to) => supabase.from('penjualan')
      .select('tanggal,jumlah_butir,jumlah_kg,total_harga').order('id_penjualan').range(from, to)),
  ]);
  const today = businessDate();
  const month = today.slice(0, 7);
  const days = Array.from({ length: 7 }, (_, index) => getRelativeDate(index - 6));
  const productionByDay = new Map<string, number>();
  const salesByDay = new Map<string, number>();
  for (const row of production) {
    productionByDay.set(row.tanggal, (productionByDay.get(row.tanggal) ?? 0) + Number(row.jumlah_butir));
  }
  for (const row of sales) {
    salesByDay.set(row.tanggal, (salesByDay.get(row.tanggal) ?? 0) + Number(row.jumlah_butir));
  }
  return {
    stock: production.reduce((sum, row) => sum + Number(row.jumlah_butir), 0)
      - sales.reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
    todayProduction: productionByDay.get(today) ?? 0,
    monthProduction: production.filter((row) => row.tanggal.startsWith(month))
      .reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
    monthSales: sales.filter((row) => row.tanggal.startsWith(month))
      .reduce((sum, row) => sum + Number(row.jumlah_butir), 0),
    monthRevenue: sales.filter((row) => row.tanggal.startsWith(month))
      .reduce((sum, row) => sum + Number(row.total_harga), 0),
    chart: days.map((date) => ({
      date,
      production: productionByDay.get(date) ?? 0,
      sales: salesByDay.get(date) ?? 0,
    })),
  };
}

export function reportDateFilter(filter: string, from?: string | null, to?: string | null) {
  if (filter === 'range' && from && to) return { from, to };
  const today = businessDate();
  if (filter === 'weekly') {
    const start = new Date(`${today}T00:00:00`);
    start.setDate(start.getDate() - 6);
    return { from: start.toISOString().slice(0, 10), to: today };
  }
  if (filter === 'monthly') return { from: `${today.slice(0, 7)}-01`, to: today };
  return {};
}

export async function loadReports(
  supabase: App.Locals['supabase'],
  filter: string,
  from?: string | null,
  to?: string | null,
) {
  const dates = reportDateFilter(filter, from, to);
  const productionPage = (from: number, to: number) => {
    let request = supabase.from('produksi').select('*');
    if ('from' in dates && dates.from) {
      request = request.gte('tanggal', dates.from);
    }
    if ('to' in dates && dates.to) {
      request = request.lte('tanggal', dates.to);
    }
    return request.order('tanggal', { ascending: true }).order('id_produksi').range(from, to);
  };
  const salesPage = (from: number, to: number) => {
    let request = supabase.from('penjualan').select('*');
    if ('from' in dates && dates.from) request = request.gte('tanggal', dates.from);
    if ('to' in dates && dates.to) request = request.lte('tanggal', dates.to);
    return request.order('tanggal', { ascending: true }).order('id_penjualan').range(from, to);
  };
  const [production, sales] = await Promise.all([
    queryAll<ProductionReportRow>(productionPage),
    queryAll<SalesReportRow>(salesPage),
  ]);
  return {
    production,
    sales,
    totalProduction: production.reduce((sum, row) => sum + Number(row.jumlah_kg), 0),
    totalSales: sales.reduce((sum, row) => sum + Number(row.jumlah_kg), 0),
    totalRevenue: sales.reduce((sum, row) => sum + Number(row.total_harga), 0),
    dates,
  };
}

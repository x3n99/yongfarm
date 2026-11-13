import type { APIRoute } from 'astro';
import { requireAdmin, loadReports } from '@/lib/data';
import { escapeCsv } from '@/lib/dates';

export const GET: APIRoute = async ({ locals, url, redirect }) => {
  const user = await requireAdmin({ locals, redirect });
  if (user instanceof Response) return user;
  const report = await loadReports(
    locals.supabase,
    url.searchParams.get('filter') ?? 'monthly',
    url.searchParams.get('from'),
    url.searchParams.get('to'),
  );
  const lines = [
    ['Production report'],
    ['Date', 'KG', 'Eggs', 'Feed (KG)', 'Condition'],
    ...report.production.map((row) => [row.tanggal, row.jumlah_kg, row.jumlah_butir, row.pakan_kg, row.kondisi_ayam]),
    [],
    ['Sales report'],
    ['Date', 'Buyer', 'Product', 'KG', 'Total'],
    ...report.sales.map((row) => [row.tanggal, row.nama_pembeli, row.produk, row.jumlah_kg, row.total_harga]),
  ];
  const csv = `\uFEFF${lines.map((line) => line.map(escapeCsv).join(',')).join('\r\n')}`;
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="yongfarm-report.csv"',
      'Cache-Control': 'private, no-store',
    },
  });
};

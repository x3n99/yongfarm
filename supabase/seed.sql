insert into public.produk (nama, deskripsi, image)
values
  ('Layer Chicken Eggs', 'High-quality layer chicken eggs, ideal for daily consumption', 'https://x3n99.github.io/logotelur.png'),
  ('Omega-3 Eggs', 'Eggs enriched with omega-3 from specialized feed', 'https://x3n99.github.io/logotelur2.png'),
  ('Free-range Eggs', 'Organic free-range eggs with a natural taste', 'https://x3n99.github.io/logotelur3.png')
on conflict (nama) do nothing;

insert into public.harga (produk, harga, tanggal_berlaku)
select produk, harga, current_date - hari
from (values
  ('Layer Chicken Eggs', 0.50::numeric, 6),
  ('Layer Chicken Eggs', 0.52::numeric, 3),
  ('Layer Chicken Eggs', 0.55::numeric, 0),
  ('Omega-3 Eggs', 0.60::numeric, 4),
  ('Omega-3 Eggs', 0.62::numeric, 0),
  ('Free-range Eggs', 0.55::numeric, 2),
  ('Free-range Eggs', 0.57::numeric, 0)
) as seed(produk, harga, hari)
where not exists (
  select 1 from public.harga existing
  where existing.produk = seed.produk and existing.tanggal_berlaku = current_date - seed.hari
);

alter table public.pesanan
  drop constraint if exists pesanan_status_check;

alter table public.pesanan
  add constraint pesanan_status_check
  check (status in ('Pending', 'Processing', 'Completed', 'Cancelled'));

alter table public.penjualan
  add column if not exists order_id bigint
    references public.pesanan (id) on delete restrict;

create unique index if not exists penjualan_order_id_unique_idx
  on public.penjualan (order_id)
  where order_id is not null;

create or replace function public.set_order_status(
  p_order_id bigint,
  p_status text,
  p_sale_date date
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.pesanan%rowtype;
  v_sale_id bigint;
  v_price numeric(14, 2);
  v_kg_per_egg numeric;
  v_total_eggs bigint;
  v_total_kg numeric;
  v_unit_count integer;
  v_eggs integer;
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'Administrator access is required.';
  end if;

  if p_status is null or p_status not in ('Pending', 'Processing', 'Completed', 'Cancelled') then
    raise exception 'Invalid order status.';
  end if;

  select *
    into v_order
    from public.pesanan
   where id = p_order_id
   for update;

  if not found then
    raise exception 'Order not found.';
  end if;

  if v_order.status = 'Completed' then
    if p_status = 'Completed' then
      select id_penjualan
        into v_sale_id
        from public.penjualan
       where order_id = p_order_id;
      if v_sale_id is not null then
        return v_sale_id;
      end if;
      raise exception 'This is a historical completed order without a linked sale. Review it manually to avoid duplicate sales.';
    end if;
    raise exception 'A completed order cannot be changed.';
  end if;

  if v_order.status = 'Cancelled' then
    if p_status = 'Cancelled' then
      return null;
    end if;
    raise exception 'A cancelled order cannot be changed.';
  end if;

  if p_status = 'Pending' and v_order.status <> 'Pending' then
    raise exception 'An order cannot be moved back to Pending.';
  end if;

  if p_status = 'Completed' and v_order.status <> 'Processing' then
    raise exception 'Move the order to Processing before completing it.';
  end if;

  if p_status <> 'Completed' then
    update public.pesanan
       set status = p_status
     where id = p_order_id;
    return null;
  end if;

  if p_sale_date is null then
    raise exception 'A sale date is required to complete an order.';
  end if;

  v_unit_count := case v_order.satuan
    when 'butir' then 1
    when 'pack_10' then 10
    when 'pack_12' then 12
    when 'tray' then 30
    when 'crate' then 360
    else null
  end;

  if v_unit_count is null then
    raise exception 'The order has an unsupported unit.';
  end if;

  if v_order.jumlah::bigint * v_unit_count > 2147483647 then
    raise exception 'The order quantity exceeds the maximum supported sale quantity.';
  end if;
  v_eggs := v_order.jumlah * v_unit_count;

  select harga
    into v_price
    from public.harga
   where produk = v_order.produk
     and tanggal_berlaku <= p_sale_date
   order by tanggal_berlaku desc, id_harga desc
   limit 1;

  if v_price is null then
    raise exception 'No current price exists for this product.';
  end if;

  select coalesce(sum(jumlah_butir), 0), coalesce(sum(jumlah_kg), 0)
    into v_total_eggs, v_total_kg
    from public.produksi;
  v_kg_per_egg := coalesce(v_total_kg / nullif(v_total_eggs, 0), 0.07);

  insert into public.penjualan (
    order_id,
    tanggal,
    nama_pembeli,
    produk,
    jumlah_unit,
    satuan,
    jumlah_butir,
    jumlah_kg,
    harga_per_unit,
    harga_unit,
    harga_per_butir,
    harga_per_kg,
    total_harga
  ) values (
    p_order_id,
    p_sale_date,
    v_order.nama,
    v_order.produk,
    v_order.jumlah,
    v_order.satuan,
    v_eggs,
    round(v_eggs * v_kg_per_egg, 2),
    round(v_price * v_unit_count, 2),
    v_order.satuan,
    v_price,
    round(v_price / v_kg_per_egg, 2),
    round(v_eggs * v_price, 2)
  )
  returning id_penjualan into v_sale_id;

  update public.pesanan
     set status = 'Completed'
   where id = p_order_id;

  return v_sale_id;
end;
$$;

revoke all on function public.set_order_status(bigint, text, date) from public, anon;
grant execute on function public.set_order_status(bigint, text, date) to authenticated;

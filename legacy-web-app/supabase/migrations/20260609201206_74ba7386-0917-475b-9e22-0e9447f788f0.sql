alter table public.shop_products add column if not exists compare_price numeric;

drop view if exists public.shop_products_public;
create view public.shop_products_public as
  select id, name, name_bn, name_ar, description, image_url,
         gallery_image_urls, price, compare_price, stock, show_stock, min_stock,
         category_id, category_ids, warehouse_item_id, item_code, barcode,
         tax_rate, tax_inclusive, is_visible, is_featured, sort_order,
         search_keywords, location, created_at, updated_at
  from public.shop_products
  where is_visible = true and coalesce(is_deleted, false) = false;

grant select on public.shop_products_public to anon, authenticated;
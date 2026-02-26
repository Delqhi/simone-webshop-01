package admin

import (
	"context"
	"fmt"
	"strings"
)

func (s *Store) ListSuppliers(ctx context.Context, p SupplierListParams) ([]map[string]any, int, error) {
	where, args := supplierWhereClause(p)
	countQuery := "select count(*) from public.suppliers s where " + where

	var total int
	if err := s.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	sortCol := pickSortColumn(p.SortBy, "s.created_at", map[string]string{
		"created_at": "s.created_at",
		"updated_at": "s.updated_at",
		"name":       "s.name",
		"status":     "s.status",
		"rating":     "s.rating",
	})
	sortOrder := normalizeSortOrder(p.SortOrder)

	args = append(args, p.Limit, (p.Page-1)*p.Limit)
	query := fmt.Sprintf(`
select row_to_json(t)::jsonb
from (
  select s.id::text as id,
         s.name,
         s.email,
         s.contact_email,
         s.phone,
         s.website,
         s.api_endpoint,
         s.fulfillment_mode,
         s.auto_fulfill_enabled,
         s.sla_hours,
         s.api_secret_ref,
         s.status,
         s.rating,
         s.notes,
         s.contact_person,
         s.country,
         s.shipping_time_days,
         s.minimum_order,
         s.metadata,
         s.created_at,
         s.updated_at,
         (select count(*) from public.products p where p.supplier_id = s.id) as products_count
  from public.suppliers s
  where %s
  order by %s %s
  limit $%d offset $%d
) t
`, where, sortCol, sortOrder, len(args)-1, len(args))

	items, err := queryJSONRows(ctx, s.pool, query, args...)
	if err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func supplierWhereClause(p SupplierListParams) (string, []any) {
	where := []string{"1=1"}
	args := make([]any, 0, 4)

	if status := strings.TrimSpace(p.Status); status != "" {
		args = append(args, status)
		where = append(where, fmt.Sprintf("s.status = $%d", len(args)))
	}
	if search := strings.TrimSpace(p.Search); search != "" {
		args = append(args, "%"+search+"%")
		idx := len(args)
		where = append(where, fmt.Sprintf("(s.name ilike $%d or s.email ilike $%d or s.website ilike $%d)", idx, idx, idx))
	}
	return strings.Join(where, " and "), args
}

func (s *Store) GetSupplier(ctx context.Context, id string) (map[string]any, error) {
	const query = `
select row_to_json(t)::jsonb
from (
  select s.id::text as id,
         s.name,
         s.email,
         s.contact_email,
         s.phone,
         s.website,
         s.api_endpoint,
         s.fulfillment_mode,
         s.auto_fulfill_enabled,
         s.sla_hours,
         s.api_secret_ref,
         s.status,
         s.rating,
         s.notes,
         s.contact_person,
         s.country,
         s.shipping_time_days,
         s.minimum_order,
         s.metadata,
         s.created_at,
         s.updated_at,
         coalesce(
           (
             select jsonb_agg(jsonb_build_object('id', p.id::text, 'name', p.name, 'price', p.price, 'stock', p.stock, 'is_active', p.is_active))
             from public.products p
             where p.supplier_id = s.id
           ),
           '[]'::jsonb
         ) as products
  from public.suppliers s
  where s.id::text = $1
  limit 1
) t
`
	return queryJSONObject(ctx, s.pool, query, id)
}

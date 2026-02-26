package admin

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
)

func (s *Store) CreateSupplier(ctx context.Context, body map[string]any) (map[string]any, error) {
	name := asString(body["name"])
	email := asString(body["email"])
	if name == "" || email == "" {
		return nil, errInvalidInput
	}

	const query = `
select row_to_json(t)::jsonb
from (
  insert into public.suppliers (
    name, email, contact_email, phone, website, api_endpoint, api_key, status, rating,
    notes, contact_person, country, shipping_time_days, minimum_order, metadata,
    fulfillment_mode, auto_fulfill_enabled, sla_hours, api_secret_ref
  ) values (
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    $10, $11, $12, $13, $14, coalesce($15::jsonb, '{}'::jsonb),
    $16, $17, $18, $19
  )
  returning id::text as id, name, email, contact_email, phone, website, api_endpoint, status, rating,
            notes, contact_person, country, shipping_time_days, minimum_order,
            metadata, fulfillment_mode, auto_fulfill_enabled, sla_hours, api_secret_ref, created_at, updated_at
) t
`

	return queryJSONObject(ctx, s.pool, query,
		name,
		email,
		defaultString(body["contact_email"], email),
		asNullableString(body["phone"]),
		asNullableString(body["website"]),
		asNullableString(body["api_endpoint"]),
		asNullableString(body["api_key"]),
		defaultString(body["status"], "pending"),
		asFloat(body["rating"], 0),
		asNullableString(body["notes"]),
		asNullableString(body["contact_person"]),
		defaultString(body["country"], "DE"),
		asInt(body["shipping_time_days"], 7),
		asFloat(body["minimum_order"], 0),
		body["metadata"],
		defaultString(body["fulfillment_mode"], "email"),
		asBool(body["auto_fulfill_enabled"], false),
		asInt(body["sla_hours"], 48),
		asNullableString(body["api_secret_ref"]),
	)
}

func (s *Store) UpdateSupplier(ctx context.Context, id string, body map[string]any) (map[string]any, error) {
	setParts := make([]string, 0, 12)
	args := make([]any, 0, 14)
	appendField := func(col, key string) {
		v, ok := body[key]
		if !ok {
			return
		}
		args = append(args, v)
		setParts = append(setParts, fmt.Sprintf("%s = $%d", col, len(args)))
	}

	appendField("name", "name")
	appendField("email", "email")
	appendField("contact_email", "contact_email")
	appendField("phone", "phone")
	appendField("website", "website")
	appendField("api_endpoint", "api_endpoint")
	appendField("api_key", "api_key")
	appendField("api_secret_ref", "api_secret_ref")
	appendField("status", "status")
	appendField("rating", "rating")
	appendField("notes", "notes")
	appendField("contact_person", "contact_person")
	appendField("country", "country")
	appendField("shipping_time_days", "shipping_time_days")
	appendField("minimum_order", "minimum_order")
	appendField("fulfillment_mode", "fulfillment_mode")
	appendField("auto_fulfill_enabled", "auto_fulfill_enabled")
	appendField("sla_hours", "sla_hours")
	appendField("metadata", "metadata")

	if len(setParts) == 0 {
		return nil, errEmptyPatch
	}

	setParts = append(setParts, "updated_at = now()")
	args = append(args, id)
	query := fmt.Sprintf(`
select row_to_json(t)::jsonb
from (
  update public.suppliers
  set %s
  where id::text = $%d
  returning id::text as id, name, email, contact_email, phone, website, api_endpoint, status, rating,
            notes, contact_person, country, shipping_time_days, minimum_order,
            metadata, fulfillment_mode, auto_fulfill_enabled, sla_hours, api_secret_ref, created_at, updated_at
) t
`, strings.Join(setParts, ",\n      "), len(args))

	return queryJSONObject(ctx, s.pool, query, args...)
}

func (s *Store) DeleteSupplier(ctx context.Context, id string) error {
	var productCount int
	if err := s.pool.QueryRow(ctx, `select count(*) from public.products where supplier_id::text = $1`, id).Scan(&productCount); err != nil {
		return err
	}
	if productCount > 0 {
		return errBlocked
	}

	cmd, err := s.pool.Exec(ctx, `delete from public.suppliers where id::text = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func defaultString(v any, fallback string) string {
	raw := strings.TrimSpace(asString(v))
	if raw == "" {
		return fallback
	}
	return raw
}

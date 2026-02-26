package suppliers

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func (s *Store) ProcessWebhook(ctx context.Context, supplierSlug string, payload webhookPayload) (bool, error) {
	eventType := eventTypeForStatus(payload.Status)
	eventPayload, err := json.Marshal(map[string]any{
		"supplier":          strings.TrimSpace(supplierSlug),
		"external_event_id": payload.EventID,
		"order_id":          payload.OrderID,
		"status":            strings.ToLower(strings.TrimSpace(payload.Status)),
		"tracking_number":   payload.TrackingNumber,
		"tracking_url":      payload.TrackingURL,
		"external_order_id": payload.ExternalOrderID,
		"raw":               payload.Raw,
	})
	if err != nil {
		return false, err
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return false, err
	}
	defer tx.Rollback(ctx)

	var inboxID string
	err = tx.QueryRow(ctx, `
insert into public.event_inbox (external_event_id, event_type, payload, status)
values ($1, $2, $3::jsonb, 'processing')
on conflict (external_event_id) do nothing
returning id::text
`, payload.EventID, eventType, string(eventPayload)).Scan(&inboxID)
	if err == pgx.ErrNoRows {
		return true, tx.Commit(ctx)
	}
	if err != nil {
		return false, err
	}

	_, err = tx.Exec(ctx, `
insert into public.event_outbox (event_type, aggregate_type, aggregate_id, payload, status)
values ($1, 'order', $2, $3::jsonb, 'pending')
`, eventType, payload.OrderID, string(eventPayload))
	if err != nil {
		return false, err
	}

	_, err = tx.Exec(ctx, `
update public.event_inbox
set status = 'processed',
    processed_at = now(),
    error_message = null,
    updated_at = now()
where id::text = $1
`, inboxID)
	if err != nil {
		return false, err
	}

	return false, tx.Commit(ctx)
}

func eventTypeForStatus(status string) string {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "placed", "accepted", "confirmed", "supplier_ordered":
		return "supplier.order.placed"
	case "failed", "error", "rejected", "cancelled":
		return "supplier.order.failed"
	default:
		return "shipment.updated"
	}
}

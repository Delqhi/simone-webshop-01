package admin

import (
	"context"
	"encoding/json"
	"time"
)

func (s *Store) IngestChannelEvents(ctx context.Context, channel string, items []map[string]any) (ChannelEventsIngestResult, error) {
	normalized := normalizeChannels([]string{channel})
	if len(normalized) == 0 || len(items) == 0 {
		return ChannelEventsIngestResult{}, errInvalidInput
	}
	channel = normalized[0]
	result := ChannelEventsIngestResult{Channel: channel, Received: len(items), At: time.Now().UTC()}

	for _, item := range items {
		inserted, err := s.insertChannelEvent(ctx, channel, item)
		if err != nil {
			return ChannelEventsIngestResult{}, err
		}
		if inserted {
			result.Inserted++
		} else {
			result.Duplicates++
		}
	}
	return result, nil
}

func (s *Store) insertChannelEvent(ctx context.Context, channel string, item map[string]any) (bool, error) {
	eventID := asString(item["event_id"])
	if eventID == "" {
		eventID = asString(item["id"])
	}
	if eventID == "" {
		return false, errInvalidInput
	}
	payload, err := json.Marshal(item)
	if err != nil {
		return false, err
	}

	const rawInsert = `
insert into public.channel_events_raw (channel, event_id, payload, status)
values ($1, $2, $3::jsonb, 'ingested')
on conflict (event_id) do nothing
`
	inserted, err := s.pool.Exec(ctx, rawInsert, channel, eventID, string(payload))
	if err != nil {
		return false, err
	}
	if inserted.RowsAffected() == 0 {
		return false, nil
	}

	if err := s.insertAttributionTouchpoint(ctx, channel, eventID, item); err != nil {
		return false, err
	}
	return true, nil
}

func (s *Store) insertAttributionTouchpoint(ctx context.Context, channel, eventID string, item map[string]any) error {
	orderID := validUUIDOrEmpty(asString(item["order_id"]))
	campaignID := validUUIDOrEmpty(asString(item["campaign_id"]))
	sessionID := asString(item["session_id"])
	if orderID == "" && campaignID == "" && sessionID == "" {
		return nil
	}
	touchType := asString(item["touch_type"])
	if touchType == "" {
		touchType = "click"
	}
	touchedAt := asString(item["touched_at"])
	if touchedAt == "" {
		touchedAt = time.Now().UTC().Format(time.RFC3339)
	}
	meta, err := json.Marshal(asMap(item["metadata"]))
	if err != nil {
		return err
	}

	const touchInsert = `
insert into public.attribution_touchpoints (
  order_id, session_id, channel, campaign_id, touch_type, touched_at, dedupe_key, metadata
)
values (
  nullif($1, '')::uuid,
  nullif($2, ''),
  $3,
  nullif($4, '')::uuid,
  $5,
  $6::timestamptz,
  $7,
  $8::jsonb
)
on conflict (dedupe_key) do nothing
`
	_, err = s.pool.Exec(ctx, touchInsert, orderID, sessionID, channel, campaignID, touchType, touchedAt, eventID, string(meta))
	return err
}

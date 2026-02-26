package admin

import (
	"context"
	"encoding/json"
)

func (s *Store) GetChannelHealth(ctx context.Context, channel string) (map[string]any, error) {
	normalized := normalizeChannels([]string{channel})
	if len(normalized) == 0 {
		return nil, errInvalidInput
	}
	channel = normalized[0]

	const accountQuery = `
select status, connection_mode, last_connected_at, last_health_at, auth_snapshot
from public.channel_accounts
where channel = $1
order by updated_at desc
limit 1
`
	var status string
	var mode string
	var lastConnected any
	var lastHealth any
	var rawAuth []byte
	if err := s.pool.QueryRow(ctx, accountQuery, channel).Scan(&status, &mode, &lastConnected, &lastHealth, &rawAuth); err != nil {
		return nil, err
	}
	auth := map[string]any{}
	_ = json.Unmarshal(rawAuth, &auth)

	const syncQuery = `
select sync_type, status, created_at, completed_at, coalesce(error_message, '')
from public.channel_sync_runs
where channel = $1
order by created_at desc
limit 1
`
	var lastSyncType string
	var lastSyncStatus string
	var lastSyncAt any
	var lastSyncDone any
	var lastSyncErr string
	_ = s.pool.QueryRow(ctx, syncQuery, channel).Scan(&lastSyncType, &lastSyncStatus, &lastSyncAt, &lastSyncDone, &lastSyncErr)

	const failQuery = `
select count(*)::int
from public.channel_sync_runs
where channel = $1
  and status = 'failed'
  and created_at >= now() - interval '24 hours'
`
	var failures24h int
	if err := s.pool.QueryRow(ctx, failQuery, channel).Scan(&failures24h); err != nil {
		return nil, err
	}

	token := extractToken(auth)
	catalogEndpoint := asString(auth["catalog_sync_endpoint"])
	campaignEndpoint := asString(auth["campaign_publish_endpoint"])
	healthy := (status == "connected" || status == "degraded") && failures24h < 10

	return map[string]any{
		"channel":                channel,
		"status":                 status,
		"connection_mode":        mode,
		"last_connected_at":      lastConnected,
		"last_health_at":         lastHealth,
		"last_sync_type":         lastSyncType,
		"last_sync_status":       lastSyncStatus,
		"last_sync_created_at":   lastSyncAt,
		"last_sync_completed_at": lastSyncDone,
		"last_sync_error":        lastSyncErr,
		"sync_failures_24h":      failures24h,
		"token_present":          token != "",
		"catalog_endpoint":       catalogEndpoint,
		"campaign_endpoint":      campaignEndpoint,
		"healthy":                healthy,
	}, nil
}

func extractToken(auth map[string]any) string {
	candidates := []string{
		asString(auth["access_token"]),
		asString(auth["api_token"]),
		asString(auth["api_key"]),
	}
	for _, candidate := range candidates {
		if candidate != "" {
			return candidate
		}
	}
	return ""
}

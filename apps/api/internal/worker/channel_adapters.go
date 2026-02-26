package worker

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type channelAccountRuntime struct {
	ConnectionMode string
	AuthSnapshot   map[string]any
}

func (p *Processor) executeChannelSync(ctx context.Context, channel, syncType, runID string, requestedPayload map[string]any) (map[string]any, error) {
	account, err := p.loadConnectedChannelAccount(ctx, channel)
	if err != nil {
		return nil, err
	}
	request := map[string]any{
		"channel":           channel,
		"sync_type":         syncType,
		"sync_run_id":       runID,
		"requested_payload": requestedPayload,
		"requested_at":      time.Now().UTC().Format(time.RFC3339),
	}
	return p.dispatchChannelRequest(ctx, account, syncType, request)
}

func (p *Processor) publishTrendLaunch(ctx context.Context, channel, launchID, candidateID string, spendCapDaily float64) (map[string]any, string, error) {
	account, err := p.loadConnectedChannelAccount(ctx, channel)
	if err != nil {
		return nil, "", err
	}
	request := map[string]any{
		"channel":            channel,
		"sync_type":          "campaign_publish",
		"trend_launch_id":    launchID,
		"trend_candidate_id": candidateID,
		"spend_cap_daily":    spendCapDaily,
		"requested_at":       time.Now().UTC().Format(time.RFC3339),
	}
	response, err := p.dispatchChannelRequest(ctx, account, "campaign_publish", request)
	if err != nil {
		return nil, "", err
	}
	externalID := extractExternalCampaignID(response)
	return response, externalID, nil
}

func (p *Processor) dispatchChannelRequest(ctx context.Context, account *channelAccountRuntime, syncType string, request map[string]any) (map[string]any, error) {
	endpoint := resolveChannelEndpoint(syncType, account.AuthSnapshot)
	if endpoint == "" {
		return nil, fmt.Errorf("%w: channel_endpoint_missing", ErrPermanent)
	}
	token := extractChannelAccessToken(account.AuthSnapshot)

	body, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	client := &http.Client{Timeout: 20 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 1024*512))
	response := map[string]any{}
	_ = json.Unmarshal(raw, &response)
	if len(response) == 0 && strings.TrimSpace(string(raw)) != "" {
		response["raw_body"] = string(raw)
	}
	response["status_code"] = resp.StatusCode

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		if resp.StatusCode >= 400 && resp.StatusCode < 500 && resp.StatusCode != 429 {
			return nil, fmt.Errorf("%w: channel_api_non_2xx:%d", ErrPermanent, resp.StatusCode)
		}
		return nil, fmt.Errorf("channel_api_non_2xx:%d", resp.StatusCode)
	}

	return map[string]any{
		"connection_mode": account.ConnectionMode,
		"provider_result": response,
		"processed_at":    time.Now().UTC().Format(time.RFC3339),
	}, nil
}

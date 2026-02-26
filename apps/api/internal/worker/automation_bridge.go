package worker

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

func (p *Processor) postAutomationEvent(ctx context.Context, eventType string, payload map[string]any) error {
	webhookURL := strings.TrimSpace(p.options.N8NWebhookURL)
	if webhookURL == "" {
		return nil
	}

	body, err := json.Marshal(map[string]any{
		"event_type":  eventType,
		"occurred_at": time.Now().UTC().Format(time.RFC3339),
		"payload":     payload,
	})
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, webhookURL, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Simone-Event-Type", eventType)

	secret := strings.TrimSpace(p.options.N8NSharedSecret)
	if secret != "" {
		req.Header.Set("X-Simone-Signature", signPayload(secret, body))
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return nil
	}
	return fmt.Errorf("automation_bridge_non_2xx:%d", resp.StatusCode)
}

func signPayload(secret string, body []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write(body)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}
